import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { withExplain } from "@/lib/easy";
import { EXPLAIN } from "./explain";
import { STORY } from "./story";
import { withStory } from "@/lib/story";
import { CHAPTERS } from "./chapters";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { FIGURES } from "./figures";
import { NOTES_1 } from "./notes-1";
import { NOTES_2 } from "./notes-2";
import { NOTES_3 } from "./notes-3";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";
import { QUESTIONS_4 } from "./questions-4";
import { QUESTIONS_5 } from "./questions-5";

/**
 * 정보검색 (5119006-01)
 *
 * 받은 자료: Introduction to Information Retrieval(IIR) 1~7장 강의 슬라이드
 * (Schütze) — 01intro, 02voc, 03dict, 04const, 05comp, 06score, 07system.
 * 슬라이드가 영어라 용어를 영어와 함께 보인다. 시험 날짜·교수명은 자료에 없어 비워 둔다.
 */
/**
 * 3강 Spelling correction(철자 교정, 교안 94~104쪽)은 수업에서 넘어가 시험 범위가 아니다
 * (사용자가 알려 줌, 2026-10-25). 글은 지우지 않고 여기서만 뺀다. 편집 거리·Soundex는 그대로.
 */
const OUT_OF_SCOPE = new Set(["spelling", "kgram-spelling", "context-spelling"]);
const OUT_NOTES = new Set(["철자 교정", "k-gram 색인으로 철자 교정", "문맥 기반 철자 교정", "철자 교정의 일반 이슈", "연습: Peter Norvig의 철자 교정기"]);
/** 출제 예고(친구 정보, 2026-10-25) — 개념 카드의 '시험엔' 상자 맨 앞에 띄우고 중요도를 '반드시'로 */
const EXAM_INTEL: Record<string, string> = {
  "vector-space": "📌 출제 예고: 6강 Documents as vectors · 벡터 공간 모델 시험에 나옴.",
  cosine: "📌 출제 예고: 벡터 공간과 코사인 — 시험에 나옴.",
  "cosine-example": "📌 출제 예고: cosine example 표 계산이 시험에 나옴 — 로그 tf → 길이 → 정규화 → 내적을 손으로.",
  smart: "📌 출제 예고: cosine 표 계산(lnc.ltn 표)도 연습해 둘 것.",
  "gamma-code": "📌 출제 예고: γ 코드 예제 같은 문제가 가끔 나옴.",
  mapreduce: "📌 출제 예고: MapReduce 시험에 나옴.",
  distributed: "📌 출제 예고: MapReduce(파서 = map, 인버터 = reduce) 시험에 나옴.",
};
const withIntel = (cs: ReturnType<typeof withSources>) =>
  cs.map((k) => (EXAM_INTEL[k.id] ? { ...k, importance: "must" as const, exam: `${EXAM_INTEL[k.id]}\n${k.exam ?? ""}`.trim() } : k));
const ALL_CONCEPTS = withIntel(withSources(withFigures(withStory(withExplain([...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3], EXPLAIN), STORY), FIGURES), SOURCES));

const course: Course = {
  id: "ir",
  name: "정보검색",
  short: "정보검색",
  code: "5119006-01",
  examDate: "2026-10-27",
  examNote: "중간고사 10/27(화) — 강의 자료에는 날짜가 없어 직접 알려 준 날짜로 넣었습니다.",
  englishExam: true,
  color: "#f43f5e",
  symbol: "🔎",
  chapters: CHAPTERS,
  concepts: ALL_CONCEPTS.filter((k) => !OUT_OF_SCOPE.has(k.id)),
  pdfs: PDFS,
  notesPdf: {
    "IIR 1. Boolean Retrieval (01intro)": "notes-1.pdf",
    "IIR 2. The term vocabulary and postings lists (02voc)": "notes-2.pdf",
    "IIR 3. Dictionaries and tolerant retrieval (03dict)": "notes-3.pdf",
    "IIR 4. Index Construction (04const)": "notes-4.pdf",
    "IIR 5. Index Compression (05comp)": "notes-5.pdf",
    "IIR 6. Scoring, term weighting, the vector space model (06score)": "notes-6.pdf",
    "IIR 7. Scores in a complete search system (07system)": "notes-7.pdf",
  },
  questions: [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_4, ...QUESTIONS_5].filter((q) => !OUT_OF_SCOPE.has(q.concept)),
  notes: Object.fromEntries(
    Object.entries({ ...NOTES_1, ...NOTES_2, ...NOTES_3 }).map(([ch, secs]) => [ch, secs.filter((sec) => !OUT_NOTES.has(sec.title))]),
  ),
  skipListen: ["철자 교정: 고립 단어와 케이그램", "문맥 의존 교정과 일반 쟁점"],
};

export default course;
