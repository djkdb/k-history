# 한국사 레전드 마스터 (Korea History Legend Master)

> **"한국사를 외우는 것이 아니라 평생 기억하게 만든다."**

노베이스도 시험장에서 자동으로 답이 떠오르게 만드는 **장기기억 강화 한국사 학습 시스템**.
암기가 아니라 장기기억(Long-term Memory) 형성이 목표입니다.

## 핵심 기능

- **시험 설정 온보딩** — 한능검/학교/공무원/수능/직접 입력 + D-Day 자동 계산 + AI 학습 계획
- **메인 대시보드** — 오늘 학습/복습/퀴즈, 예상 점수, 암기율, 연속 학습, 약한 시대·취약 유형 분석, 진도율
- **12개 시대별 학습** — 시대 전용 컬러/아이콘/분위기, 선사부터 현대까지 108개 핵심 개념
- **레전드 요약** — 10초/30초/1분/시험 직전 요약 + 시험장에서 떠올리는 순서
- **기억 강화 시스템** — 스토리텔링·현대 비유·두문자 암기·말장난·감정 연결·장면 상상·실수 방지 비교표
- **시대 흐름 모드** — 스크롤만 내려도 시간이 흐르는 몰입형 애니메이션 타임라인
- **퀴즈 시스템** — OX/객관식/순서 배열/빈칸/왕·연도·사건 맞추기, 데이터 기반 자동 출제
- **AI 오답 분석** — 시대별/유형별 약점 진단 + 오답노트 + 복습 큐 자동 반영
- **망각곡선 복습** — Ebbinghaus 곡선 기반 당일→1일→3일→7일→14일→30일 자동 스케줄링, 플래시카드 복습
- **시험 직전 모드** — 30분/1시간/3시간 원클릭 최종 정리 (중요도 필터 + 스와이프 카드)
- **챌린지** — XP/레벨/칭호/배지/연속 학습 스트릭
- **즉시 검색** — 왕·사건·연도·인물·문화재 통합 검색
- **PWA + 오프라인** — IndexedDB 영속화, 서비스 워커, 홈 화면 설치

## 기술 스택

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS v4 · Framer Motion · Zustand (+ IndexedDB persist) · Lucide Icons · PWA

## 실행

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 정적 빌드 → out/
npm start      # 빌드 결과 로컬 서빙
```

## Cloudflare 배포

서버 로직이 전혀 없는 순수 클라이언트 앱이라 `output: "export"`로 완전 정적 빌드됩니다.
`npm run build` 하나로 `out/`에 120개 페이지(개념 108 + 시대 12 + 기능 화면)가 프리렌더됩니다.

### 방법 1 — Workers (`wrangler`)

`wrangler.jsonc`가 `out/`을 정적 자산으로 서빙하도록 이미 설정돼 있습니다.

```bash
npx wrangler login
npm run preview   # 로컬에서 Cloudflare 런타임으로 미리보기
npm run deploy    # 빌드 + 배포
```

### 방법 2 — Pages (Git 연동, 자동 배포)

Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**에서 이 저장소를 연결하고:

| 항목 | 값 |
| --- | --- |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | `20` 이상 (환경변수 `NODE_VERSION=20`) |

이후 브랜치에 푸시할 때마다 자동 배포됩니다.

### 방법 3 — 직접 업로드

```bash
npm run build
npx wrangler pages deploy out --project-name=korea-history-legend-master
```

> **참고** — 서버 렌더링이나 API 라우트를 추가하게 되면 정적 익스포트로는 처리할 수 없습니다.
> 그때는 `next.config.ts`의 `output: "export"`를 제거하고
> [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) 어댑터로 전환하면 됩니다.

## 구조

```
src/
├── app/            # 라우트 (온보딩·대시보드·학습·상세·흐름·퀴즈·복습·직전·검색·오답)
├── components/     # UI 킷, 내비게이션, 대시보드 위젯
├── data/
│   ├── eras.ts     # 12개 시대 메타데이터 (컬러·아이콘·분위기)
│   └── events/     # 시대별 이벤트 데이터셋 (요약·암기법·함정·퀴즈 소스)
└── lib/            # 타입 계약, SRS 엔진, 퀴즈 생성기, 스토어, 유틸
```

## 데이터 모델

모든 개념은 `HistoryEvent` 스키마를 따릅니다: 시대·왕·연도·다단계 요약·출제 포인트·중요도(★1~5)·출제 빈도·키워드·스토리텔링·비유·두문자/말장난 암기·감정 연결·장면 묘사·실수 방지 비교(traps)·관련 인물/문화재·흐름 체인(prev/next)·복습 간격.
