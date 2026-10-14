// katex 0.16 은 타입을 싣지 않는다 — 여기서 쓰는 함수 하나만 적어 둔다
declare module "katex" {
  const katex: {
    renderToString(tex: string, options?: { displayMode?: boolean; throwOnError?: boolean; strict?: string | boolean }): string;
  };
  export default katex;
}
