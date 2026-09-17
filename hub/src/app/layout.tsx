import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SWRegister } from "@/components/sw-register";

export const metadata: Metadata = {
  title: "시험 준비 다섯 가지",
  description:
    "한국사 · 컴활 · SQLD · 토익 · 정보처리기사 — 다섯 앱으로 들어가는 곳",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        {/*
          칠하기 전에 테마를 정한다.
          리액트가 뜬 뒤에 바꾸면 어두운 화면이 한 번 번쩍이고 밝아진다.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("hub:theme");var a=p==="light"||(p==="system"&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark";document.documentElement.setAttribute("data-theme",a);document.documentElement.style.colorScheme=a;}catch(e){}})();`,
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
