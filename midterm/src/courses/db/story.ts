import { STORY_1 } from "./story-1";
import { STORY_2 } from "./story-2";
import { STORY_3 } from "./story-3";

/** 쉬운 설명 칸 — 개념 id → 이야기 (형식은 lib/story.ts) */
export const STORY: Record<string, string> = { ...STORY_1, ...STORY_2, ...STORY_3 };
