// 아직 안 본 토익 화면들 — 오답 노트, 꾹 눌러 뜻 보기, 받아쓰기, 소음, 어휘 시험
const { chromium } = require("playwright");
const BASE = process.argv[2];
const KEY = "toeic:mirror:toeic-state";
const ok = (s) => console.log("  ✓ " + s);
const no = (s) => { bad++; console.log("  ✗ " + s); };
let bad = 0;

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(([k]) => {
    const mk = (n, l) => ({ name: n, lang: l, default: false, localService: true, voiceURI: n });
    const list = [mk("Samantha", "en-US"), mk("Daniel", "en-GB")];
    const ss = window.speechSynthesis;
    Object.defineProperty(ss, "getVoices", { value: () => list, configurable: true });
    Object.defineProperty(ss, "speak", { value: (u) => setTimeout(() => u.onend && u.onend(new Event("end")), 20), configurable: true });
    Object.defineProperty(ss, "cancel", { value: () => {}, configurable: true });
    try {
      if (localStorage.getItem("__r__")) return;
      localStorage.setItem("__r__", "1");
      localStorage.setItem(k, JSON.stringify({ state: {
        settings: { band: 900, examDate: null, speechRate: 1, showScript: false },
        stats: { xp: 0, streak: 0, lastStudyAt: 0 },
        knownVocabIds: [], studiedGrammarIds: [], clearedQuestionIds: [],
        reviewCards: [], wrongIds: [], mockAttempts: [],
      }, version: 0 }));
    } catch {}
  }, [KEY]);
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const txt = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));

  // ── 꾹 눌러 뜻 보기 ──
  await p.goto(BASE + "/vocab", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const peek = await p.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((x) => /꾹|눌러/.test(x.innerText || "") || /뜻 보기/.test(x.getAttribute("aria-label") || ""));
    return btn ? (btn.innerText || btn.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim() : null;
  });
  if (!peek) no("'꾹 눌러 뜻 보기' 단추를 못 찾음");
  else {
    // 길이로 재면 안 된다 — 안내 문구가 짧은 뜻으로 바뀌면 오히려 줄어든다.
    // 단추 안의 글자를 그대로 본다.
    const label = () => p.evaluate(() => {
      const b = document.querySelector('[aria-label="꾹 눌러 뜻 보기"]');
      return b ? (b.innerText || "").replace(/\s+/g, " ").trim() : null;
    });
    const fire = (type) => p.evaluate((t) => {
      const b = document.querySelector('[aria-label="꾹 눌러 뜻 보기"]');
      b?.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true }));
    }, type);

    const a0 = await label();
    await fire("pointerdown");
    await p.waitForTimeout(250);
    const a1 = await label();
    await fire("pointerup");
    await p.waitForTimeout(250);
    const a2 = await label();

    const hint = /꾹 누르면/;
    if (hint.test(a0 ?? "")) ok(`처음엔 가려져 있다 ("${a0}")`);
    else no(`처음부터 뜻이 보인다 ("${a0}")`);
    if (a1 && !hint.test(a1)) ok(`꾹 누르면 뜻이 보인다 ("${a1}")`);
    else no(`꾹 눌러도 안 보인다 ("${a1}")`);
    if (hint.test(a2 ?? "")) ok(`떼면 다시 가려진다 ("${a2}")`);
    else no(`뗐는데 계속 보인다 ("${a2}")`);
  }

  // ── 어휘 시험 ──
  await p.goto(BASE + "/vocab/test", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const vt = await txt();
  if (/찾을 수 없|404/.test(vt) || vt.length < 40) no("어휘 시험 화면이 비었다");
  else ok("어휘 시험 화면이 뜬다: " + vt.slice(0, 70));

  // ── 받아쓰기 ──
  await p.goto(BASE + "/part/1", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const hasDict = await p.evaluate(() => [...document.querySelectorAll("button")].some((x) => /받아쓰기/.test(x.innerText || "")));
  if (!hasDict) no("Part 1 에 받아쓰기 단추가 없다");
  else {
    await p.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => /받아쓰기/.test(x.innerText || "")); b?.click(); });
    await p.waitForTimeout(900);
    const d = await txt();
    const hasInput = await p.evaluate(() => !!document.querySelector("input[type=text], textarea"));
    if (hasInput) ok("받아쓰기에 입력칸이 있다");
    else no("받아쓰기를 켰는데 입력칸이 없다: " + d.slice(0, 90));
  }

  // ── 소음 ──
  await p.goto(BASE + "/listen", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const noise = await p.evaluate(() => {
    const b = [...document.querySelectorAll("button")].filter((x) => /조용히|시험장|카페|공사장/.test(x.innerText || ""));
    return b.map((x) => x.innerText.trim());
  });
  if (noise.length >= 4) ok("소음 고르기 " + noise.join(" · "));
  else no("소음 단추가 " + noise.length + "개뿐");

  // ── 오답 노트 (시험을 봐야 생긴다) ──
  await p.goto(BASE + "/mock/note", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const note = await txt();
  if (/찾을 수 없|404/.test(note)) no("오답 노트 화면이 404");
  else ok("오답 노트(빈 상태): " + note.slice(0, 80));

  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  console.log(bad ? `\n문제 ${bad}건` : "\n이상 없음");
  await b.close();
})();
