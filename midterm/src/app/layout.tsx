import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { MotionGuard } from "@/components/motion-guard";
import { SWRegister } from "@/components/sw-register";
import { withBase } from "@/lib/base";
import { COURSE } from "@/lib/course";
import { KEY } from "@/lib/course-id";

export const metadata: Metadata = {
  title: `${COURSE.name} 중간고사`,
  description: `${COURSE.name} — 강의 자료로 만든 개념·퀴즈·복습·모의고사`,
  manifest: withBase("/manifest.json"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: COURSE.short,
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
        <link rel="apple-touch-icon" href={withBase("/apple-touch-icon.png")} />
        <link rel="icon" href={withBase("/icon.svg")} type="image/svg+xml" />
        <link rel="icon" href={withBase("/icon-192.png")} type="image/png" sizes="192x192" />
        {[400, 500, 600, 700].map((w) => (
          <link
            key={w}
            rel="preload"
            as="font"
            type="font/woff2"
            href={withBase(`/fonts/pretendard-${w}.woff2`)}
            crossOrigin="anonymous"
          />
        ))}
        {/* 칠하기 전에 테마를 정한다 — 나중에 바꾸면 화면이 한 번 번쩍인다 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem(${JSON.stringify(KEY + ":theme")});var a=p==="light"||(p==="system"&&matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark";document.documentElement.setAttribute("data-theme",a);document.documentElement.style.colorScheme=a;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="app-bg min-h-dvh">
        <div className="mx-auto w-full max-w-2xl px-4 pt-safe pb-28">
          <MotionGuard>{children}</MotionGuard>
        </div>
        <BottomNav />
        <SWRegister />
      </body>
    </html>
  );
}
