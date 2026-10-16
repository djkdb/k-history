/** 글의 지문 — 녹음 파일 이름. 글이 바뀌면 이름이 바뀌어 헌 녹음을 틀지 않는다 (scripts/make-listen-audio.mjs 와 같은 셈) */
export function fnv(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36) + text.length.toString(36);
}
