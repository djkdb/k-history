import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 한국사 앱과 같은 방식 — 서버 로직이 없어 out/ 으로 완전 정적 배포한다
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
