import type { Speaker } from "./types";

/**
 * 듣기 음성.
 *
 * 음성 파일을 싣지 않고 기기에 이미 있는 목소리로 읽힌다. 그래서 앱이 가벼워지고
 * 오프라인에서도 그대로 되지만, 대신 기기마다 있는 목소리가 다르다.
 * 여기서 하는 일은 "그 기기에 있는 것 중 가장 나은 영어 목소리를 고르고,
 * 화자마다 다른 목소리를 일관되게 붙여 주는 것"이다.
 *
 * ⚠️ speechSynthesis 는 브라우저마다 버릇이 다르다. 아래 세 가지를 다룬다.
 *   1) 목소리 목록이 처음엔 비어 있다가 나중에 채워진다 (voiceschanged)
 *   2) 한 번 말이 끊기면 다음 speak() 가 통째로 무시되는 기기가 있다 (cancel 후 한 박자)
 *   3) 화면을 벗어나면 말이 계속 흘러 다음 화면에서 겹친다 (반드시 정리)
 */

export interface Voice {
  voice: SpeechSynthesisVoice;
  /** 사람이 알아볼 이름 */
  label: string;
}

let cached: SpeechSynthesisVoice[] | null = null;

export function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * 영어 목소리를 모은다.
 *
 * 목록이 비동기로 채워지는 브라우저가 있어 한 번 기다려 준다.
 * 그래도 비면 그 기기에는 영어 음성이 없는 것이다 — 화면에서 그렇게 알린다.
 */
export function loadVoices(timeoutMs = 2000): Promise<SpeechSynthesisVoice[]> {
  if (!supported()) return Promise.resolve([]);
  if (cached && cached.length) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const pick = () => {
      const all = window.speechSynthesis.getVoices();
      const en = all.filter((v) => /^en(-|_|$)/i.test(v.lang));
      if (en.length) {
        cached = en;
        resolve(en);
        return true;
      }
      return false;
    };
    if (pick()) return;

    const onChange = () => {
      if (pick()) {
        window.speechSynthesis.removeEventListener("voiceschanged", onChange);
        clearTimeout(timer);
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
    const timer = setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      cached = window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
      resolve(cached);
    }, timeoutMs);
  });
}

/**
 * 화자별 목소리를 정한다.
 *
 * 실제 시험은 미국·영국·캐나다·호주 발음이 섞여 나온다. 기기에 그만한 목소리가
 * 없을 때가 많으므로, 있는 것 안에서 최대한 갈라 준다. 중요한 것은 발음의 국적보다
 * **남/여가 구분되어 대화가 따라가지는 것**이다.
 */
export function assignVoices(
  voices: SpeechSynthesisVoice[],
  /** 지문마다 다른 조합이 나오도록 돌려 쓰는 값 */
  rotate = 0,
): Record<Speaker, SpeechSynthesisVoice | null> {
  const empty: Record<Speaker, SpeechSynthesisVoice | null> = {
    man: null,
    woman: null,
    man2: null,
    woman2: null,
    narrator: null,
  };
  if (!voices.length) return empty;

  // 이름으로 성별을 짐작한다. 기기가 성별을 알려 주지 않기 때문이다.
  const femaleHint =
    /female|woman|samantha|victoria|karen|moira|tessa|fiona|serena|allison|ava|susan|zira|hazel|catherine|linda|아리아|female/i;
  const maleHint =
    /male|man|daniel|alex|fred|tom|oliver|george|james|david|mark|guy|ryan|아론/i;

  const female = voices.filter((v) => femaleHint.test(v.name));
  const male = voices.filter((v) => maleHint.test(v.name) && !femaleHint.test(v.name));
  const rest = voices.filter((v) => !female.includes(v) && !male.includes(v));

  /*
   * 발음 국적을 섞는다.
   *
   * 실제 시험은 미국·영국·캐나다·호주 넷이 돌아가며 나온다. 어느 발음이
   * 나오느냐로 체감 난이도가 크게 갈리는데(특히 호주·영국), 그동안은
   * 남녀만 가르고 국적은 보지 않아 기기 기본 목소리 하나로만 들렸다.
   * 미국 발음에만 익숙해진 채로 시험장에 가면 그날 처음 영국 발음을 듣는다.
   *
   * 기기에 있는 목소리의 lang(en-US·en-GB·en-AU…)으로 갈라 두고, 화자마다
   * 다른 쪽에서 뽑는다. 한 종류밖에 없는 기기에서는 예전처럼 동작한다.
   */
  const byLang = (list: SpeechSynthesisVoice[]) => {
    const groups = new Map<string, SpeechSynthesisVoice[]>();
    for (const v of list) {
      const key = v.lang.replace("_", "-").toLowerCase();
      groups.set(key, [...(groups.get(key) ?? []), v]);
    }
    // en-US 를 앞에 두되 나머지도 반드시 쓰이도록 이름순으로 고정한다
    return [...groups.entries()]
      .sort((a, b) => (a[0] === "en-us" ? -1 : b[0] === "en-us" ? 1 : a[0].localeCompare(b[0])))
      .map(([, vs]) => vs);
  };

  /** n 번째 화자에게 줄 목소리 — 국적을 먼저 갈라 놓고 그중에서 고른다 */
  const pick = (list: SpeechSynthesisVoice[], n: number) => {
    const source = list.length ? list : rest.length ? rest : voices;
    const groups = byLang(source);
    if (!groups.length) return null;
    const g = groups[(n + rotate) % groups.length];
    return g[Math.floor((n + rotate) / groups.length) % g.length] ?? g[0];
  };

  return {
    man: pick(male, 0),
    woman: pick(female, 0),
    man2: pick(male, 1),
    woman2: pick(female, 1),
    // 안내 방송은 실제 시험에서도 한 사람이 쭉 읽는다 — 돌리지 않는다
    narrator: (female.length ? byLang(female) : byLang(male.length ? male : voices))[0]?.[0] ?? null,
  };
}

