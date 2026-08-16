import type { Shortcut } from "./types";

/**
 * 단축키 판정.
 *
 * 실제 키를 눌러 맞히는 것이 가장 좋은 연습이지만, 브라우저와 운영체제가
 * 먼저 가로채는 조합이 있다(Ctrl+1은 탭 이동, Win 키는 아예 웹에 오지
 * 않는다). 그런 조합은 눌러서 맞힐 방법이 없으므로 보기에서 고르게 한다.
 * 어느 쪽인지 판단하는 것이 isCapturable 이다.
 */

/** 키 이벤트를 "ctrl+shift+l" 꼴의 한 줄로 바꾼다 */
export function keyString(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  if (e.metaKey) parts.push("win");
  const key = canonicalKey(e);
  if (key) parts.push(key);
  return parts.join("+");
}

/** 수식어만 눌린 상태인가 — 아직 판정하면 안 되는 순간이다 */
export function isModifierOnly(e: KeyboardEvent): boolean {
  return ["Control", "Alt", "Shift", "Meta"].includes(e.key);
}

/**
 * code 를 우선 본다. Shift를 누르면 key 는 ";" 대신 ":" 로 바뀌지만
 * code 는 "Semicolon" 그대로라, Ctrl+Shift+; 같은 조합을 자판 배열과
 * 상관없이 같은 문자열로 받을 수 있다.
 */
function canonicalKey(e: KeyboardEvent): string {
  const c = e.code;
  if (/^Key[A-Z]$/.test(c)) return c.slice(3).toLowerCase();
  if (/^Digit[0-9]$/.test(c)) return c.slice(5);
  if (/^Numpad[0-9]$/.test(c)) return c.slice(6);
  if (/^F([1-9]|1[0-2])$/.test(c)) return c.toLowerCase();

  const byCode: Record<string, string> = {
    Semicolon: ";",
    Quote: "'",
    Backquote: "`",
    Equal: "=",
    Minus: "-",
    Comma: ",",
    Period: ".",
    Slash: "/",
    Backslash: "\\",
    BracketLeft: "[",
    BracketRight: "]",
    NumpadAdd: "=",
    NumpadSubtract: "-",
    Space: "space",
    Enter: "enter",
    NumpadEnter: "enter",
    Escape: "escape",
    Tab: "tab",
    Backspace: "backspace",
    Delete: "delete",
    Home: "home",
    End: "end",
    PageUp: "pageup",
    PageDown: "pagedown",
    ArrowUp: "arrowup",
    ArrowDown: "arrowdown",
    ArrowLeft: "arrowleft",
    ArrowRight: "arrowright",
    PrintScreen: "printscreen",
  };
  if (byCode[c]) return byCode[c];

  // code 가 비어 오는 환경(일부 모바일 자판)을 위한 마지막 수단
  const k = e.key;
  if (!k || k.length === 0) return "";
  return k.length === 1 ? k.toLowerCase() : k.toLowerCase();
}

/**
 * 브라우저·운영체제가 먼저 가져가는 조합.
 * preventDefault 로도 막을 수 없어서 아예 keydown 이 오지 않거나,
 * 와도 창이 이미 바뀐 뒤다.
 */
function isReserved(combo: string): boolean {
  if (combo.includes("win")) return true;
  if (/^ctrl\+[0-9]$/.test(combo)) return true; // 탭 전환
  const fixed = [
    "alt+tab",
    "alt+f4",
    "alt+printscreen",
    "printscreen",
    "ctrl+shift+escape",
    "ctrl+t",
    "ctrl+n",
    "ctrl+w",
    "ctrl+shift+t",
    "ctrl+shift+n",
    "ctrl+shift+w",
    "ctrl+pageup",
    "ctrl+pagedown",
    "f11",
    // f11(전체 화면)과 같은 이유다 — 브라우저 제 기능이 앱 위로 덮인다.
    // 하나만 빠져 있으면 그 문항에서만 아무 반응이 없어 사용자가 멈춘다.
    "f12",
  ];
  return fixed.includes(combo);
}

/** 직접 눌러서 연습할 수 있는 단축키인가 */
export function isCapturable(sc: Shortcut): boolean {
  return sc.keys.some((k) => !isReserved(k));
}

/** 눌러야 하는 조합 중 브라우저가 허용하는 것들만 */
export function capturableKeys(sc: Shortcut): string[] {
  return sc.keys.filter((k) => !isReserved(k));
}

export function gradeShortcut(pressed: string, sc: Shortcut): boolean {
  return sc.keys.includes(pressed);
}

/** 화면에 보여 줄 때 — "ctrl+shift+l" → "Ctrl + Shift + L" */
export function prettyKey(combo: string): string {
  const label: Record<string, string> = {
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    win: "Win",
    enter: "Enter",
    escape: "Esc",
    tab: "Tab",
    space: "Space",
    delete: "Delete",
    backspace: "Backspace",
    home: "Home",
    end: "End",
    pageup: "PageUp",
    pagedown: "PageDown",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
    printscreen: "PrintScreen",
  };
  return combo
    .split("+")
    .map((p) => label[p] ?? (/^f\d{1,2}$/.test(p) ? p.toUpperCase() : p.toUpperCase()))
    .join(" + ");
}

/**
 * 보기 네 개 만들기 — 눌러서 못 맞히는 단축키를 위한 객관식.
 * 같은 프로그램의 다른 단축키를 오답으로 써야 헷갈릴 만한 보기가 된다.
 * seed 를 받아 항상 같은 순서를 내므로 화면이 다시 그려져도 흔들리지 않는다.
 */
export function shortcutChoices(
  sc: Shortcut,
  pool: Shortcut[],
  seed: number,
): string[] {
  const others = pool
    .filter((o) => o.id !== sc.id && o.display !== sc.display)
    .sort((a, b) => (a.app === sc.app ? -1 : 0) - (b.app === sc.app ? -1 : 0));

  const picked: string[] = [];
  let i = seed % Math.max(1, others.length);
  let guard = 0;
  while (picked.length < 3 && guard < others.length * 2) {
    const cand = others[i % others.length];
    if (cand && !picked.includes(cand.display)) picked.push(cand.display);
    i += 7;
    guard++;
  }

  const all = [sc.display, ...picked];
  // seed 로 자리만 섞는다
  for (let j = all.length - 1; j > 0; j--) {
    const k = (seed * (j + 3)) % (j + 1);
    [all[j], all[k]] = [all[k], all[j]];
  }
  return all;
}
