import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { SWRegister } from "@/components/sw-register";

export const metadata: Metadata = {
  title: "컴활 마스터",
  description: "컴퓨터활용능력 1·2급 — 필기는 이해로, 실기는 손으로",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "컴활 마스터",
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
        {/*
          칠하기 전에 테마를 정한다.
          리액트가 뜬 뒤에 바꾸면 어두운 화면이 한 번 번쩍이고 밝아진다.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("comhwal:theme");var a=p==="light"||(p==="system"&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark";document.documentElement.setAttribute("data-theme",a);document.documentElement.style.colorScheme=a;}catch(e){}})();`,
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
