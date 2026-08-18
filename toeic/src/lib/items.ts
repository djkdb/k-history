import type { Band } from "./types";
import { VOCAB_MAP, VOCAB } from "@/data/vocab";
import { GRAMMAR_MAP, GRAMMAR } from "@/data/grammar";
import { READING } from "@/data/reading";
import { LISTENING } from "@/data/listening";

/**
 * 복습 큐 하나로 모으기.
 *
 * 어휘·문법·문항은 화면이 다르지만 복습은 한 곳에서 해야 한다. 그래야
 * "오늘 볼 것 32개"라는 한 줄이 의미를 갖는다. 그래서 id 만 가지고
 * 무엇이든 되찾을 수 있는 표를 여기서 만든다.
 *
 * id 앞머리로 종류가 갈린다 — v-(어휘) g-(문법) q-(문항).
 */
export type ItemKind = "vocab" | "grammar" | "question";

export interface Item {
  id: string;
  kind: ItemKind;
  /** 카드 앞면 */
  front: string;
  /** 카드 뒷면 */
  back: string;
  /** 어디서 온 것인지 */
  where: string;
  band: Band;
  /** 눌렀을 때 갈 곳 */
  href: string;
}

function questionItems(): Item[] {
  const out: Item[] = [];
  for (const set of READING) {
    for (const q of set.questions) {
      const answer = q.choices[q.answer];
      out.push({
        id: q.id,
        kind: "question",
        front: q.prompt ?? `${set.id} 빈칸 ${q.blank ?? ""}`,
        back: answer ? `${answer.text} — ${answer.why}` : "",
        where: `Part ${set.part}`,
        band: q.band,
        href: `/part/${set.part}?set=${set.id}`,
      });
    }
  }
  for (const set of LISTENING) {
    for (const q of set.questions) {
      const answer = q.choices[q.answer];
      out.push({
        id: q.id,
        kind: "question",
        front: q.prompt ?? set.scene ?? set.script?.[0]?.text ?? set.id,
        back: answer ? `${answer.text} — ${answer.why}` : "",
        where: `Part ${set.part}`,
        band: q.band,
        href: `/part/${set.part}?set=${set.id}`,
      });
    }
  }
  return out;
}

let cache: Record<string, Item> | null = null;

export function itemMap(): Record<string, Item> {
  if (cache) return cache;
  const out: Record<string, Item> = {};
  for (const v of VOCAB) {
    out[v.id] = {
      id: v.id,
      kind: "vocab",
      front: v.word,
      back: `${v.pos} ${v.meaning}`,
      where: "어휘",
      band: v.band,
      href: `/vocab?word=${encodeURIComponent(v.id)}`,
    };
  }
  for (const g of GRAMMAR) {
    out[g.id] = {
      id: g.id,
      kind: "grammar",
      front: g.title,
      back: g.summary,
      where: "문법",
      band: g.band,
      href: `/grammar/${g.id}`,
    };
  }
  for (const q of questionItems()) out[q.id] = q;
  cache = out;
  return out;
}

export function itemOf(id: string): Item | undefined {
  return itemMap()[id];
}

export function kindOf(id: string): ItemKind | null {
  if (VOCAB_MAP[id]) return "vocab";
  if (GRAMMAR_MAP[id]) return "grammar";
  return itemMap()[id] ? "question" : null;
}

export const KIND_LABEL: Record<ItemKind, string> = {
  vocab: "어휘",
  grammar: "문법",
  question: "문항",
};
