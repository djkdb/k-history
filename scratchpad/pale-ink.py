"""
밝은 테마에서 바탕에 묻히는 글씨색을 찾는다.

어두운 화면을 먼저 만들었기 때문에 글씨색은 대부분 밝은 색(연한 200·300)이다.
밝은 화면에서는 그 색이 흰 바탕에 그대로 얹혀 거의 보이지 않는다. 그래서
globals.css 에 밝은 테마용 대체색을 하나씩 적어 두는데, 빠뜨리기 쉽다.

픽셀로 재는 검사는 화면을 열어야 알 수 있고, 개념 상세처럼 수십 개가 같은 틀을
쓰는 곳은 몇 개만 표본으로 보기 때문에 놓칠 수 있다. 그래서 소스에서 한 번 훑는다.

  node/python3 scratchpad/pale-ink.py
"""
import re, pathlib, sys

APPS = [("한국사","src"),("컴활","comhwal/src"),("SQLD","sqld/src"),("토익","toeic/src"),("정보처리기사","gisa/src")]
# 흰 바탕에서 4.5:1 을 못 넘는 연한 색들
PALE = re.compile(r"\btext-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300)\b(?:\\?/\d+)?")

total_bad = 0
for name, root in APPS:
    css = pathlib.Path(root, "app/globals.css").read_text()
    # 밝은 테마에서 다시 칠해 둔 것들
    covered = set(re.findall(r'\[data-theme="light"\][^{]*?\.text-([a-z]+-\d+)(?:\\/\d+)?', css))
    used = {}
    for f in sorted(pathlib.Path(root).rglob("*.tsx")):
        src = f.read_text()
        for m in PALE.finditer(src):
            cls = f"{m.group(1)}-{m.group(2)}"
            used.setdefault(cls, []).append(f"{f}:{src[:m.start()].count(chr(10))+1}")
    missing = {c: v for c, v in used.items() if c not in covered}
    print(f"\n━━━ {name} — 연한 색 {len(used)}가지 중 밝은 테마 대비책이 없는 것 {len(missing)}가지")
    for c, where in sorted(missing.items()):
        total_bad += 1
        print(f"  ✗ text-{c}  ({len(where)}곳)  예: {where[0]}")
print(f"\n합계 {total_bad}가지" if total_bad else "\n✓ 연한 색은 모두 밝은 테마 대비책이 있다")
