// 한국사 마스터 서비스 워커 — 망 없이도 쓸 수 있게 한다
//
// ⚠️ 이 파일의 __PRECACHE__ 와 __BUILD__ 는 빌드가 끝난 뒤
//    scripts/build-sw.mjs 가 실제 파일 목록으로 채운다. 손으로 적지 않는다 —
//    파일 이름에 붙는 해시가 판마다 바뀌어 금세 어긋난다.
const CACHE_NAME = "khlm-__BUILD__";
const PRECACHE = [
  /* __PRECACHE__ */
];

/*
 * 미리 받기는 하나씩 받는다.
 *
 * cache.addAll 은 목록 중 하나만 실패해도 통째로 거부한다. 그러면 서비스
 * 워커가 아예 설치되지 않아 오프라인이 통째로 죽는다. 확장자 없는 주소를
 * 서버가 한 번 넘겨주기만 해도(리다이렉트는 addAll 이 거부한다) 그렇게 된다.
 *
 * 하나가 빠지는 것과 전부 없는 것은 크게 다르다. 받을 수 있는 것만 받고,
 * 못 받은 것은 그때그때 받아 오면 된다.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        PRECACHE.map((url) =>
          fetch(new Request(url, { redirect: "follow", cache: "reload" })).then(
            (res) => (res.ok ? cache.put(url, res) : undefined),
          ),
        ),
      ),
    ),
  );
  /*
   * 여기서 곧바로 자리를 넘겨받지 않는다.
   *
   * 웹은 새 판이 올라와도 화면을 껐다 켜야 바뀐다. 사용자가 모르는 사이에
   * 갈아치우면 시험을 보던 중에 화면이 바뀔 수 있으므로, 새 판이 준비되면
   * 화면에 알려 주고 사용자가 "지금 켜기"를 눌렀을 때 넘겨받는다.
   * (첫 설치는 넘겨받을 것이 없어 그대로 자리를 잡는다)
   */
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/** 이름에 해시가 박힌 것 — 내용이 바뀌면 이름이 바뀌므로 캐시를 먼저 본다 */
const 변하지않는것 = (path) => path.startsWith("/_next/static/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /*
   * 파일 이름에 해시가 박힌 것은 캐시를 먼저 본다.
   * 내용이 바뀌면 이름이 바뀌니 헌 것을 내줄 일이 없고, 망이 느린 곳에서
   * 화면이 뜨는 속도가 크게 달라진다.
   */
  if (변하지않는것(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached;
          /*
           * 주소에 .html 을 붙여 한 번 더 찾아본다.
           * 미리 받아 둘 때는 /learn 과 /learn.html 을 둘 다 담지만,
           * 서버가 어느 쪽으로 넘겨줬느냐에 따라 키가 어긋날 수 있다.
           */
          if (request.mode === "navigate") {
            const p = new URL(request.url).pathname.replace(/\/$/, "");
            /* caches.match 는 프로미스다 — || 로 이으면 늘 참이라
               뒤가 실행되지 않는다. then 으로 이어야 실제로 다음을 본다 */
            return caches
              .match(p + ".html")
              .then((h) => h || caches.match(p || "/"))
              .then((h) => h || caches.match("/"));
          }
          // 자바스크립트·글꼴 자리에 HTML 을 돌려주면 화면이 더 이상하게
          // 깨진다 — 차라리 실패하는 편이 낫다.
          return Response.error();
        }),
      ),
  );
});
