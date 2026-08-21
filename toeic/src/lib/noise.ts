/**
 * 소음 훈련.
 *
 * ── 왜 넣는가 ─────────────────────────────────────────────────
 * 실제 시험장은 조용하지 않다. 에어컨이 돌고, 옆자리에서 종이를 넘기고,
 * 창밖에서 공사를 한다. 집에서 이어폰으로 또렷하게만 듣던 사람은 그날
 * 처음으로 "안 들리는 상태"를 겪는다. 일부러 시끄러운 데서 연습해 두면
 * 그 충격이 준다 — 청취 훈련에서 오래된 방법이다.
 *
 * ── 왜 소리 파일을 싣지 않는가 ────────────────────────────────
 * 소음을 녹음 파일로 넣으면 파일마다 몇 MB 씩 붙는다. 이 앱은 통째로
 * 1.6MB 라 그 순간 몸집이 몇 배가 된다. 게다가 남의 녹음을 가져다 쓰면
 * 저작권이 걸린다. 그래서 브라우저에서 직접 만들어 낸다 — 파일 0바이트.
 *
 * 만드는 방법은 간단하다. 잡음(white noise)을 걸러 내면 대부분의 생활
 * 소음이 된다.
 *   · 낮은 쪽만 남기면  → 에어컨·환풍기의 웅웅거림
 *   · 가운데만 남기면   → 사람들 웅성거림
 *   · 낮게 깔고 쿵쿵    → 공사장
 * 여기에 소리 크기를 천천히 흔들어 주면 "가만히 있는 잡음"이 아니라
 * 살아 있는 소리로 들린다.
 */

export type NoiseKind = "none" | "hall" | "cafe" | "construction";

export const NOISE_LABEL: Record<NoiseKind, string> = {
  none: "조용히",
  hall: "시험장",
  cafe: "카페",
  construction: "공사장",
};

export const NOISE_NOTE: Record<NoiseKind, string> = {
  none: "소음 없이 또렷하게 듣습니다.",
  hall: "에어컨 웅웅거림과 옆자리 부스럭거림. 실제 시험장에 가장 가깝습니다.",
  cafe: "사람들 말소리가 깔립니다. 사람 목소리끼리 겹칠 때가 가장 어렵습니다.",
  construction: "낮은 울림과 간헐적인 쿵 소리. 창밖 공사를 흉내 냅니다.",
};

export const NOISE_KINDS: NoiseKind[] = ["none", "hall", "cafe", "construction"];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let source: AudioBufferSourceNode | null = null;
let chain: AudioNode[] = [];
let thumpTimer: ReturnType<typeof setInterval> | null = null;
let current: NoiseKind = "none";

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

/** 2초짜리 잡음을 만들어 이어 붙여 튼다 — 짧게 만들어 반복해도 티가 안 난다 */
function noiseBuffer(c: AudioContext): AudioBuffer {
  const len = c.sampleRate * 2;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  // 갈색 잡음(brown noise) — 흰 잡음보다 낮게 깔려 생활 소음에 가깝다
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    d[i] = last * 3.5;
  }
  return buf;
}

function teardown() {
  if (thumpTimer) {
    clearInterval(thumpTimer);
    thumpTimer = null;
  }
  try {
    source?.stop();
  } catch {
    /* 이미 멈춰 있으면 그만 */
  }
  source?.disconnect();
  chain.forEach((n) => n.disconnect());
  source = null;
  chain = [];
}

/**
 * 소음을 켠다. level 은 0~1.
 *
 * 브라우저는 사람이 무언가 누르기 전에는 소리를 못 내게 막는다.
 * 그래서 이 함수는 반드시 누름 동작 안에서 불려야 한다.
 */
export function startNoise(kind: NoiseKind, level: number) {
  const c = audio();
  if (!c) return;
  if (kind === "none" || level <= 0) {
    stopNoise();
    return;
  }
  if (c.state === "suspended") void c.resume();

  teardown();
  current = kind;

  if (!master) {
    master = c.createGain();
    master.connect(c.destination);
  }
  master.gain.value = 0;

  source = c.createBufferSource();
  source.buffer = noiseBuffer(c);
  source.loop = true;

  const shape = c.createBiquadFilter();
  const body = c.createGain();
  chain = [shape, body];

  if (kind === "hall") {
    // 에어컨: 낮은 쪽만. 사람 목소리 대역(300~3000Hz)을 비워 둬야 말이 들린다.
    shape.type = "lowpass";
    shape.frequency.value = 420;
    body.gain.value = 1;
  } else if (kind === "cafe") {
    // 웅성거림: 사람 목소리 대역만 남긴다. 그래서 가장 방해가 된다.
    shape.type = "bandpass";
    shape.frequency.value = 900;
    shape.Q.value = 0.7;
    body.gain.value = 1.5;
  } else {
    // 공사장: 아주 낮게 깔고, 아래에서 쿵 소리를 따로 얹는다.
    shape.type = "lowpass";
    shape.frequency.value = 220;
    body.gain.value = 1.4;
  }

  source.connect(shape);
  shape.connect(body);
  body.connect(master);
  source.start();

  // 크기를 천천히 흔들어 준다 — 가만히 있는 잡음은 금방 안 들리게 된다
  const swell = c.createOscillator();
  const swellGain = c.createGain();
  swell.frequency.value = kind === "cafe" ? 0.14 : 0.07;
  swellGain.gain.value = 0.22;
  swell.connect(swellGain);
  swellGain.connect(body.gain);
  swell.start();
  chain.push(swell, swellGain);

  if (kind === "construction") {
    // 5~9초마다 한 번씩 쿵
    thumpTimer = setInterval(
      () => {
        if (!ctx || !master) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(38, t + 0.28);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.5);
      },
      5000 + Math.floor(Math.random() * 4000),
    );
  }

  // 갑자기 켜지면 놀란다. 0.4초에 걸쳐 올린다.
  const target = Math.min(0.5, Math.max(0, level)) * 0.5;
  master.gain.setValueAtTime(0.0001, c.currentTime);
  master.gain.exponentialRampToValueAtTime(
    Math.max(0.0002, target),
    c.currentTime + 0.4,
  );
}

export function setNoiseLevel(level: number) {
  if (!ctx || !master) return;
  const target = Math.min(0.5, Math.max(0, level)) * 0.5;
  master.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.15);
}

export function stopNoise() {
  if (ctx && master) {
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
  }
  const t = setTimeout(teardown, 320);
  // 화면을 떠나면 타이머까지 정리한다
  if (typeof window !== "undefined") window.addEventListener("pagehide", () => clearTimeout(t), { once: true });
  current = "none";
}

export function noiseRunning(): NoiseKind {
  return current;
}
