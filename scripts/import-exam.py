#!/usr/bin/env python3
"""
한국사능력검정시험 기출 PDF → 문항 이미지 + 모의고사 데이터 파일 생성기.

국사편찬위원회 자료실(https://www.historyexam.go.kr → 자료실 → 기출문제)에서 받은
문제지·정답표 PDF를 넣으면, 문항별로 잘라 이미지를 만들고 데이터 파일을 만듭니다.

사용법:
    python3 scripts/import-exam.py <문제지PDF> <회차> <advanced|basic> [옵션]

옵션:
    --answer-pdf <정답표PDF>   정답과 배점을 자동으로 읽어 옵니다 (권장)
    --answers 3,1,4,...        정답을 직접 입력 (배점은 모두 2점 처리)
    --pages 4,4,5,...          스캔 회차에서 쪽마다 실린 문항 수
    --attribution "..."        출처 표기 문구

예시:
    python3 scripts/import-exam.py 75-problem.pdf 75 advanced --answer-pdf 75-answer.pdf

만들어지는 것:
    public/exams/75-advanced/q01.webp ... q50.webp
    src/data/mock-exams/round-75-advanced.ts

동작 방식:
    한능검 시험지는 2단 편집이며 문항 번호가 각 단의 고정된 x좌표에서 시작합니다.
    문서 전체에서 "숫자." 토큰의 x좌표를 모아 좌단·우단 기준선을 찾아내고,
    그 선에서 시작하는 것만 문항 번호로 인정합니다.
    (본문 중간의 숫자나 페이지 머리말은 이 과정에서 걸러집니다.)
    각 문항은 다음 문항이 시작되는 y좌표 직전까지 잘라냅니다.
"""

import argparse
import os
import re
import sys
from collections import Counter

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF가 필요합니다:  pip install pymupdf")

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow가 필요합니다:  pip install pillow")

