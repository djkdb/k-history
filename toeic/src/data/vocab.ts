import type { Band, Vocab, VocabTopic } from "@/lib/types";
import { VOCAB_600 } from "./vocab-600";
import { VOCAB_700 } from "./vocab-700";
import { VOCAB_800 } from "./vocab-800";
import { VOCAB_900 } from "./vocab-900";
import { VOCAB_MORE } from "./vocab-more";
import { VOCAB_MORE2 } from "./vocab-more2";
import { VOCAB_ADD_600 } from "./vocab-add-600";
import { VOCAB_ADD_700 } from "./vocab-add-700";
import { VOCAB_ADD_800 } from "./vocab-add-800";
import { VOCAB_ADD_900 } from "./vocab-add-900";

export const VOCAB: Vocab[] = [
  ...VOCAB_600,
  ...VOCAB_700,
  ...VOCAB_800,
  ...VOCAB_900,
  ...VOCAB_MORE,
  ...VOCAB_MORE2,
  ...VOCAB_ADD_600,
  ...VOCAB_ADD_700,
  ...VOCAB_ADD_800,
  ...VOCAB_ADD_900,
];

export const VOCAB_MAP: Record<string, Vocab> = Object.fromEntries(
  VOCAB.map((v) => [v.id, v]),
);

export const TOPIC_LABEL: Record<VocabTopic, string> = {
  office: "사내 업무",
  hr: "인사·채용",
  finance: "회계·비용",
  marketing: "홍보·판매",
  contract: "계약·법무",
  logistics: "주문·배송",
  facility: "시설·공사",
  travel: "출장·교통",
  manufacturing: "생산·품질",
  general: "두루 쓰임",
};

/** 목표 점수대에 필요한 어휘 — 목표보다 쉬운 것도 당연히 필요하다 */
export function vocabFor(band: Band): Vocab[] {
  return VOCAB.filter((v) => v.band <= band);
}

export function vocabByTopic(band: Band): { topic: VocabTopic; items: Vocab[] }[] {
  const list = vocabFor(band);
  const order = Object.keys(TOPIC_LABEL) as VocabTopic[];
  return order
    .map((topic) => ({ topic, items: list.filter((v) => v.topic === topic) }))
    .filter((g) => g.items.length > 0);
}
