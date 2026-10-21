import type { Course } from "@/lib/types";
import { withSources } from "@/lib/sources";
import { PDFS, SOURCES } from "./sources";
import { withFigures } from "@/lib/figures";
import { withExplain } from "@/lib/easy";
import { EXPLAIN } from "./explain";
import { STORY } from "./story";
import { withStory } from "@/lib/story";
import { CHAPTERS } from "./chapters";
import { FIGURES } from "./figures";
import { CONCEPTS_1 } from "./concepts-1";
import { CONCEPTS_2 } from "./concepts-2";
import { CONCEPTS_3 } from "./concepts-3";
import { NOTES_1 } from "./notes-1";
import { NOTES_2 } from "./notes-2";
import { NOTES_3 } from "./notes-3";
import { QUESTIONS_1 } from "./questions-1";
import { QUESTIONS_2 } from "./questions-2";
import { QUESTIONS_3 } from "./questions-3";

/** 컴퓨터시스템개론 (5118003-02) — 최경주 교수님. 받은 자료: CS 01 ~ 04-4. 시험 날짜는 자료에 없어 비워 둔다. */

/**
 * 중간고사 범위는 CS 04-3 까지 (사용자가 알려 줌, 2026-10-21).
 * 04-4 동기화 장은 글을 지우지 않고 여기서만 뺀다 — 기말 범위가 되면 이 줄만 비우면 된다.
 * 저장된 공부 기록(별표·오답·복습 카드)도 지우지 않는다. 화면은 없는 id를 걸러서 센다.
 */
const OUT_OF_SCOPE = new Set(["sync"]);
const ALL_CONCEPTS = withSources(withFigures(withStory(withExplain([...CONCEPTS_1, ...CONCEPTS_2, ...CONCEPTS_3], EXPLAIN), STORY), FIGURES), SOURCES);
const CONCEPTS = ALL_CONCEPTS.filter((k) => !OUT_OF_SCOPE.has(k.chapter));
const KEEP = new Set(CONCEPTS.map((k) => k.id));
const NOTES = { ...NOTES_1, ...NOTES_2, ...NOTES_3 };

const course: Course = {
  id: "cs",
  name: "컴퓨터시스템개론",
  short: "컴시개",
  code: "5118003-02",
  professor: "최경주 교수님",
  englishExam: false,
  color: "#f59e0b",
  symbol: "🖥️",
  chapters: CHAPTERS.filter((ch) => !OUT_OF_SCOPE.has(ch.id)),
  concepts: CONCEPTS,
  // 범위 밖 장의 PDF는 맨 끝이라 빼도 앞 PDF 번호(/pdf/n)가 바뀌지 않는다
  pdfs: PDFS.filter((f) => !CHAPTERS.some((ch) => OUT_OF_SCOPE.has(ch.id) && ch.source === f)),
  questions: [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3].filter((q) => KEEP.has(q.concept)),
  notes: Object.fromEntries(Object.entries(NOTES).filter(([k]) => !OUT_OF_SCOPE.has(k))),
};

export default course;
