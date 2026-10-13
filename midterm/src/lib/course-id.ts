/**
 * 지금 빌드한 과목.
 *
 * 한 엔진을 과목마다 따로 빌드한다(NEXT_PUBLIC_COURSE=db 등). 다섯 과목이 한
 * 주소에 함께 살아도 기록이 섞이지 않도록, 저장소·테마·안내의 열쇠는 모두
 * 이 값에서 나온다.
 *
 * ⚠️ 한 번 배포한 뒤에는 과목 id 를 바꾸지 말 것. 바꾸면 그 과목을 공부하던
 *    기록(저장소 이름이 id 를 품고 있다)을 찾지 못한다.
 */
export const COURSE_ID = process.env.NEXT_PUBLIC_COURSE || "db";

/** 저장소·테마 등 열쇠 앞머리 — "mid-db" */
export const KEY = `mid-${COURSE_ID}`;
