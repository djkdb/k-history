/**
 * 어떤 브라우저 안에서 열렸는가.
 *
 * 인스타·카카오톡 같은 앱에서 링크를 누르면 사파리나 크롬이 아니라 그 앱이
 * 품고 있는 작은 브라우저(인앱 브라우저)가 열린다. 겉보기에는 같지만
 * 이 앱에는 두 가지가 치명적이다.
 *
 *   1) 홈 화면에 추가할 수 없다. 설치 제안 자체가 오지 않는다.
 *   2) 저장 공간이 그 앱 안에만 있다. 여기서 외운 것, 풀어 둔 기록이
 *      나중에 사파리로 열면 하나도 없다. 이 앱은 기록을 서버에 두지 않으므로
 *      되찾을 방법도 없다.
 *
 * 그래서 "여기서 공부하지 말고 밖에서 여세요"를 먼저 말해야 한다.
 * 어느 앱인지까지 알아내는 이유는, 나가는 방법이 앱마다 다르기 때문이다.
 */

export type InAppName =
  | "인스타그램"
  | "페이스북"
  | "스레드"
  | "카카오톡"
  | "네이버 앱"
  | "다음 앱"
  | "라인"
  | "X(트위터)"
  | "밴드"
  | "앱 안의 브라우저";

export interface Env {
  /** 인앱 브라우저라면 그 앱 이름 */
  inApp: InAppName | null;
  ios: boolean;
  android: boolean;
  /** 아이폰에서 홈 화면 추가가 되는 유일한 브라우저 */
  iosSafari: boolean;
  /** 이미 홈 화면에서 열었는가 */
  standalone: boolean;
}

const IN_APP: [RegExp, InAppName][] = [
  [/Instagram/i, "인스타그램"],
  [/Threads/i, "스레드"],
  [/FBAN|FBAV|FB_IAB|FB4A/i, "페이스북"],
  [/KAKAOTALK/i, "카카오톡"],
  [/NAVER\(inapp|NAVER\s|whale.*inapp/i, "네이버 앱"],
  [/DaumApps|DaumDevice/i, "다음 앱"],
  [/\bLine\//i, "라인"],
  [/Twitter/i, "X(트위터)"],
  [/BAND\//i, "밴드"],
];

export function readEnv(): Env {
  if (typeof window === "undefined") {
    return { inApp: null, ios: false, android: false, iosSafari: false, standalone: false };
  }
  const ua = navigator.userAgent;

  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    // 요즘 아이패드는 자신을 맥이라고 말한다 — 손가락이 닿는지로 가른다
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/.test(ua);

  let inApp: InAppName | null = null;
  for (const [re, name] of IN_APP) {
    if (re.test(ua)) {
      inApp = name;
      break;
    }
  }
  // 이름은 못 알아냈지만 안드로이드 웹뷰인 것은 확실한 경우
  if (!inApp && android && /;\s*wv\)/.test(ua)) inApp = "앱 안의 브라우저";

  // 아이폰 사파리는 Version/ 을 달고 온다. 인앱 브라우저에는 그것이 없다.
  const iosSafari =
    ios &&
    !inApp &&
    /Safari/.test(ua) &&
    /Version\//.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;

  return { inApp, ios, android, iosSafari, standalone };
}

/** 그 앱에서 밖으로 나가는 방법 — 앱마다 메뉴 자리가 다르다 */
export function escapeHint(env: Env): string {
  const target = env.ios ? "Safari로 열기" : "다른 브라우저로 열기";
  switch (env.inApp) {
    case "인스타그램":
    case "스레드":
    case "페이스북":
      return env.ios
        ? `오른쪽 위 ··· 을 누르고 «${target}» 를 고르세요.`
        : `오른쪽 위 ⋮ 를 누르고 «${target}» 를 고르세요.`;
    case "카카오톡":
      return "오른쪽 아래 ☰ 를 누르고 «다른 브라우저로 열기» 를 고르세요.";
    case "네이버 앱":
      return "오른쪽 아래 ⋮ 를 누르고 «다른 브라우저로 열기» 를 고르세요.";
    case "라인":
      return "오른쪽 위 ··· 을 누르고 «다른 브라우저로 열기» 를 고르세요.";
    default:
      return env.ios
        ? "메뉴(··· 또는 ☰)에서 «Safari로 열기» 를 고르세요."
        : "메뉴(⋮ 또는 ☰)에서 «다른 브라우저로 열기» 를 고르세요.";
  }
}
