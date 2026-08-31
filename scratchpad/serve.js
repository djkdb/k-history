// Cloudflare Pages 처럼 정적 파일을 내주는 작은 서버.
//
// npx http-server 는 out/mock.html 과 out/mock/ 이 함께 있을 때 디렉터리를
// 먼저 잡고 /mock → /mock/ 로 넘겨 404 를 낸다. 실제 배포(Cloudflare Pages)는
// 반대로 mock.html 을 먼저 찾는다. 그래서 시험용 서버가 실제와 다르게 굴어
// "없는 고장"이 잡히는 일이 있었다. 순서를 실제와 맞춘다.
//
//   node serve.js <디렉터리> <포트>
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 4322);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const base = path.join(root, clean);
  const tries =
    clean === "/"
      ? [path.join(root, "index.html")]
      : [base, `${base}.html`, path.join(base, "index.html")];
  for (const f of tries) {
    if (!f.startsWith(root)) continue;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

http
  .createServer((req, res) => {
    const file = resolve(req.url);
    if (!file) {
      const four = path.join(root, "404.html");
      if (fs.existsSync(four)) {
        res.writeHead(404, { "content-type": TYPES[".html"] });
        return res.end(fs.readFileSync(four));
      }
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`serving ${root} on ${port}`));
