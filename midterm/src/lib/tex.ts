import katex from "katex";
import "katex/dist/katex.min.css";

/** 수식(LaTeX) → HTML. 이 파일은 수식이 처음 보일 때만 따로 불러온다 (KaTeX 가 크다). */
export function renderTex(tex: string, display: boolean): string {
  return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore" });
}
