import { SQL_TASKS } from "@/data/sql-tasks";
import { TaskDetail } from "./task-detail";

// 정적 익스포트: 실습 문제 페이지를 빌드 시점에 모두 만들어 둔다
export function generateStaticParams() {
  return SQL_TASKS.map((t) => ({ id: t.id }));
}

export default function TaskPage() {
  return <TaskDetail />;
}
