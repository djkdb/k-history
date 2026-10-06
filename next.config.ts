import type { NextConfig } from "next";

/*
 * 다섯 자격증을 한 웹에 모을 때는 앱마다 하위 경로(/gisa 등) 아래로 빌드한다.
 * BASE_PATH 가 비어 있으면 지금까지와 똑같이 맨 위 경로에 빌드된다 —
 * 이미 따로 배포된 사이트는 아무것도 바뀌지 않는다.
 */
const BASE_PATH = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
    // 저장 전수조사용 판에서만 "1". 비워 두어도 꼭 적어 둔다 — 적지 않으면
    // 빌드 때 값이 박히지 않아 조사용 문이 보통 판에도 죽은 채로 남는다.
    NEXT_PUBLIC_STORAGE_AUDIT: process.env.NEXT_PUBLIC_STORAGE_AUDIT ?? "",
  },
  reactStrictMode: true,
  // 정적 익스포트 — 서버 로직이 없는 순수 클라이언트 앱이라 out/ 으로 완전 정적 배포 가능
  // (Cloudflare Workers/Pages, 그 외 어떤 정적 호스팅에도 그대로 올라간다)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