DPI = 200
WEBP_QUALITY = 82  # PNG 대비 약 1/9 용량, 텍스트 가독성 유지
MARKER = re.compile(r"^(\d{1,2})\.$")
CIRCLED = {"①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5}
ASCII_NUM = re.compile(r"[0-9]+")


def save_webp(pix, path):
    """PNG 대신 WebP로 저장한다. 시험지 이미지는 용량이 커서 배포에 부담이 된다."""
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(path, "WEBP", quality=WEBP_QUALITY, method=6)


# ─── 정답표 파싱 ────────────────────────────────────────────────────
# 정답 표기가 회차마다 다르다: 원문자(①)형과 일반 숫자형.

def _answer_tokens(path):
    doc = fitz.open(path)
    out = []
    for pg in doc:
        out += [s.strip() for s in pg.get_text().split("\n") if s.strip()]
    doc.close()
    return out


def _parse_circled(toks):
    """원문자 정답표. "없음"은 정답 0(전원 정답 처리)으로 읽는다.

    문항이의심사에서 오류로 판정돼 정답이 없어지는 문항이 실제로 있다
    (63회 42번). 이 칸을 못 읽으면 세 칸 묶음의 박자가 어긋나
    정답표 전체를 놓친다.
    """
    out, i = {}, 0
    while i < len(toks) - 2:
        a, b, c = toks[i], toks[i + 1], toks[i + 2]
        ans = CIRCLED.get(b, 0 if b == "없음" else None)
        if ASCII_NUM.fullmatch(a) and ans is not None and ASCII_NUM.fullmatch(c):
            n, pts = int(a), int(c)
            if 1 <= n <= 50 and 1 <= pts <= 3:
                out[n] = (ans, pts)
                i += 3
                continue
        i += 1
    return out


def _parse_plain(toks):
    nums = [int(t) for t in toks if ASCII_NUM.fullmatch(t)]
    for offset in range(6):  # 머리말에 섞인 숫자만큼 밀어 본다
        got, seq = {}, nums[offset:]
        for j in range(0, len(seq) - 2, 3):
            n, ans, pts = seq[j], seq[j + 1], seq[j + 2]
            if not (1 <= n <= 50 and 1 <= ans <= 5 and 1 <= pts <= 3):
                got = {}
                break
            got[n] = (ans, pts)
        if len(got) == 50 and sum(p for _, p in got.values()) == 100:
            return got
    return {}


def parse_answer_pdf(path):
    toks = _answer_tokens(path)
    d = _parse_circled(toks)
    if len(d) == 50 and sum(p for _, p in d.values()) == 100:
        return d
    return _parse_plain(toks)


# ─── 문항 분할 ──────────────────────────────────────────────────────

COLUMN_GAP = 100  # 좌단과 우단이 최소 이만큼은 떨어져 있다
MARKER_TOL = 3    # 반올림 오차만 흡수할 만큼의 여유


def find_marker_xs(doc):
    """문항 번호가 실제로 놓이는 x좌표들 (자주 반복되는 것만).

    한 단 안에서도 x가 여러 갈래로 갈린다. 번호가 오른쪽 정렬이라
    "1."과 "10."의 시작점이 다르고(62회: 57 / 48), 쪽마다 여백이
    조금씩 흔들리기도 한다. 그래서 "단 = x값 하나"로 보면 안 된다.
    여기서는 자주 나오는 x를 전부 모으고, 단 구분은 쪽 절반 기준으로
    따로 판단한다.
    """
    xs = []
    for pg in doc:
        for w in pg.get_text("words"):
            if MARKER.match(w[4]):
                xs.append(round(w[0]))
    if not xs:
        return []

    # 여러 번 반복되는 x만 남긴다. 본문 속 "3." 같은 우연한 토큰은
    # 같은 자리에서 반복되지 않으므로 이 문턱을 넘지 못한다.
    # 가까운 값을 하나로 묶지는 않는다 — 62회처럼 홀·짝 쪽의 여백이
    # 8pt씩 어긋나는 경우, 묶어 버리면 한쪽이 통째로 걸러진다.
    return sorted(x for x, c in Counter(xs).items() if c >= 3)


def find_column_anchors(doc):
    """좌단·우단의 왼쪽 경계 x좌표. 잘라 낼 가로 범위의 기준이 된다."""
    xs = find_marker_xs(doc)
    if not xs:
        return []
    mid = doc[0].rect.width / 2
    left = [x for x in xs if x < mid]
    right = [x for x in xs if x >= mid]
    # 같은 단 안의 여러 갈래 중 가장 왼쪽이 그 단의 경계다
    cols = [min(left)] if left else []
    if right:
        cols.append(min(right))
    # 두 무리가 사실상 한 단이면(간격이 좁으면) 한 단짜리로 본다
    if len(cols) == 2 and cols[1] - cols[0] < COLUMN_GAP:
        cols = [cols[0]]
    return cols


def collect_questions(doc, anchors, marker_xs=None, tol=MARKER_TOL):
    """(문항번호, 페이지, 단, y시작) 목록"""
    xs = marker_xs if marker_xs is not None else find_marker_xs(doc)
    found = []
    for pi, pg in enumerate(doc):
        mid = pg.rect.width / 2
        for w in pg.get_text("words"):
            m = MARKER.match(w[4])
            if not m:
                continue
            num = int(m.group(1))
            if not (1 <= num <= 50):
                continue
            if not any(abs(w[0] - ax) <= tol for ax in xs):
                continue
            # 단은 x값이 아니라 쪽의 절반을 기준으로 가른다
            col = 0 if (w[0] < mid or len(anchors) == 1) else 1
            found.append({"num": num, "page": pi, "col": col, "y": w[1]})
    # 같은 번호가 여러 번 잡히면 가장 앞선 위치만
    best = {}
    for f in found:
        key = f["num"]
        if key not in best or (f["page"], f["y"]) < (best[key]["page"], best[key]["y"]):
            best[key] = f
    return sorted(best.values(), key=lambda f: f["num"])


def crop(doc, anchors, marks, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    zoom = DPI / 72
    saved = []

    # 페이지·단별로 묶어 다음 문항 시작점을 알아내기
    by_page_col = {}
    for m in marks:
        by_page_col.setdefault((m["page"], m["col"]), []).append(m)
    for v in by_page_col.values():
        v.sort(key=lambda m: m["y"])

    for m in marks:
        pg = doc[m["page"]]
        W, H = pg.rect.width, pg.rect.height
        siblings = by_page_col[(m["page"], m["col"])]
        i = siblings.index(m)
        top = m["y"] - 8
        if i + 1 < len(siblings):
            bottom = siblings[i + 1]["y"] - 8
        else:
            # 단의 마지막 문항 — 본문이 끝나는 지점까지
            ys = [
                w[3]
                for w in pg.get_text("words")
                if (w[0] < W / 2) == (m["col"] == 0) and w[1] > m["y"]
            ]
            bottom = (max(ys) + 12) if ys else H - 30

        # 단의 가로 범위: 기준선 왼쪽 여백부터 다음 단 직전까지.
        # 오른쪽을 너무 당기면 행 끝의 배점 표시("[2점]")가 잘린다.
        # 62회는 본문이 x=368.5까지 가는데 다음 단 기준선이 380이라
        # 여유를 14pt 두면 배점이 날아갔다. 8pt로 좁혀 둔다.
        left = max(anchors[m["col"]] - 10, 0)
        right = (anchors[m["col"] + 1] - 8) if m["col"] + 1 < len(anchors) else W - 20

        rect = fitz.Rect(left, max(top, 0), right, min(bottom, H))
        if rect.height < 40 or rect.width < 40:
            continue
        pix = pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=rect)
        name = f"q{m['num']:02d}.webp"
        save_webp(pix, os.path.join(out_dir, name))
        saved.append((m["num"], name))
    return sorted(saved)


# 묶음 문항의 공용 자료 — "[49 ~ 50] 다음 자료를 읽고 물음에 답하시오"
GROUP = re.compile(r"^\[\s*(\d{1,2})\s*[~∼\u2006 -]+\s*(\d{1,2})\s*\]$")


def crop_shared(doc, anchors, out_dir):
    """한 자료로 두 문항을 묻는 경우, 그 자료를 따로 잘라 낸다.

    자료 상자는 어느 한 문항에도 속하지 않아 문항별로 자르면 통째로 빠진다.
    실제로 62회 49~50번과 72회 47~48번이 자료 없이 나갔다.
    표시는 늘 단 맨 위에 있고 묶인 문항이 그 아래로 이어지므로,
    표시부터 그 단의 첫 문항 직전까지를 자료로 본다.

    돌려주는 값: {문항번호: 파일명}
    """
    zoom = DPI / 72
    out = {}
    for pi, pg in enumerate(doc):
        W, H = pg.rect.width, pg.rect.height
        words = pg.get_text("words")
        for w in words:
            m = GROUP.match(w[4].replace(" ", ""))
            if not m:
                continue
            a, b = int(m.group(1)), int(m.group(2))
            col = 0 if w[0] < W / 2 else 1
            ys = [
                x[1]
                for x in words
                if MARKER.match(x[4])
                and (x[0] < W / 2) == (col == 0)
                and x[1] > w[1] + 5
            ]
            bottom = min(ys) - 8 if ys else H - 30
            left = max(anchors[col] - 10, 0)
            right = (anchors[col + 1] - 8) if col + 1 < len(anchors) else W - 20
            rect = fitz.Rect(left, w[1] - 10, right, bottom)
            if rect.height < 60:
                continue
            name = f"s{a:02d}-{b:02d}.webp"
            save_webp(pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=rect),
                      os.path.join(out_dir, name))
            for n in range(a, b + 1):
                out[n] = name
    return out


