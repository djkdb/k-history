import { CONCEPTS } from "@/data/concepts";
import { SHORTCUTS } from "@/data/shortcuts";
import { inGrade } from "@/data/subjects";
import { capturableKeys, isCapturable } from "@/lib/shortcut";
import type { Concept, Grade, Shortcut } from "@/lib/types";
import { shuffleSeeded } from "@/lib/utils";

/**
 * 게임에 쓸 거리를 고른다.
 *
 * 게임이라고 해서 문제를 따로 지어 넣지 않는다. 이 앱에는 이미 개념마다
 * "헷갈리는 짝" 이 있고, 그 안에 시험처럼 생긴 **일부러 뒤바꾼 틀린 설명**
 * (wrong)이 함께 적혀 있다. 그것을 그대로 쓴다 — 게임에서 맞힌 것이 곧
 * 시험에서 맞히는 것이 되어야 게임을 한 시간이 공부한 시간이 된다.
 */

/** O/X 한 문항 — 참인 설명 또는 일부러 뒤바꾼 거짓 설명 */
export interface OxItem {
  /** 복습 큐가 가리킬 개념 id */
  conceptId: string;
  conceptTitle: string;
  /** 무엇과 무엇을 헷갈리는가 */
  pair: string;
  /** 화면에 낼 문장 */
  statement: string;
  /** 이 문장이 참인가 */
  isTrue: boolean;
  /** 거짓일 때 보여 줄 바른 문장 */
  truth: string;
}

/**
 * 함정에서 O/X 문항을 만든다.
 *
 * 한 함정에서 참·거짓 두 문항이 나오지만 한 판에는 한쪽만 낸다. 같은 짝의
 * 참 문장과 거짓 문장이 한 판에 같이 나오면, 앞에서 본 문장을 뒤집어 놓은
 * 것이 뻔히 보여 읽지 않고도 답이 나온다.
 */
export function makeOxRound(grade: Grade, seed: number, count = 20): OxItem[] {
  const pool: OxItem[] = [];
  for (const c of CONCEPTS) {
    if (!inGrade(grade, c.minGrade)) continue;
    for (const t of c.traps ?? []) {
      if (!t.difference?.trim() || !t.wrong?.trim()) continue;
      pool.push({
        conceptId: c.id,
        conceptTitle: c.title,
        pair: t.concept,
        statement: t.difference,
        isTrue: true,
        truth: t.difference,
      });
    }
  }
  /* 섞은 뒤 앞에서부터 집되, 같은 개념은 한 판에 한 번만 */
  const 본개념 = new Set<string>();
  const 뽑은: OxItem[] = [];
  for (const [i, item] of shuffleSeeded(pool, seed).entries()) {
    if (뽑은.length >= count) break;
    if (본개념.has(item.conceptId)) continue;
    본개념.add(item.conceptId);
    /*
     * 절반쯤을 거짓으로 뒤집는다.
     *
     * ⚠️ 무작위로 뒤집으면 한 판이 죄다 참이거나 죄다 거짓이 되는 일이
     *    생긴다. 그러면 두세 문항 만에 "계속 O만 누르면 된다" 가 들통난다.
     *    자리 번호의 홀짝으로 갈라 언제나 반반이 되게 한다.
     */
    const 거짓 = (i + seed) % 2 === 1;
    const c = CONCEPTS.find((x) => x.id === item.conceptId)!;
    const trap = (c.traps ?? []).find((t) => t.difference === item.statement)!;
    뽑은.push(
      거짓
        ? { ...item, statement: trap.wrong, isTrue: false }
        : item,
    );
  }
  return 뽑은;
}

/** 단축키 게임에 쓸 것 — 눌러서 맞힐 수 있는 것만 */
export function shortcutPool(grade: Grade): Shortcut[] {
  return SHORTCUTS.filter((s) => inGrade(grade, s.minGrade) && isCapturable(s));
}

/**
 * 손가락으로 조립할 때 쓸 자판.
 *
 * 폰에는 Ctrl 이 없다. 실제 키를 누를 수 있는 것은 자판이 달린 기기뿐이라,
 * 폰에서는 조각을 눌러 조합을 맞춘다. 조각은 이 단축키에 실제로 쓰이는
 * 것들과, 헷갈릴 만한 몇 개를 섞어 낸다.
 */
export function keyChips(sc: Shortcut, seed: number): string[] {
  const want = capturableKeys(sc)[0] ?? sc.keys[0];
  const 쓰는것 = want.split("+");
  const 보태기 = ["ctrl", "shift", "alt", "enter", "tab", "escape", "space"];
  const 덤 = 보태기.filter((k) => !쓰는것.includes(k));
  const 조각 = [...new Set([...쓰는것, ...덤])].slice(0, 8);
  return shuffleSeeded(조각, seed);
}

/** 짝 맞추기 한 판 — 용어와 한 줄 뜻 */
export interface PairCard {
  key: string;
  conceptId: string;
  face: string;
  kind: "term" | "mean";
}

export function makeMatchRound(
  grade: Grade,
  seed: number,
  pairs = 6,
): { cards: PairCard[]; concepts: Concept[] } {
  const pool = CONCEPTS.filter(
    (c) => inGrade(grade, c.minGrade) && c.summary.trim().length > 0,
  );
  const 고른 = shuffleSeeded(pool, seed).slice(0, pairs);
  const cards: PairCard[] = [];
  for (const c of 고른) {
    cards.push({ key: c.id + ":t", conceptId: c.id, face: c.title, kind: "term" });
    cards.push({
      key: c.id + ":m",
      conceptId: c.id,
      /*
       * 뜻은 줄여서 낸다. 카드 열두 장이 한 화면에 들어가야 짝을 기억할 수
       * 있는데, 두세 줄짜리 설명이 들어가면 카드가 화면 밖으로 밀린다.
       */
      face: c.summary.length > 46 ? c.summary.slice(0, 45) + "…" : c.summary,
      kind: "mean",
    });
  }
  return { cards: shuffleSeeded(cards, seed + 977), concepts: 고른 };
}
