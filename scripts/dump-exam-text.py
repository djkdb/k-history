"""기출 PDF에서 문항 원문(발문·자료·선택지)을 뽑아 JSON으로 저장한다.

사용법:
    python3 scripts/dump-exam-text.py <기출 PDF 디렉터리> <출력 JSON>

해설을 쓰려면 발문뿐 아니라 선택지 5개가 다 필요하다.
match-concepts.py는 오답 개념이 섞이는 걸 막으려고 선택지를 잘라 내지만,
여기서는 반대로 선택지까지 온전히 남긴다.

스캔 이미지 회차(69·73·74·78)는 텍스트 레이어가 없어 아무것도 나오지 않는다.
"""
import glob
import json
import os
import re
import sys

import fitz

NUMBER = re.compile(r"^(\d{1,2})\.$")
CHOICE = re.compile(r"[①②③④⑤]")


def markers(doc, anchors=(43, 374), tol=4):
    found = []
    for pi, pg in enumerate(doc):
        for w in pg.get_text("words"):
            m = NUMBER.match(w[4])
            if not m:
                continue
            n = int(m.group(1))
            if not 1 <= n <= 50:
                continue
            for ci, ax in enumerate(anchors):
                if abs(w[0] - ax) <= tol:
                    found.append({"n": n, "p": pi, "c": ci, "y": w[1]})
                    break
    best = {}
    for f in found:
        if f["n"] not in best or (f["p"], f["y"]) < (
            best[f["n"]]["p"],
            best[f["n"]]["y"],
        ):
            best[f["n"]] = f
    return best


def dump(pdf):
    doc = fitz.open(pdf)
    mk = markers(doc)
    by_col = {}
    for f in mk.values():
        by_col.setdefault((f["p"], f["c"]), []).append(f)
    for v in by_col.values():
        v.sort(key=lambda f: f["y"])

    out = {}
    for n, f in mk.items():
        pg = doc[f["p"]]
        W, H = pg.rect.width, pg.rect.height
        sib = by_col[(f["p"], f["c"])]
        i = sib.index(f)
        top = f["y"] - 8
        bottom = sib[i + 1]["y"] - 8 if i + 1 < len(sib) else H - 30
        left = max((43, 374)[f["c"]] - 12, 0)
        right = (374 - 14) if f["c"] == 0 else W - 20
        ws = pg.get_text(
            "words", clip=fitz.Rect(left, max(top, 0), right, min(bottom, H))
        )
        # 문서 순서가 아니라 눈에 보이는 순서(위→아래, 왼→오른)로 정렬한다
        ws = sorted(ws, key=lambda w: (round(w[1] / 3), w[0]))
        text = re.sub(r"\s+", " ", " ".join(w[4] for w in ws)).strip()

        # 선택지 ①~⑤를 쪼갠다
        parts = CHOICE.split(text)
        stem = parts[0].strip()
        opts = [p.strip() for p in parts[1:]] if len(parts) == 6 else []
        out[n] = {"stem": stem, "options": opts}
    doc.close()
    return out


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    pdf_dir, out_path = sys.argv[1], sys.argv[2]
    result = {}
    for path in sorted(glob.glob(os.path.join(pdf_dir, "*-problem.pdf"))):
        rnd = int(os.path.basename(path).split("-")[0])
        qs = dump(path)
        if not qs:
            print(f"{rnd}회: 텍스트 레이어 없음 — 건너뜀")
            continue
        full = sum(1 for q in qs.values() if len(q["options"]) == 5)
        result[rnd] = qs
        print(f"{rnd}회: {len(qs)}문항, 선택지 5개 완비 {full}문항")
    with open(out_path, "w", encoding="utf8") as fp:
        json.dump(result, fp, ensure_ascii=False, indent=1)
    print(f"\n→ {out_path}")


if __name__ == "__main__":
    main()