def render_pages(doc, out_dir, dpi=DPI):
    """문항 분할이 불가능한 스캔 PDF — 쪽 단위 이미지로 저장한다."""
    os.makedirs(out_dir, exist_ok=True)
    z = dpi / 72
    names = []
    for i, pg in enumerate(doc):
        pix = pg.get_pixmap(matrix=fitz.Matrix(z, z))
        name = f"p{i + 1:02d}.webp"
        save_webp(pix, os.path.join(out_dir, name))
        names.append(name)
    return names


def page_of(counts):
    """쪽별 문항 수 → {문항번호: 쪽번호}"""
    out, num = {}, 1
    for i, c in enumerate(counts, start=1):
        for _ in range(c):
            out[num] = i
            num += 1
    return out


def write_data_file(path, exam_id, rnd, level, questions, answers, attribution,
                    page_images=None, pages=None, shared=None):
    var = f"ROUND_{rnd}_{level.upper()}"
    lines = [
        'import type { MockExam } from "@/lib/types";',
        "",
        "// 국사편찬위원회가 공개한 기출문제를 문항별로 잘라 담았습니다.",
        "// 문항 이미지는 public/exams/ 아래에 있으며, 출처를 함께 표시합니다.",
        "// 이 파일은 scripts/import-exam.py 가 생성했습니다.",
        "",
        f"export const {var}: MockExam = {{",
        f'  id: "{exam_id}",',
        f"  round: {rnd},",
        f'  level: "{level}",',
        f"  timeLimitMin: {80 if level == 'advanced' else 70},",
        f'  attribution: "{attribution}",',
    ]
    if page_images:
        lines.append("  pageImages: [")
        for n in page_images:
            lines.append(f'    "/exams/{exam_id}/{n}",')
        lines.append("  ],")
    lines.append("  questions: [")
    if page_images:
        # 쪽 모드: 문항 이미지가 없으므로 번호·정답·배점만 담는다
        for num in sorted(answers):
            ans, pts = answers[num]
            lines += [
                "    {",
                f"      number: {num},",
                f"      points: {pts},",
                f"      answer: {ans},",
            ]
            if pages and num in pages:
                lines.append(f"      page: {pages[num]},")
            lines.append("    },")
    else:
        for num, name in questions:
            ans, pts = answers.get(num, (0, 2))
            todo = "" if ans else "  // TODO: 정답 입력 (1~5)"
            lines += [
                "    {",
                f"      number: {num},",
                f"      points: {pts},",
                f'      image: "/exams/{exam_id}/{name}",',
            ]
            if shared and num in shared:
                lines.append(
                    f'      sharedImage: "/exams/{exam_id}/{shared[num]}",'
                )
            lines += [
                f"      answer: {ans},{todo}",
                "    },",
            ]
    lines += ["  ],", "};", ""]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return var


