"""
글자 없는 단추·링크를 소스에서 훑는다.

화면을 열어 보는 검사(semantics.js)는 그때 화면에 떠 있는 것만 본다.
검색어를 지우는 ✕ 처럼 조건이 맞아야 나타나는 단추는 영영 걸리지 않는다.
그래서 열지 않고도 한 번 훑는다 — 여는 태그 안에 aria-label 이 없고,
안쪽에 한글·영문 글자가 하나도 없는 <button>·<Link> 를 찾는다.
"""
import re, sys, pathlib

ROOTS = ["src", "comhwal/src", "sqld/src", "toeic/src", "gisa/src"]
TAG = re.compile(r"<(button|Link|a)\b", re.S)
HANGUL = re.compile(r"[가-힣A-Za-z0-9]")

def element_span(text, start):
    """여는 태그의 끝과 닫는 태그의 시작을 찾는다 (같은 이름 중첩까지 센다)."""
    name = TAG.match(text, start).group(1)
    i, depth = start, 0
    # 여는 태그 끝
    j, q = start, None
    while j < len(text):
        c = text[j]
        if q:
            if c == q: q = None
        elif c in "\"'": q = c
        elif c == "{":
            d = 1; j += 1
            while j < len(text) and d:
                if text[j] == "{": d += 1
                elif text[j] == "}": d -= 1
                j += 1
            continue
        elif c == ">":
            break
        j += 1
    open_end = j
    if text[j-1] == "/":          # 자기 닫음
        return open_end, open_end
    k, depth = open_end, 1
    pat = re.compile(rf"<(/?){name}\b")
    for m in pat.finditer(text, open_end):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return open_end, m.start()
    return open_end, len(text)

bad = 0
files = 0
for root in ROOTS:
    for f in sorted(pathlib.Path(root).rglob("*.tsx")):
        src = f.read_text()
        files += 1
        icons = set()
        for im in re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"lucide-react"', src):
            icons |= {x.strip().split(" as ")[-1].strip() for x in im.group(1).split(",") if x.strip()}
        for m in TAG.finditer(src):
            oe, ce = element_span(src, m.start())
            head = src[m.start():oe]
            body = src[oe+1:ce]
            if "aria-label" in head or "aria-labelledby" in head or "title=" in head:
                continue
            # 안쪽 태그를 걷어 내고 남은 글자
            body_nc = re.sub(r"\{/\*.*?\*/\}", " ", body, flags=re.S)
            """
            ⚠️ 처음에는 "글자가 없으면 수상하다" 로 훑었다. {label} 처럼 글자가
               변수로 들어오는 곳까지 싸잡아 89곳을 적었는데 거의 다 멀쩡했다.
               거짓 경보로 가득한 검사는 아무도 안 본다. 진짜 모양만 본다 —
               안에 자기 닫음 태그(<X size={14} />)만 들어 있는 단추.
            """
            kids = re.findall(r"<([A-Z]\w*)[^<>]*/>", body_nc)
            if not kids or not re.fullmatch(r"(?:\s*<[A-Z]\w*[^<>]*/>\s*)+", body_nc):
                continue
            """
            ⚠️ 좁히고 나서도 둘이 헛걸렸다. <KeyCaps combo={c} /> 는 그림이
               아니라 "Ctrl + Shift + L" 이라는 글자를 그린다. 자기 닫음
               태그라고 다 아이콘은 아니다. lucide-react 에서 가져온 이름만
               아이콘으로 친다 — 그것들은 정말 글자를 내놓지 않는다.
            """
            if not all(k in icons for k in kids):
                continue
            guess = ""
            line = src[:m.start()].count("\n") + 1
            print(f"  {f}:{line}  <{m.group(1)}> 아이콘뿐인데 이름이 없다 — {body_nc.strip()[:46]}")
            bad += 1
print(f"\n파일 {files}개를 훑었다")
print(f"아이콘뿐인데 이름 없는 단추·링크 {bad}곳" if bad else "✓ 아이콘뿐인 단추·링크는 모두 이름이 있다")
