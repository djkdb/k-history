import type { Band, ReadingSet } from "@/lib/types";
import { READING_PART5 } from "./reading-part5";
import { READING_PART6 } from "./reading-part6";
import { READING_PART7 } from "./reading-part7";
import { READING_PART5_MORE } from "./reading-part5-more";
import { READING_PART6_MORE } from "./reading-part6-more";
import { READING_PART7_MORE } from "./reading-part7-more";

export const READING: ReadingSet[] = [
  ...READING_PART5,
  ...READING_PART5_MORE,
  ...READING_PART6,
  ...READING_PART6_MORE,
  ...READING_PART7,
  ...READING_PART7_MORE,
];

export const READING_MAP: Record<string, ReadingSet> = Object.fromEntries(
  READING.map((s) => [s.id, s]),
);

export function readingFor(band: Band, part?: 5 | 6 | 7): ReadingSet[] {
  return READING.filter(
    (s) => s.band <= band && (part === undefined || s.part === part),
  );
}

export function countReadingQuestions(sets: ReadingSet[]): number {
  return sets.reduce((n, s) => n + s.questions.length, 0);
}

export const DOC_LABEL: Record<string, string> = {
  email: "이메일",
  letter: "편지",
  memo: "회람",
  notice: "공지",
  article: "기사",
  advertisement: "광고",
  form: "양식",
  schedule: "일정표",
  chat: "문자 대화",
  review: "후기",
};

export const SKILL_LABEL: Record<string, string> = {
  grammar: "문법 자리",
  vocab: "어휘 고르기",
  sentence: "문장 넣기",
  gist: "주제·목적",
  detail: "세부 사항",
  inference: "추론",
  intent: "화자 의도",
  "vocab-incontext": "문맥상 의미",
  crossref: "지문 연계",
  photo: "사진 묘사",
  response: "질의응답",
  next: "다음에 할 일",
  graphic: "시각 정보",
};
