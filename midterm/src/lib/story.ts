import type { Concept } from "./types";

/**
 * 쉬운 설명 칸 — "예시: 배달 거리로 배달 시간을 맞힌다면?"처럼 상황 하나를 따라가며
 * 위에서 아래로 화살표로 이어 보여 주는 이야기. 개념마다 짧은 글 형식으로 적는다.
 *
 *   ? 예시: 질문 제목                       (맨 처음, 꼭)
 *   icon 🛵                                 (상황 옆 큰 그림 — 이모지)
 *   상황: 한 줄                             (여러 줄 가능)
 *   list 제목                               (아래 "- 왼쪽 | 오른쪽" 줄들)
 *   - 거리 1km | 배달 5분
 *   box 강조 제목                           (파란 상자, 다음 줄 "> 부제" 선택)
 *   > 거리와 배달 시간의 관계를 파악
 *   result 새로운 배달: 4km | 예상 시간 20분 (초록 큰 글씨)
 *   text 그냥 한 문장                       (흐름 속 문장)
 *   = 이처럼 … 이 회귀야.                   (마무리, 화살표 없이)
 *
 * list · box · result · text 사이에는 ↓ 를 그린다. **굵게** 를 쓸 수 있다.
 */
export type StoryStep =
  | { kind: "list"; label: string; rows: [string, string | null][] }
  | { kind: "box"; title: string; sub: string | null }
  | { kind: "result"; label: string; value: string }
  | { kind: "text"; text: string };

export interface Story {
  title: string;
  icon: string | null;
  scene: string[];
  steps: StoryStep[];
  wrap: string[];
}

export function parseStory(src: string, id = "?"): Story {
  const lines = src.split("\n").map((l) => l.trim()).filter(Boolean);
  const s: Story = { title: "", icon: null, scene: [], steps: [], wrap: [] };
  const bad = (l: string) => {
    throw new Error(`쉬운 설명 "${id}": 알 수 없는 줄 — ${l}`);
  };
  for (const l of lines) {
    const last = s.steps.at(-1);
    if (l.startsWith("? ")) s.title = l.slice(2).trim();
    else if (l.startsWith("icon ")) s.icon = l.slice(5).trim();
    else if (l.startsWith("상황:")) s.scene.push(l.slice(3).trim());
    else if (l.startsWith("list")) s.steps.push({ kind: "list", label: l.slice(4).trim(), rows: [] });
    else if (l.startsWith("- ")) {
      if (last?.kind !== "list") bad(l);
      const [a, b] = l.slice(2).split("|").map((x) => x.trim());
      (last as Extract<StoryStep, { kind: "list" }>).rows.push([a, b || null]);
    } else if (l.startsWith("box ")) s.steps.push({ kind: "box", title: l.slice(4).trim(), sub: null });
    else if (l.startsWith("> ")) {
      if (last?.kind !== "box") bad(l);
      const b = last as Extract<StoryStep, { kind: "box" }>;
      b.sub = b.sub ? `${b.sub}\n${l.slice(2).trim()}` : l.slice(2).trim();
    } else if (l.startsWith("result ")) {
      const [a, b] = l.slice(7).split("|").map((x) => x.trim());
      s.steps.push(b ? { kind: "result", label: a, value: b } : { kind: "result", label: "", value: a });
    } else if (l.startsWith("text ")) s.steps.push({ kind: "text", text: l.slice(5).trim() });
    else if (l.startsWith("= ")) s.wrap.push(l.slice(2).trim());
    else bad(l);
  }
  if (!s.title) throw new Error(`쉬운 설명 "${id}": 첫 줄 "? 예시: …" 가 없다`);
  if (!s.steps.length) throw new Error(`쉬운 설명 "${id}": 흐름(list/box/result/text)이 하나도 없다`);
  for (const st of s.steps) if (st.kind === "list" && !st.rows.length) throw new Error(`쉬운 설명 "${id}": 빈 list`);
  return s;
}

/** 개념에 쉬운 설명 이야기를 붙인다. 없는 id · 틀린 형식이면 빌드가 멈춘다. */
export function withStory(concepts: Concept[], extra: Record<string, string>): Concept[] {
  const ids = new Set(concepts.map((c) => c.id));
  for (const [k, v] of Object.entries(extra)) {
    if (!ids.has(k)) throw new Error(`쉬운 설명: 없는 개념 id "${k}"`);
    parseStory(v, k);
  }
  return concepts.map((c) => (extra[c.id] ? { ...c, story: extra[c.id] } : c));
}
