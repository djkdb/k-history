import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 정적 익스포트 — 서버 로직이 없는 순수 클라이언트 앱이라 out/ 으로 완전 정적 배포 가능
  // (Cloudflare Workers/Pages, 그 외 어떤 정적 호스팅에도 그대로 올라간다)
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
