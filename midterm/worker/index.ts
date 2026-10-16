/**
 * 중간고사 앱 — 정적 파일(out-all/)은 그대로 내주고, /api/sync 만 여기서 받는다.
 *
 * 기기 간 이어하기: "기록 코드" 하나로 다섯 과목의 공부 기록을 맡겨 두고 꺼내 쓴다.
 *   POST /api/sync/new              새 코드 만들기 → { code }
 *   GET  /api/sync/:code            코드가 있는지 → { ok, courses: { db: at, … } }
 *   GET  /api/sync/:code/:course    기록 꺼내기 → { at, state } (아직 없으면 at 0)
 *   PUT  /api/sync/:code/:course    기록 맡기기 { at, state } → { at }
 *
 * 코드는 헷갈리는 글자(0 O 1 I L)를 뺀 31글자 중 10자리 — 약 8×10¹⁴ 가지라 맞혀 들어올 수 없다.
 * 기록에는 이름·이메일 같은 개인 정보가 없다 (푼 문제 번호와 날짜뿐).
 */
interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  SYNC: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
}

const ALPHA = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // 31자 (0 O 1 I L 제외)
const CODE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/;
const COURSES = new Set(["db", "ml", "se", "cs", "ir"]);
const MAX = 1_500_000; // 한 과목 기록 상한 (글자 수)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

function newCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => ALPHA[b % ALPHA.length]).join("");
}

async function api(req: Request, env: Env, parts: string[]): Promise<Response> {
  if (parts[0] === "new" && req.method === "POST") {
    for (let i = 0; i < 5; i++) {
      const code = newCode();
      if (await env.SYNC.get(`code:${code}`)) continue;
      await env.SYNC.put(`code:${code}`, JSON.stringify({ created: Date.now(), courses: {} }));
      return json({ code });
    }
    return json({ error: "다시 시도해 주세요" }, 503);
  }
  const code = (parts[0] ?? "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (!CODE.test(code)) return json({ error: "코드 형식이 아니에요" }, 400);
  const metaRaw = await env.SYNC.get(`code:${code}`);
  if (!metaRaw) return json({ error: "없는 코드예요" }, 404);
  const meta = JSON.parse(metaRaw) as { created: number; courses: Record<string, number> };

  if (parts.length === 1 && req.method === "GET") return json({ ok: true, courses: meta.courses });

  const course = parts[1];
  if (!course || !COURSES.has(course)) return json({ error: "없는 과목" }, 404);
  const key = `data:${code}:${course}`;

  if (req.method === "GET") {
    const raw = await env.SYNC.get(key);
    return raw ? new Response(raw, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } }) : json({ at: 0, state: null });
  }
  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > MAX) return json({ error: "기록이 너무 커요" }, 413);
    let body: { at?: unknown; state?: unknown };
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: "잘못된 기록" }, 400);
    }
    if (typeof body.at !== "number" || !body.state || typeof body.state !== "object") return json({ error: "잘못된 기록" }, 400);
    const at = Math.min(body.at, Date.now() + 60_000);
    await env.SYNC.put(key, JSON.stringify({ at, state: body.state }));
    meta.courses[course] = at;
    await env.SYNC.put(`code:${code}`, JSON.stringify(meta));
    return json({ at });
  }
  return json({ error: "지원하지 않는 요청" }, 405);
}

/**
 * 듣기 녹음 — /api/audio/<과목>/<지문>.mp3
 * 정적 파일 서빙은 Range 요청을 받지 않아(늘 200 통째) 아이폰 사파리가 재생·탐색을
 * 못 한다. 그래서 녹음만 여기를 거쳐 요청한 바이트 구간을 206 으로 잘라 준다.
 * 파일 이름이 글의 지문이라 내용이 바뀌면 이름도 바뀐다 → 오래 캐시해도 된다.
 */
const AUDIO = /^\/api\/audio\/(db|ml|se|cs|ir)\/([0-9a-z]+)\.mp3$/;
async function audio(req: Request, env: Env, course: string, hash: string, origin: string): Promise<Response> {
  const res = await env.ASSETS.fetch(new Request(`${origin}/${course}/listen/${hash}.mp3`));
  if (!res.ok) return new Response("없는 녹음", { status: 404 });
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const base = {
    "content-type": "audio/mpeg",
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=31536000, immutable",
  };
  const range = req.headers.get("range");
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return new Response(req.method === "HEAD" ? null : buf, { headers: { ...base, "content-length": String(size) } });
  let start = m[1] ? Number(m[1]) : 0;
  let end = m[2] ? Number(m[2]) : size - 1;
  if (!m[1] && m[2]) {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  }
  end = Math.min(end, size - 1);
  if (start > end || start >= size)
    return new Response(null, { status: 416, headers: { ...base, "content-range": `bytes */${size}` } });
  return new Response(req.method === "HEAD" ? null : buf.slice(start, end + 1), {
    status: 206,
    headers: { ...base, "content-range": `bytes ${start}-${end}/${size}`, "content-length": String(end - start + 1) },
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const a = AUDIO.exec(url.pathname);
    if (a && (req.method === "GET" || req.method === "HEAD")) return audio(req, env, a[1], a[2], url.origin);
    if (url.pathname.startsWith("/api/sync/")) {
      try {
        return await api(req, env, url.pathname.slice("/api/sync/".length).split("/").filter(Boolean));
      } catch {
        return json({ error: "잠시 후 다시 시도해 주세요" }, 500);
      }
    }
    return env.ASSETS.fetch(req);
  },
};
