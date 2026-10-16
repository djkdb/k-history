import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import path from "node:path";

/*
 * 한 엔진을 과목마다 따로 빌드한다.
 *
 *   NEXT_PUBLIC_COURSE=db  BASE_PATH=/db  next build
 *
 * "@course" 를 그 과목 자료로 잇는다. 그래서 빌드 결과에는 그 과목만 실린다.
 * 다섯을 한 웹으로 묶는 것은 scripts/build-all.mjs 가 한다.
 */
const COURSE = process.env.NEXT_PUBLIC_COURSE || "db";
const COURSE_DIR = path.join(process.cwd(), "src", "courses", COURSE);
if (!existsSync(path.join(COURSE_DIR, "index.ts"))) {
  throw new Error(`과목 자료가 없다: src/courses/${COURSE}/index.ts`);
}
const BASE_PATH = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
    NEXT_PUBLIC_COURSE: COURSE,
    // 저장 전수조사용 판에서만 "1". 비워 두어도 꼭 적어 둔다 — 적지 않으면
    // 빌드 때 값이 박히지 않아 조사용 문이 보통 판에도 죽은 채로 남는다.
    NEXT_PUBLIC_STORAGE_AUDIT: process.env.NEXT_PUBLIC_STORAGE_AUDIT ?? "",
  },
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias["@course"] = path.join(COURSE_DIR, "index.ts");
    // 듣기 대본은 듣기 화면만 쓴다 — 과목 자료(@course)에 넣으면 모든 화면이 함께 받는다
    config.resolve.alias["@listen$"] = path.join(COURSE_DIR, "listen.ts");
    config.resolve.alias["@listen-full$"] = path.join(COURSE_DIR, "listen-full.ts");
    config.resolve.alias["@listen-audio$"] = path.join(COURSE_DIR, "listen-audio.json");
    return config;
  },
};

export default nextConfig;
