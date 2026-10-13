/**
 * "@course" 는 tsconfig paths 로 잇지 않는다 — Next 가 paths 를 webpack
 * alias 보다 먼저 풀어서, 어느 과목으로 빌드해도 paths 가 가리킨 과목이
 * 들어가 버린다. 실제 연결은 next.config 의 webpack alias 하나뿐이고,
 * 여기서는 타입만 알려 준다. (각 과목 자료의 타입 검사는 src/courses/**
 * 가 include 에 들어 있어 그대로 된다.)
 */
declare module "@course" {
  const course: import("@/lib/types").Course;
  export default course;
}
