/**
 * 다섯 앱.
 *
 * ⚠️ 주소(url)는 배포한 곳에 맞춰 여기만 고치면 된다.
 *
 *    처음 값은 Cloudflare Pages 가 프로젝트 이름으로 만들어 주는 기본 주소다
 *    (wrangler.jsonc 의 name 을 그대로 따른다). 따로 도메인을 붙였다면 그
 *    주소로 바꾸면 된다. 다른 데는 손댈 곳이 없다.
 *
 * 왜 한 앱으로 합치지 않는가.
 *    공부 기록은 서버가 아니라 그 기기의 브라우저 저장소에 남는다. 저장소는
 *    주소(오리진)마다 따로다. 다섯을 한 주소로 합치면 지금까지 각 앱에서
 *    공부해 온 사람들의 기록이 통째로 사라진다. 그래서 합치지 않고, 들어가는
 *    문만 한자리에 모은다.
 */
export interface AppEntry {
  id: string;
  /** 앱이 스스로 적어 둔 이름 — manifest 와 같게 둔다 */
  name: string;
  /** 무슨 시험인가 */
  exam: string;
  /** 앱이 스스로 적어 둔 한 줄 */
  tagline: string;
  /**
   * 무엇을 담고 있는가.
   *
   * ⚠️ 눈대중으로 적지 않는다. 각 앱의 감사 스크립트가 세어 준 값을 옮긴다.
   *    분량이 늘면 여기도 같이 고쳐야 한다 — 실제보다 적게 적어 두면 손해고,
   *    많게 적어 두면 거짓이 된다.
   */
  what: string[];
  url: string;
  /** 카드 색 — 앱마다 다르게 두어 아이콘 없이도 갈라 보이게 한다 */
  color: string;
  symbol: string;
}

export const APPS: AppEntry[] = [
  {
    id: "khlm",
    name: "한국사 레전드 마스터",
    exam: "한국사능력검정시험",
    tagline: "외우지 말고, 기억하세요",
    what: ["개념 108개", "기출 21회차", "잊을 때쯤 다시 묻는 복습"],
    url: "https://korea-history-legend-master.pages.dev",
    color: "#f59e0b",
    symbol: "🏛️",
  },
  {
    id: "comhwal",
    name: "컴활 마스터",
    exam: "컴퓨터활용능력 1·2급",
    tagline: "필기는 이해로, 실기는 손으로",
    what: ["개념 112개", "문제 은행 755문항", "수식 77문항 · 단축키 56개"],
    url: "https://comhwal-master.pages.dev",
    color: "#10b981",
    symbol: "📊",
  },
  {
    id: "sqld",
    name: "SQLD 마스터",
    exam: "SQL 개발자 · 50문항 90분",
    tagline: "모델링은 그림으로, SQL은 직접 쳐 보며",
    what: ["개념 61개", "문제 은행 261문항", "브라우저 안에서 도는 SQL 26문항"],
    url: "https://sqld-master.pages.dev",
    color: "#0ea5e9",
    symbol: "🗄️",
  },
  {
    id: "toeic",
    name: "토익 마스터",
    exam: "TOEIC · 듣기 100 + 읽기 100",
    tagline: "듣기는 귀로, 독해는 눈으로, 어휘는 반복으로",
    what: ["어휘 648개 · 문법 45개", "듣기 85지문 143문항", "읽기 110세트 173문항"],
    url: "https://toeic-master.pages.dev",
    color: "#f43f5e",
    symbol: "🔤",
  },
  {
    id: "gisa",
    name: "정보처리기사 마스터",
    exam: "필기 5과목 100문항 150분 · 실기",
    tagline: "필기는 다섯 과목 과락까지, 실기는 손으로 써 보며",
    what: ["개념 63개", "필기 274문항", "실기 149문항 — 적어서 채점"],
    url: "https://gisa-master.pages.dev",
    color: "#6366f1",
    symbol: "💻",
  },
];
