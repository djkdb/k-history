/**
 * 글씨 크기 상수와 칠하기 전 스크립트.
 * ⚠️ "use client" 파일(font-scale.ts)에서 꺼내면 서버 레이아웃에는 글이 아니라
 *    클라이언트 참조가 들어가 화면이 어긋난다 — 그래서 따로 둔다.
 */
export const FONT_KEY = "mid-font-scale";
export const FONT_STEPS = [0.9, 1, 1.1, 1.2, 1.35, 1.5];

/** 칠하기 전에 넣는 스크립트 */
export const FONT_BOOT = `(function(){try{var v=Number(localStorage.getItem(${JSON.stringify(FONT_KEY)}));if(${JSON.stringify(FONT_STEPS)}.indexOf(v)>=0)document.documentElement.style.setProperty("--fz",String(v));}catch(e){}})();`;
