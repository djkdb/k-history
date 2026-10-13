import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SWRegister } from "@/components/sw-register";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "2026-2 중간고사",
  description: "데이터베이스시스템 · 머신러닝 · 소프트웨어공학 · 컴퓨터시스템개론 · 정보검색 — 강의 자료로 만든 공부 앱",
  manifest: withBase("/manifest.json"),
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "중간고사" },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-theme="dark">
      <head>
        {/* iOS 는 manifest 의 아이콘을 보지 않는다 — 이것이 없으면 홈 화면에
            아이콘 대신 화면을 축소한 그림이 박힌다 */}
        <link rel="apple-touch-icon" href={withBase("/apple-touch-icon.png")} />
        <link rel="icon" href={withBase("/icon.svg")} type="image/svg+xml" />
        <link rel="icon" href={withBase("/icon-192.png")} type="image/png" sizes="192x192" />
        {/*
          칠하기 전에 테마를 정한다.
          리액트가 뜬 뒤에 바꾸면 어두운 화면이 한 번 번쩍이고 밝아진다.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("midhub:theme");var a=p==="light"||(p==="system"&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark";document.documentElement.setAttribute("data-theme",a);document.documentElement.style.colorScheme=a;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="app-bg min-h-dvh">
        {/* 현관에는 아래 길잡이 막대가 없다 — 갈 곳이 다섯 개뿐이라
            막대를 두면 같은 자리를 두 번 말하는 셈이다 */}
        <div className="mx-auto w-full max-w-2xl px-4 pt-safe pb-12">
          {children}
        </div>
        <SWRegister />
      </body>
    </html>
  );
}