def main():
    ap = argparse.ArgumentParser(description="한능검 기출 PDF 임포터")
    ap.add_argument("pdf", help="문제지 PDF")
    ap.add_argument("round", type=int, help="회차 (예: 75)")
    ap.add_argument("level", choices=["advanced", "basic"])
    ap.add_argument("--answer-pdf", help="정답표 PDF (정답·배점 자동 추출)")
    ap.add_argument("--answers", default="", help="정답 직접 입력 (쉼표 구분)")
    ap.add_argument(
        "--page-mode",
        action="store_true",
        help="문항 분할 없이 쪽 단위 이미지로 만듭니다 (스캔 PDF용)",
    )
    ap.add_argument(
        "--pages",
        default="",
        help="쪽 모드에서 쪽마다 실린 문항 수 (예: 4,4,4,4,5,4,5,4,4,4,4,4). "
        "채점 뒤 문항을 누르면 그 문항이 실린 쪽을 펴 주는 데 쓴다",
    )
    ap.add_argument(
        "--attribution",
        default="국사편찬위원회 한국사능력검정시험 기출문제",
    )
    args = ap.parse_args()

    if not os.path.exists(args.pdf):
        sys.exit(f"PDF를 찾을 수 없습니다: {args.pdf}")

    exam_id = f"{args.round}-{args.level}"
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "public", "exams", exam_id)

    doc = fitz.open(args.pdf)
    anchors = [] if args.page_mode else find_column_anchors(doc)
    page_images = None
    questions = []

    shared = {}
    if anchors:
        marks = collect_questions(doc, anchors)
        questions = crop(doc, anchors, marks, out_dir)
        if questions:
            shared = crop_shared(doc, anchors, out_dir)
    if not anchors or len(questions) < 40:
        # 텍스트 레이어가 없는 스캔 PDF — 쪽 단위로 제공한다
        print("문항 자동 분할 불가 → 쪽 단위 이미지로 전환합니다")
        for f in os.listdir(out_dir) if os.path.isdir(out_dir) else []:
            if f.startswith(("q", "p")):
                os.unlink(os.path.join(out_dir, f))
        page_images = render_pages(doc, out_dir)
        questions = []
    doc.close()

    answers = {}
    if args.answer_pdf and os.path.exists(args.answer_pdf):
        answers = parse_answer_pdf(args.answer_pdf)
    elif args.answers:
        for i, a in enumerate(args.answers.split(","), start=1):
            if a.strip().isdigit():
                answers[i] = (int(a.strip()), 2)

    data_dir = os.path.join(root, "src", "data", "mock-exams")
    os.makedirs(data_dir, exist_ok=True)
    data_path = os.path.join(data_dir, f"round-{exam_id}.ts")
    var = write_data_file(
        data_path, exam_id, args.round, args.level, questions, answers,
        args.attribution, page_images,
        page_of([int(c) for c in args.pages.split(",")]) if args.pages else None,
        shared,
    )

    nums = [n for n, _ in questions]
    missing_q = [] if page_images else sorted(set(range(1, 51)) - set(nums))
    # 정답 0은 "정답 없음(전원 정답 처리)"이라 정상이다 — 빠진 것과 구분한다
    none_a = [n for n in sorted(answers) if answers[n][0] == 0]
    missing_a = [n for n in range(1, 51) if n not in answers]

    if page_images:
        print(f"쪽 이미지 {len(page_images)}장 → public/exams/{exam_id}/")
    else:
        print(f"기준선 x={anchors} · 문항 이미지 {len(questions)}개 → public/exams/{exam_id}/")
    print(f"정답 {len(answers)}개 · 배점 합계 {sum(p for _, p in answers.values())}점")
    print(f"데이터 파일 → src/data/mock-exams/round-{exam_id}.ts")
    if missing_q:
        print(f"⚠️  이미지 누락 문항: {missing_q}")
    if shared:
        groups = sorted(set(shared.values()))
        print(f"묶음 문항 공용 자료 {len(groups)}건: {', '.join(groups)}")
    if none_a:
        print(f"ℹ️  정답 없음(전원 정답 처리) 문항: {none_a}")
    if missing_a:
        print(f"⚠️  정답 미입력: {missing_a[:12]}{'…' if len(missing_a) > 12 else ''}")
    print(f"\n등록:  import {{ {var} }} from './round-{exam_id}';")


if __name__ == "__main__":
    main()
