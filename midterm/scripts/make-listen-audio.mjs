/*
 * 듣기 대본(src/courses/<과목>/listen.ts)을 Fish Audio 목소리로 녹음한다.
 *
 *   FISH_API_KEY=... node scripts/make-listen-audio.mjs [과목...] [--dry] [--prune]
 *
 * 조각마다 글의 지문(fnv)을 이름으로 assets/<과목>/listen/<지문>.mp3 를 만들고,
 * 길이(초)를 src/courses/<과목>/listen-audio.json 에 적는다. 이미 있는 녹음은
 * 건너뛰므로 끊겨도 다시 돌리면 이어서 만든다. 글을 고치면 그 조각만 새로 녹음한다.
 *
 * ⚠️ API 키는 저장소에 적지 않는다 — 환경 변수로만 받는다.
 *    --dry   돈을 쓰지 않고 녹음할 글자 수만 센다
 *    --prune 대본에서 사라진 조각의 헌 녹음을 지운다
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": join(ROOT, "src") } });
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const PRUNE = args.includes("--prune");
const COURSES = args.filter((a) => !a.startsWith("--"));
const ALL = ["db", "ml", "se", "cs", "ir"];
const KEY = process.env.FISH_API_KEY;
const VOICE = process.env.FISH_VOICE || "7bae2c48d30048c3a27b946279ac05ef";
const MODEL = process.env.FISH_MODEL || "s1";
const BITRATE = 64;

/** src/lib/fnv.ts 와 같은 셈 */
function fnv(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36) + text.length.toString(36);
}

async function tts(text) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", model: MODEL },
      body: JSON.stringify({ text, reference_id: VOICE, format: "mp3", mp3_bitrate: BITRATE, normalize: true, latency: "normal" }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const body = await res.text();
    if (res.status === 402) throw new Error(`크레딧 부족(402): ${body}`);
    if (res.status === 401) throw new Error(`키가 틀림(401): ${body}`);
    if (attempt >= 4) throw new Error(`${res.status}: ${body}`);
    await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
  }
}

let totalChars = 0;
let made = 0;
for (const c of COURSES.length ? COURSES : ALL) {
  const file = join(ROOT, "src/courses", c, "listen.ts");
  if (!existsSync(file)) continue;
  const { LISTEN } = await jiti.import(file);
  const dir = join(ROOT, "assets", c, "listen");
  mkdirSync(dir, { recursive: true });
  const manPath = join(ROOT, "src/courses", c, "listen-audio.json");
  const man = existsSync(manPath) ? JSON.parse(readFileSync(manPath, "utf8")) : {};
  const want = new Map();
  for (const s of LISTEN) for (const p of s.parts) want.set(fnv(p.say), p);
  const todo = [...want].filter(([h]) => !(man[h] && existsSync(join(dir, `${h}.mp3`))));
  const chars = todo.reduce((a, [, p]) => a + p.say.length, 0);
  totalChars += chars;
  console.log(`${c}: 조각 ${want.size}개 중 ${todo.length}개 녹음 필요 · ${chars.toLocaleString()}자`);
  if (DRY) continue;
  if (!KEY) throw new Error("FISH_API_KEY 가 없다");
  const queue = [...todo];
  const worker = async () => {
    for (let it = queue.shift(); it; it = queue.shift()) {
      const [h, p] = it;
      const buf = await tts(p.say);
      writeFileSync(join(dir, `${h}.mp3`), buf);
      man[h] = Math.round((buf.length * 8) / (BITRATE * 1000) * 10) / 10;
      writeFileSync(manPath, JSON.stringify(man, null, 1) + "\n");
      made++;
      console.log(`  ✓ ${c} ${p.t} (${man[h]}초)`);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  if (PRUNE) {
    for (const f of readdirSync(dir)) {
      const h = f.replace(/\.mp3$/, "");
      if (!want.has(h)) {
        unlinkSync(join(dir, f));
        delete man[h];
      }
    }
    for (const h of Object.keys(man)) if (!want.has(h)) delete man[h];
    writeFileSync(manPath, JSON.stringify(man, null, 1) + "\n");
  }
}
console.log(`합계 ${totalChars.toLocaleString()}자 (UTF-8 약 ${Math.round((totalChars * 2.9) / 1000)}KB)${DRY ? "" : ` · 새 녹음 ${made}개`}`);
