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
    <html lang="ko">
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