export interface SpeakOptions {
  voice?: SpeechSynthesisVoice | null;
  /** 1.0 이 보통 속도. 실제 시험은 이 언저리다. */
  rate?: number;
  /** 말이 끝난 뒤 쉬는 시간(ms) — 실제 시험도 문장 사이에 틈이 있다 */
  gapMs?: number;
  signal?: AbortSignal;
}

/** 한 문장을 읽는다. 끝나면(또는 중단되면) 풀린다. */
export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (!supported() || !text.trim()) return Promise.resolve();
  const { voice, rate = 1, gapMs = 0, signal } = opts;

  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();

    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    u.rate = Math.min(2, Math.max(0.5, rate));
    u.pitch = 1;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      signal?.removeEventListener("abort", onAbort);
      if (gapMs > 0 && !signal?.aborted) setTimeout(resolve, gapMs);
      else resolve();
    };
    const onAbort = () => {
      window.speechSynthesis.cancel();
      if (!done) {
        done = true;
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }
    };

    u.onend = finish;
    // 중단(cancel)도 error 로 들어온다. 여기서 멈추면 다음 문장이 영영 안 나온다.
    u.onerror = finish;
    signal?.addEventListener("abort", onAbort);

    window.speechSynthesis.speak(u);
  });
}

/**
 * 여러 문장을 차례로 읽는다.
 *
 * 앞의 말을 반드시 끊고 시작한다. 안 그러면 사용자가 다시 듣기를 누를 때마다
 * 목소리가 겹쳐 쌓인다.
 */
export async function speakSequence(
  lines: { text: string; voice?: SpeechSynthesisVoice | null }[],
  opts: { rate?: number; gapMs?: number; signal?: AbortSignal; onLine?: (i: number) => void } = {},
): Promise<void> {
  if (!supported()) return;
  stop();
  // 일부 기기는 cancel 직후의 speak 을 삼킨다. 한 박자 쉬고 시작한다.
  await new Promise((r) => setTimeout(r, 60));

  for (let i = 0; i < lines.length; i++) {
    if (opts.signal?.aborted) return;
    opts.onLine?.(i);
    await speak(lines[i].text, {
      voice: lines[i].voice,
      rate: opts.rate,
      gapMs: opts.gapMs ?? 350,
      signal: opts.signal,
    });
  }
  opts.onLine?.(-1);
}

export function stop(): void {
  if (supported()) window.speechSynthesis.cancel();
}

/** (A)(B)(C)(D) — 선택지를 읽어 줄 때 앞에 붙인다 */
export const CHOICE_LETTERS = ["A", "B", "C", "D"] as const;

export function letterOf(index: number): string {
  return CHOICE_LETTERS[index] ?? String(index + 1);
}
