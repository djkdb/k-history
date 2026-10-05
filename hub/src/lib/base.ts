/**
 * 하위 경로 도우미.
 *
 * Next 의 <Link> 와 router 는 basePath 를 알아서 붙이지만, 그 바깥 —
 * <img src>, <link href>, fetch, 서비스 워커 등록, location.href — 은 붙이지
 * 않는다. 한 웹에 모아 /gisa 아래로 빌드하면 그런 곳은 맨 위 경로를 찾아가
 * 깨진다. 그런 자리에는 이것을 거쳐 쓴다. 단독 배포에서는 BASE 가 빈 문자열이라
 * 아무것도 바뀌지 않는다.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE && (path === BASE || path.startsWith(BASE + "/"))) return path;
  return BASE + path;
}
