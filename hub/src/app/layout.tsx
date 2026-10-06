import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SWRegister } from "@/components/sw-register";
import { withBase } from "@/lib/base";

/*
 * 링크를 카톡·인스타 DM 에 붙이면 미리 보기 카드가 뜬다. 그림이 없으면
 * 제목 한 줄만 덩그러니 남아 무엇인지 알 수 없다. 미리 보기 그림 주소는
 * 반드시 "https://..." 로 시작해야 해서 사이트 주소가 있어야 한다.
 * 합친 웹은 build-all 이 SITE_URL 을 넘긴다. 없으면 그림을 걸지 않는다.
 */
const SITE_URL = process.env.SITE_URL ?? "";
const TITLE = "자격증 5종 마스터 모음";
const DESCRIPTION =
  "한국사 · 컴활 · SQLD · 토익 · 정보처리기사. 무료, 회원가입 없이 폰에서 바로 공부합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  manifest: withBase("/manifest.json"),
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
  ...(SITE_URL && {
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: "/",
      siteName: TITLE,
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["/og.png"],
    },
  }),
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
