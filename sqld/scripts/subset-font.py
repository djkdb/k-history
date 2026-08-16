# 앱에 실제로 쓰이는 글자만 남겨 Pretendard 를 줄인다.
#
# 화면에 뜨는 글자는 모두 소스 안의 문자열에서 나오므로, src 아래 모든 파일의
# 문자를 모으면 빠지는 글자가 없다. SQLD 앱은 SQL 키워드 때문에 아스키 비중이
# 크지만, 한글 설명이 다른 앱과 달라 서브셋을 따로 만들어야 한다.
#
#   python3 scripts/subset-font.py
#
# 원본은 Pretendard 1.3.9 (SIL OFL 1.1). 내려받은 자리를 PKG 로 준다.
import os, sys
from fontTools.subset import main as pyftsubset

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "src")
DEST = os.path.join(ROOT, "public", "fonts")
PKG = os.environ.get(
    "PRETENDARD_DIR",
    "/tmp/claude-0/-home-user-k-history/722826a7-4a03-5af7-906f-5a177ee33ccd/scratchpad/pretendard/web/static/woff2-subset",
)

chars = set()
for root, _, files in os.walk(SRC):
    for f in files:
        if f.endswith((".ts", ".tsx", ".css")):
            with open(os.path.join(root, f), encoding="utf-8") as fh:
                chars |= set(fh.read())

# 아스키 전부 — 영어 지문과 숫자·문장부호가 여기서 나온다
chars |= set(chr(c) for c in range(0x20, 0x7F))
# 화면에 쓰는 기호들
chars |= set("★☆◯·—–…→←↑↓✓✕×÷≤≥±°％∙•「」『』〈〉《》【】※©®“”‘’")
# 강세 부호가 붙은 라틴 글자 (résumé, café 같은 말)
chars |= set("áàâäãéèêëíìîïóòôöõúùûüñçÁÀÂÄÃÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÑÇ")
# 한글 자모 (낱자만 쓰이는 자리)
chars |= set(chr(c) for c in range(0x3131, 0x3164))

chars = {c for c in chars if c.strip() or c == " "}
text = "".join(sorted(chars))
hangul = sum(1 for c in chars if 0xAC00 <= ord(c) <= 0xD7A3)
print(f"모은 글자 {len(chars)}자 (한글 음절 {hangul}자)")

if not os.path.isdir(PKG):
    print(f"원본 글꼴을 찾지 못했습니다: {PKG}", file=sys.stderr)
    print("PRETENDARD_DIR 로 경로를 알려 주세요.", file=sys.stderr)
    sys.exit(1)

os.makedirs(DEST, exist_ok=True)
WEIGHTS = {"Regular": 400, "Medium": 500, "SemiBold": 600, "Bold": 700}
total = 0
for name, weight in WEIGHTS.items():
    src = f"{PKG}/Pretendard-{name}.subset.woff2"
    out = f"{DEST}/pretendard-{weight}.woff2"
    argv = [
        src,
        f"--text={text}",
        "--flavor=woff2",
        "--layout-features=*",
        "--no-hinting",
        "--desubroutinize",
        f"--output-file={out}",
    ]
    sys.argv = ["pyftsubset"] + argv
    pyftsubset(argv)
    size = os.path.getsize(out)
    total += size
    print(f"  {weight}  {size/1024:.0f}KB")
print(f"합계 {total/1024:.0f}KB")
