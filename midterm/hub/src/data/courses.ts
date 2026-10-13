/**
 * 다섯 과목 — 첫 화면의 카드.
 *
 * 개념·문제 수는 손으로 적지 않는다. scripts/build-all.mjs 가 각 과목 자료를
 * 세어 courses.generated.json 에 적고, 여기서 읽는다. 아직 자료를 넣지 않은
 * 과목은 ready 가 false 로 남아 "준비 중" 으로 보인다.
 */
import generated from "./courses.generated.json";

export interface CourseCard {
  id: string;
  name: string;
  code: string;
  color: string;
  mark: string;
  ready: boolean;
  chapters: number;
  concepts: number;
  questions: number;
  examDate: string | null;
}

export const COURSES: CourseCard[] = generated as CourseCard[];
