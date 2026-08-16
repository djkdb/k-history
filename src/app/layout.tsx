import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { SWRegister } from "@/components/sw-register";

export const metadata: Metadata = {
  title: "한국사 레전드 마스터",
  description:
    "한국사를 외우는 것이 아니라 평생 기억하게 만든다 — 장기기억 강화 한국사 학습 시스템",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "한국사 레전드",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-theme="dark">
      <head>
        {/* iOS 는 manifest 의 아이콘을 보지 않는다 — 이것이 없으면 홈 화면에
            앱 아이콘 대신 화면을 축소한 그림이 박힌다 */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/*
          탭 아이콘.
          선언해 두지 않으면 브라우저가 /favicon.ico 를 스스로 찾아가고,
          없으면 탭마다 404 가 찍히며 아이콘 자리도 빈다.
        */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        {/*
          칠하기 전에 테마를 정한다.
          리액트가 뜬 뒤에 바꾸면 어두운 화면이 한 번 번쩍이고 밝아진다.
          저장된 값이 없으면 지금까지와 같은 어두운 화면이다.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("khlm:theme");var a=p==="light"||(p==="system"&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark";document.documentElement.setAttribute("data-theme",a);document.documentElement.style.colorScheme=a;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="app-bg min-h-dvh">
        <div className="mx-auto w-full max-w-2xl px-4 pt-safe pb-28">
          {children}
        </div>
        <BottomNav />
        <SWRegister />
      </body>
    </html>
  );
}
