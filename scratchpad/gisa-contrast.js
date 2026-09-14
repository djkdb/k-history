// 글씨 대비를 계산이 아니라 실제로 칠해진 픽셀로 잰다.
//
// 계산으로 재려던 앞선 판은 두 번 틀렸다. 알파를 버려 530건을 거짓으로
// 잡았고, 그것을 고치자 이번에는 페이지 바탕이 그라디언트라는 이유로
// 757곳을 "잴 수 없다" 며 건너뛰었다 — 어두운 화면에서는 사실상 아무것도
// 재지 않은 셈이다.
//
// 그래서 화면을 두 번 찍는다. 한 번은 그대로, 한 번은 모든 글씨를 투명하게
// 만들고. 두 번째 그림의 그 자리 색이 바로 "글씨 뒤에 실제로 있는 색" 이다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const fs = require("fs");
const path = require("path");
const { PNG } = (() => { try { return require("pngjs"); } catch { return {}; } })();
const OUT = path.resolve("gisa/out");
const BASE = process.argv[2] || "http://127.0.0.1:4975";
let bad = 0, checked = 0;
const no = (s) => { bad++; console.log("  ✗ " + s); };

function lum([r, g, b]) {
  const f = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

(async () => {
  if (!PNG) { console.log("pngjs 가 없어 픽셀을 읽지 못한다"); process.exit(2); }
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  // 개념 화면은 생김새가 같으므로 셋만 본다 — 나머지는 다 돈다
  const all = walk(OUT).filter((f) => f.endsWith(".html") && !f.includes("/_next/"))
    .map((f) => "/" + path.relative(OUT, f).replace(/\.html$/, "").replace(/\/?index$/, ""))
    .map((r) => (r === "" ? "/" : r));
  const concepts = all.filter((r) => r.startsWith("/concept/"));
  const routes = [...all.filter((r) => !r.startsWith("/concept/")), ...concepts.slice(0, 3)];

  for (const theme of ["dark", "light"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await ctx.addInitScript((t) => { try { localStorage.setItem("gisa:theme", t);
      if (localStorage.getItem("__s__")) return; localStorage.setItem("__s__","1");
      localStorage.setItem("gisa:mirror:gisa-state", JSON.stringify({ state: {
        settings:{track:"written",examDate:"2026-10-14"},
        stats:{xp:300,streak:3,lastStudyDate:null,studyMinutes:60},
        studiedIds:["d-sdlc"],clearedQuestionIds:[],clearedPracticalIds:[],
        reviewCards:[],quizHistory:[],wrongIds:["d-sdlc"],
        mockAttempts:[{track:"written",startedAt:1,finishedAt:2,score:40,passed:false,bySubject:[
          {subject:"design",correct:12,total:20},{subject:"develop",correct:10,total:20},
          {subject:"database",correct:9,total:20},{subject:"language",correct:5,total:20},
          {subject:"system",correct:10,total:20}]}]}})); } catch {} }, theme);
    const p = await ctx.newPage();
    console.log(`\n[${theme === "dark" ? "어두운" : "밝은"} 화면]`);
    const seen = new Set();

    for (const r of routes) {
      let loaded = false;
      for (let tryN = 0; tryN < 3 && !loaded; tryN++) {
        await p.goto(BASE + r, { waitUntil: "networkidle" }).catch(() => {});
        await p.waitForTimeout(350);
        loaded = await p.evaluate(() => document.documentElement.lang === "ko" && !!document.title);
      }
      if (!loaded) { no(`${r} 를 세 번 시도해도 불러오지 못했다`); continue; }

      // 재야 할 글씨들의 자리와 색
      const items = await p.evaluate(() => {
        /*
         * 색 문자열은 직접 뜯지 않는다.
         *
         * ⚠️ 이 앱의 글씨 색은 계산된 값이 oklch(0.871 0.006 286.286) 처럼 나온다.
         *    앞선 판은 거기서 숫자 셋을 뽑아 RGB 로 읽었고, 0.871 을 R=0.871 로
         *    본 탓에 밝은 회색 글씨를 거의 검정으로 쟀다 — 멀쩡한 97곳을
         *    대비 미달로 적었다. 캔버스에 한 점 찍어 브라우저가 변환한 RGB 를
         *    받아 온다.
         */
        const cv = document.createElement("canvas");
        cv.width = cv.height = 1;
        const c2 = cv.getContext("2d", { willReadFrequently: true });
        const toRGB = (color) => {
          c2.clearRect(0, 0, 1, 1);
          c2.fillStyle = "#000";
          c2.fillStyle = color;          // 못 읽는 값이면 앞서 넣은 값이 남는다
          c2.fillRect(0, 0, 1, 1);
          const d = c2.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2], d[3] / 255];
        };
        const out = [];
        for (const el of document.querySelectorAll("p, span, li, h1, h2, h3, button, a, td, th")) {
          const t = (el.innerText || "").trim();
          if (!t || t.length < 2) continue;
          if (el.querySelector("p, span, div, button, a")) continue;
          const r2 = el.getBoundingClientRect();
          if (r2.width < 4 || r2.height < 4) continue;
          if (r2.bottom < 0 || r2.top > innerHeight || r2.right < 0 || r2.left > innerWidth) continue;
          /*
           * 잴 자리가 다른 것에 가려져 있지 않은가.
           *
           * ⚠️ 아래에 늘 떠 있는 길잡이 막대가 화면 밑동을 덮는다. 그 아래 깔린
           *    단추의 한가운데를 재면 길잡이의 색을 재는 꼴이 된다. 실제로 흰
           *    알약 위의 검은 글씨(17:1)를 1.06:1 로 적었다. 그 자리에 정말 이
           *    요소가 있는지 물어보고 잰다.
           */

          /*
           * 비활성화된 조작 요소는 건너뛴다.
           *
           * WCAG 1.4.3 은 쓸 수 없는 상태의 요소를 대비 기준에서 명시적으로
           * 뺀다. 이 앱들도 흐리게(opacity 40%) 그려 "지금은 누를 수 없다" 를
           * 알리는데, 그것을 미달로 세면 흐리게 하는 뜻 자체가 없어진다.
           */
          if (el.closest("[disabled],[aria-disabled='true']")) continue;
          const px = Math.round(r2.left + Math.min(r2.width / 2, 40));
          const py = Math.round(r2.top + r2.height / 2);
          const hit = document.elementFromPoint(px, py);
          if (!hit || (hit !== el && !el.contains(hit) && !hit.contains(el))) continue;

          const cs = getComputedStyle(el);
          out.push({
            t: t.slice(0, 26),
            x: px,
            y: py,
            box: { x: Math.round(r2.left), y: Math.round(r2.top), w: Math.round(r2.width), h: Math.round(r2.height) },
            rgb: toRGB(cs.color),
            size: parseFloat(cs.fontSize),
            weight: parseInt(cs.fontWeight) || 400,
          });
        }
        return out;
      });
      if (!items.length) continue;

      // 글씨를 투명하게 만들고 찍어 "글씨 뒤의 색" 을 얻는다
      const shotOn = PNG.sync.read(await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 844 } }));
      await p.addStyleTag({ content: "*{color:transparent !important;text-shadow:none !important}" });
      await p.waitForTimeout(120);
      const shot = await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 844 } });
      const img = PNG.sync.read(shot);

        /*
         * 실제로 칠해진 글씨 색을 찾는다.
         *
         * ⚠️ getComputedStyle(el).color 는 filter 를 적용하기 *전* 값이다.
         *    한국사의 .era-ink 는 filter: brightness(0.33) 으로 시대색을 어둡게
         *    깔아 주는데, 계산값만 읽으면 그 보정을 못 본다 — 멀쩡한 곳을
         *    미달로 적게 된다. 글씨가 보이는 그림과 감춘 그림을 견주어,
         *    바탕에서 가장 멀리 떨어진 픽셀(글자 속)을 글씨 색으로 잡는다.
         */
        const inkAt = (on, off, box, bg) => {
          /*
           * 글자 속 색을 고를 때 "바탕에서 가장 먼 픽셀" 을 잡으면 안 된다.
           *
           * ⚠️ 제목에 이모지가 섞이면(🧩 데이터 모델링) 이모지의 진한 색이
           *    가장 멀어서 그것을 글씨 색으로 잡는다. 이모지는 그림이지 글씨가
           *    아니고, WCAG 대비 기준도 글씨를 두고 하는 말이다.
           *    글자는 이모지보다 훨씬 많은 픽셀을 차지하므로, 가장 흔한 색을
           *    고르면 자연히 글자 속 색이 잡힌다.
           */
          const tally = new Map();
          const x0 = Math.max(0, box.x), x1 = Math.min(on.width - 1, box.x + box.w);
          const y0 = Math.max(0, box.y), y1 = Math.min(on.height - 1, box.y + box.h);
          for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
              const i = (on.width * y + x) << 2;
              const j = (off.width * y + x) << 2;
              // 감춘 그림과 다른 자리 = 글자가 칠해진 자리
              const moved = Math.abs(on.data[i] - off.data[j]) + Math.abs(on.data[i+1] - off.data[j+1]) + Math.abs(on.data[i+2] - off.data[j+2]);
              if (moved < 12) continue;
              const px = [on.data[i], on.data[i+1], on.data[i+2]];
              // 가장자리는 바탕과 섞인 색이다 — 충분히 진한 것만 센다
              const d = Math.abs(px[0]-bg[0]) + Math.abs(px[1]-bg[1]) + Math.abs(px[2]-bg[2]);
              if (d < 40) continue;
              const k = (px[0] >> 2) + "," + (px[1] >> 2) + "," + (px[2] >> 2);
              const cur = tally.get(k);
              if (cur) cur.n++;
              else tally.set(k, { n: 1, px });
            }
          }
          let best = null, most = 0;
          for (const v of tally.values()) if (v.n > most) { most = v.n; best = v.px; }
          return most >= 4 ? best : null;
        };
      const pick = (x, y) => {
        x = Math.max(0, Math.min(img.width - 1, x));
        y = Math.max(0, Math.min(img.height - 1, y));
        const i = (img.width * y + x) << 2;
        return [img.data[i], img.data[i + 1], img.data[i + 2]];
      };

      for (const it of items) {
        if (!it.rgb || it.rgb.length < 3) continue;
        const bg = pick(it.x, it.y);
        // 실제로 칠해진 글씨 색을 먼저 찾는다 (filter·투명도가 모두 반영된 값)
        const inked = it.box ? inkAt(shotOn, img, it.box, bg) : null;
        const a = it.rgb[3] === undefined ? 1 : it.rgb[3];
        const fg = inked ?? [0, 1, 2].map((i) => it.rgb[i] * a + bg[i] * (1 - a));
        const rr = ratio(fg, bg);
        checked++;
        const big = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
        const need = big ? 3 : 4.5;
        if (rr >= need) continue;
        const key = it.t + it.rgb.join();
        if (seen.has(key)) continue;
        seen.add(key);
        no(`대비 ${rr.toFixed(2)}:1 (${need} 필요) — "${it.t}" ${Math.round(it.size)}px ${r}`);
      }
    }
    await ctx.close();
  }
  await b.close();
  console.log(`\n글씨 ${checked}곳을 실제 픽셀로 쟀다`);
  console.log(bad ? `문제 ${bad}건` : "✓ 대비 이상 없음");
  process.exit(bad ? 1 : 0);
})();
