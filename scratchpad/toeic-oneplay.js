// 영어 음성이 있는 기기를 흉내 내고 "한 번만 재생"이 실제로 막는지 본다.
const { chromium } = require("playwright");
const BASE = process.argv[2];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    // 가짜 영어 목소리. speak 는 곧바로 끝난 것으로 친다.
    const mk = (name, lang) => ({ name, lang, default: false, localService: true, voiceURI: name });
    const list = [mk("Samantha", "en-US"), mk("Daniel", "en-GB"), mk("Karen", "en-AU"), mk("Alex", "en-US")];
    const ss = window.speechSynthesis;
    Object.defineProperty(ss, "getVoices", { value: () => list, configurable: true });
    Object.defineProperty(ss, "speak", {
      value: (u) => { setTimeout(() => u.onend && u.onend(new Event("end")), 20); },
      configurable: true,
    });
    Object.defineProperty(ss, "cancel", { value: () => {}, configurable: true });
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
  const txt = () => p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  const hit = (re) => p.evaluate((s) => {
    const rx = new RegExp(s);
    const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && rx.test((x.innerText || "").trim()));
    if (!b) return false; b.click(); return true;
  }, re);

  // ① 한 번만 재생 켜기
  await p.goto(BASE + "/mock", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  const before = await txt();
  console.log("  안내가 뜨는가(음성 있음):", /영어 음성이 없습니다/.test(before) ? "아직 없음 안내 ✗" : "정상 ✓");
  // 스위치 찾기
  const toggled = await p.evaluate(() => {
    const el = [...document.querySelectorAll("button,[role='switch'],input[type=checkbox]")]
      .find((x) => /한 번만 재생/.test((x.closest("div")?.innerText || x.innerText || "")));
    if (!el) return false; el.click(); return true;
  });
  console.log("  '한 번만 재생' 스위치:", toggled ? "켬 ✓" : "못 찾음 ✗");
  await p.waitForTimeout(400);

  // ② 듣기 모의고사 시작
  const href = await p.evaluate(() => [...document.querySelectorAll("a[href*='exam=lc']")]
    .map(a => a.getAttribute("href")).find(h => !h.includes("resume")));
  await p.goto(BASE + href, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const t0 = await txt();
  console.log("  첫 화면에 '듣기' 단추:", /듣기/.test(t0) ? "있음 ✓" : "없음 ✗");

  await hit("^듣기$");
  await p.waitForTimeout(2500);
  const t1 = await txt();
  console.log("  한 번 들은 뒤:", /이 지문은 이미 나갔습니다/.test(t1) ? "'이미 나갔습니다' ✓" : (/듣기/.test(t1) ? "아직 다시 들을 수 있음 ✗" : "재생 중"));

  // ③ 같은 지문의 다음 문항으로 가도 막히는가 (Part 3·4 는 지문 하나에 3문항)
  await hit("^다음$");
  await p.waitForTimeout(700);
  const t2 = await txt();
  console.log("  다음 문항에서:", /이 지문은 이미 나갔습니다|듣기/.test(t2) ? (/이미 나갔습니다/.test(t2) ? "막힘 ✓" : "새 지문이라 들을 수 있음 (정상)") : "?");

  // ④ 새로고침하면?
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(1400);
  const t3 = await txt();
  console.log("  새로고침 뒤 1번 문항:", /이 지문은 이미 나갔습니다/.test(t3) ? "여전히 막힘 ✓" : "다시 들을 수 있음 ← 새로고침으로 풀린다");
  console.log("  " + (errs.length ? "예외: " + [...new Set(errs)].join(" / ") : "예외 없음"));
  await b.close();
})();
