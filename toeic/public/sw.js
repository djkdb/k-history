// 토익 마스터 서비스 워커 — 오프라인 지원 (network-first, 캐시 폴백)
const CACHE_NAME = "toeic-v1";
const PRECACHE = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/apple-touch-icon.png",
  "/fonts/pretendard-400.woff2",
  "/fonts/pretendard-500.woff2",
  "/fonts/pretendard-600.woff2",
  "/fonts/pretendard-700.woff2",
];

/*
 * 미리 담기는 하나씩 담는다.
 *
 * cache.addAll 은 목록 중 하나만 실패해도 통째로 거부한다. 그러면 서비스
 * 워커가 아예 설치되지 않아 오프라인이 통째로 죽는다. 확장자 없는 주소를
 * 서버가 한 번 넘겨주기만 해도(리다이렉트는 addAll 이 거부한다) 그렇게 된다.
 *
 * 하나가 빠지는 것과 전부 없는 것은 크게 다르다. 담을 수 있는 것만 담고,
 * 못 담은 것은 그때그때 받아 오면 된다.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        PRECACHE.map((url) =>
          fetch(new Request(url, { redirect: "follow" })).then((res) => {
            if (res.ok) return cache.put(url, res);
            return undefined;
          }),
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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

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
          // 캐시에 없을 때 홈을 내주는 것은 화면 이동일 때만이다.
          // 자바스크립트·글꼴 자리에 HTML 을 돌려주면 화면이 더 이상하게
          // 깨진다 — 차라리 실패하는 편이 낫다.
          if (request.mode === "navigate") return caches.match("/");
          return Response.error();
        }),
      ),
  );
});
