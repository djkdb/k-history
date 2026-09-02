// 소음이 실제로 스피커까지 나가는지 재는 자 — destination 으로 가는 신호를 가로챈다.
const { chromium } = require("/home/user/k-history/node_modules/playwright");
const fs = require("fs");
const BASE = process.env.BASE || "http://127.0.0.1:4322";

(async () => {
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(([k, v]) => {
    try { localStorage.setItem(k, v); } catch {}
    const orig = AudioNode.prototype.connect;
    window.__an = null; window.__ctx = null;
    AudioNode.prototype.connect = function (dest, ...rest) {
      try {
        if (dest && dest.context && dest === dest.context.destination) {
          if (!window.__an || window.__an.context !== dest.context) {
            window.__an = dest.context.createAnalyser();
            window.__an.fftSize = 4096;
            orig.call(window.__an, dest);
            window.__ctx = dest.context;
          }
          orig.call(this, window.__an);
        }
      } catch {}
      return orig.call(this, dest, ...rest);
    };
  }, ["toeic:mirror:toeic-state", fs.readFileSync(`${__dirname}/toeic-demo-state.json`, "utf8")]);

  const p = await ctx.newPage();
  await p.goto(`${BASE}/part/2`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1600);

  const bad = [];
  for (const kind of ["시험장", "카페", "공사장"]) {
    await p.getByRole("button", { name: kind, exact: true }).click();
    await p.waitForTimeout(2000);
    // 여러 번 재서 가장 큰 값을 쓴다 (공사장은 쿵 소리가 간헐적이다)
    let best = { rms: 0, peak: 0 };
    for (let i = 0; i < 12; i++) {
      const r = await p.evaluate(() => {
        const an = window.__an;
        if (!an) return null;
        const buf = new Float32Array(an.fftSize);
        an.getFloatTimeDomainData(buf);
        let s = 0, peak = 0;
        for (let j = 0; j < buf.length; j++) { s += buf[j] * buf[j]; const a = Math.abs(buf[j]); if (a > peak) peak = a; }
        return { rms: Math.sqrt(s / buf.length), peak };
      });
      if (r && r.rms > best.rms) best = r;
      await p.waitForTimeout(250);
    }
    const db = 20 * Math.log10(best.rms || 1e-9);
    // 너무 작으면 안 들리고, 너무 크면 말소리를 덮거나 찌그러진다
    const tooQuiet = best.rms < 0.06;
    const tooLoud = best.rms > 0.2 || best.peak > 0.8;
    const mark = !tooQuiet && !tooLoud ? "✓" : tooQuiet ? "작음" : "큼";
    console.log(`  ${mark} ${kind.padEnd(4)} RMS ${best.rms.toFixed(4)} (${db.toFixed(1)} dBFS) · peak ${best.peak.toFixed(3)}`);
    if (mark !== "✓") bad.push(`${kind}(${mark})`);
  }
  await b.close();
  console.log(bad.length ? `\n✗ 크기가 안 맞는 것: ${bad.join(", ")}` : "\n✓ 셋 다 알맞은 크기");
  process.exit(bad.length ? 1 : 0);
})();
