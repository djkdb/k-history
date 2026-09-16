import { CONCEPTS } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import type { Concept, Track } from "@/lib/types";

/**
 * 찾기.
 *
 * ⚠️ 여태 찾기 칸은 "개념 이름이나 내용으로 찾기" 라고 적어 놓고 제목과
 *    한 줄 요약만 뒤졌다. 본문에만 있는 말 — 벨레이디의 모순, 워킹 셋,
 *    3-way handshake — 은 아무리 쳐도 안 나왔다. 화면이 하지 않는 일을
 *    한다고 적어 두면, 없는 줄 알고 돌아선다.
 *
 * 그래서 개념의 모든 글(본문·시험 포인트·헷갈리는 짝·외울 거리)과 문항까지
 * 뒤지고, 어디에서 걸렸는지와 그 대목을 같이 돌려준다. 왜 이것이 나왔는지
 * 보이지 않으면 결과를 믿을 수 없다.
 */
export type Where = "제목" | "요약" | "본문" | "시험 포인트" | "헷갈리는 짝" | "외울 거리";

export interface ConceptHit {
  concept: Concept;
  where: Where;
  /** 걸린 대목 — 찾은 말 앞뒤로 잘라 둔다 */
  snippet: string;
  /** 낮을수록 위 */
  rank: number;
}

export interface QuestionHit {
  id: string;
  track: Track;
  sourceId: string;
  /** 개념 제목 — 문항만 덩그러니 보여 주면 어디로 가야 할지 모른다 */
  conceptTitle: string;
  text: string;
}

/*
 * 소문자로만 내린다. 공백까지 줄이면 글자 자리가 밀려, 찾은 자리를 원문에서
 * 잘라 낼 때 엉뚱한 데를 자른다.
 */
const norm = (s: string) => s.toLowerCase();

/** 찾은 말 앞뒤로 잘라 낸다. 문장이 길면 앞뒤를 … 로 줄인다. */
function cut(text: string, needle: string, span = 46): string {
  const at = norm(text).indexOf(needle);
  if (at < 0) return text.slice(0, span * 2);
  const from = Math.max(0, at - span);
  const to = Math.min(text.length, at + needle.length + span);
  return (from > 0 ? "…" : "") + text.slice(from, to).trim() + (to < text.length ? "…" : "");
}

export function searchConcepts(raw: string, track: Track): ConceptHit[] {
  const q = norm(raw).trim();
  if (q.length < 1) return [];
  const out: ConceptHit[] = [];
  for (const c of CONCEPTS) {
    if (!c.tracks.includes(track)) continue;
    /*
     * 한 개념에서 가장 앞자리 한 곳만 담는다. 제목에도 본문에도 걸린 개념이
     * 목록에 두 번 나오면, 찾은 개수가 실제보다 많아 보인다.
     */
    let hit: ConceptHit | null = null;
    const put = (where: Where, text: string, rank: number) => {
      if (hit || !norm(text).includes(q)) return;
      hit = { concept: c, where, snippet: cut(text, q), rank };
    };
    put("제목", c.title, 0);
    put("요약", c.summary, 1);
    for (const k of c.keys ?? []) put("외울 거리", `${k.term} — ${k.mean}`, 2);
    for (const t of c.traps ?? []) put("헷갈리는 짝", `${t.a} ↔ ${t.b} — ${t.how}`, 3);
    put("시험 포인트", c.examPoint, 4);
    for (const b of c.body) put("본문", b, 5);
    if (hit) out.push(hit);
  }
  return out.sort((a, b) => a.rank - b.rank || a.concept.title.localeCompare(b.concept.title));
}

export function searchQuestions(raw: string, track: Track): QuestionHit[] {
  const q = norm(raw).trim();
  if (q.length < 2) return []; // 한 글자로는 온 문항이 다 걸린다
  const title = new Map(CONCEPTS.map((c) => [c.id, c.title]));
  const out: QuestionHit[] = [];
  if (track === "written") {
    for (const w of QUESTIONS) {
      const bag = [w.question, w.passage ?? "", ...w.options, w.explanation].join(" ");
      if (!norm(bag).includes(q)) continue;
      out.push({
        id: w.id, track: "written", sourceId: w.sourceId,
        conceptTitle: title.get(w.sourceId) ?? "",
        text: cut(w.question, q, 60),
      });
    }
  } else {
    for (const pq of PRACTICAL_QUESTIONS) {
      const bag = [pq.question, pq.passage ?? "", ...pq.answers, pq.explanation].join(" ");
      if (!norm(bag).includes(q)) continue;
      out.push({
        id: pq.id, track: "practical", sourceId: pq.sourceId,
        conceptTitle: title.get(pq.sourceId) ?? "",
        text: cut(pq.question, q, 60),
      });
    }
  }
  return out;
}
