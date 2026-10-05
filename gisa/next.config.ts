import type { NextConfig } from "next";

/*
 * 다섯 자격증을 한 웹에 모을 때는 앱마다 하위 경로(/gisa 등) 아래로 빌드한다.
 * BASE_PATH 가 비어 있으면 지금까지와 똑같이 맨 위 경로에 빌드된다 —
 * 이미 따로 배포된 사이트는 아무것도 바뀌지 않는다.
 */
const BASE_PATH = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  reactStrictMode: true,
  // 한국사 앱과 같은 방식 — 서버 로직이 없어 out/ 으로 완전 정적 배포한다
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
