/**
 * 문단을 문장 단위로 나눈다 — 한 문장씩 줄을 바꿔 보이게 하려고.
 *
 * 마침표·물음표·느낌표 뒤에 빈칸이 올 때만 자른다. 다음은 자르지 않는다.
 *   - 소수(0.5), 버전(1.2.3) — 뒤에 빈칸이 없다
 *   - 괄호·**굵게**·`코드` 안
 *   - e.g. · i.e. · vs. · etc. · Fig. 같은 줄임말, 한 글자 약어(A. B.)
 *   - 원래 있던 줄바꿈은 그대로 둔다
 */
const ABBR = /(?:\b(?:e\.g|i\.e|vs|etc|cf|Fig|fig|No|Mr|Dr|al|approx|resp|min|max|ex)|\b[A-Za-z])\.$/;

export function splitSentences(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split("\n")) {
    let depth = 0;
    let bold = false;
    let code = false;
    let start = 0;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === "`") code = !code;
      else if (code) continue;
      else if (ch === "*" && line[i + 1] === "*") {
        bold = !bold;
        i++;
      } else if ("([{（「『".includes(ch)) depth++;
      else if (")]}）」』".includes(ch)) depth = Math.max(0, depth - 1);
      else if ((ch === "." || ch === "!" || ch === "?") && depth === 0 && !bold && /\s/.test(line[i + 1] ?? "")) {
        const head = line.slice(start, i + 1);
        if (ch === "." && ABBR.test(head)) continue;
        // 닫는 따옴표까지 문장에 붙인다
        let end = i + 1;
        while ("'\"’”".includes(line[end] ?? "x")) end++;
        out.push(line.slice(start, end).trim());
        start = end;
      }
    }
    const rest = line.slice(start).trim();
    if (rest) out.push(rest);
  }
  return out.filter(Boolean);
}
