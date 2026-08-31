// 홈 화면을 처음 열 때 실제로 내려받는 양 — 캐시 없이, 압축된 상태로.
const { chromium } = require("playwright");
const zlib = require("zlib");
const BASE = process.argv[2], NAME = process.argv[3];
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const by = new Map();
  p.on("response", async (r) => {
    try {
      const buf = await r.body();
      const t = (r.request().resourceType() || "기타");
      // 실제 서비스는 gzip 으로 내려간다. 시험용 서버는 안 하므로 여기서 잰다.
      const gz = zlib.gzipSync(buf).length;
      by.set(t, (by.get(t) ?? 0) + gz);
    } catch {}
  });
  const t0 = Date.now();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const ms = Date.now() - t0;
  const total = [...by.values()].reduce((a, x) => a + x, 0);
  const parts = [...by.entries()].sort((a, c) => c[1] - a[1])
    .map(([k, v]) => `${k} ${(v / 1024).toFixed(0)}KB`).join(" · ");
  console.log(`${NAME.padEnd(8)} 첫 화면 ${(total / 1024).toFixed(0)}KB (gzip) · ${ms}ms · ${parts}`);
  await b.close();
})();
