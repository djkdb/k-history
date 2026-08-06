#!/usr/bin/env python3
"""
한국사능력검정시험 기출 PDF → 문항 이미지 + 데이터 파일 생성기.

공식 자료실(https://www.historyexam.go.kr → 자료실 → 기출문제)에서 받은
문제지 PDF를 넣으면, 문항별로 잘라 이미지를 만들고 모의고사 데이터 파일을 만듭니다.

사용법:
    python3 scripts/import-exam.py <PDF경로> <회차> <advanced|basic> [--answers 1,3,2,...]

예시:
    python3 scripts/import-exam.py ~/Downloads/68회_심화.pdf 68 advanced
    python3 scripts/import-exam.py ~/Downloads/68회_심화.pdf 68 advanced --answers 3,1,4,2,5,...

만들어지는 것:
    public/exams/68-advanced/q01.png ... q50.png   (문항 캡처 이미지)
    src/data/mock-exams/round-68-advanced.ts        (문항 데이터 — 정답 채우면 완성)

정답은 --answers로 한 번에 넣거나, 생성된 .ts 파일에서 직접 고칠 수 있습니다.
정답표 PDF는 문제지와 별도로 제공되므로 눈으로 확인해 입력하세요.

동작 방식:
    한능검 시험지는 2단 편집입니다. 페이지의 텍스트를 좌표와 함께 읽어
    각 단의 왼쪽 끝에서 시작하는 "1." "2." 같은 문항 번호를 찾고,
    다음 번호가 나오는 지점까지를 한 문항으로 잘라냅니다.
"""

import argparse
import os
import re
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF가 필요합니다:  pip install pymupdf")

DPI = 200
QUESTION_MARKER = re.compile(r"^(\d{1,2})\.")


def find_question_markers(page):
    """페이지에서 (문항번호, 단 인덱스, y좌표, 단의 x범위)를 찾는다."""
    width = page.rect.width
    mid = width / 2
    words = page.get_text("words")  # (x0, y0, x1, y1, word, block, line, word_no)
    if not words:
        return []

    # 각 단에서 텍스트가 시작되는 x 위치를 추정
    left_starts = [w[0] for w in words if w[0] < mid]
    right_starts = [w[0] for w in words if w[0] >= mid]
    left_margin = min(left_starts) if left_starts else 0
    right_margin = min(right_starts) if right_starts else mid

    markers = []
    for x0, y0, x1, y1, text, *_ in words:
        m = QUESTION_MARKER.match(text)
        if not m:
            continue
        num = int(m.group(1))
        if not (1 <= num <= 50):
            continue
        col = 0 if x0 < mid else 1
        margin = left_margin if col == 0 else right_margin
        # 문항 번호는 단의 왼쪽 끝에 붙어 시작한다 (본문 중간의 숫자 배제)
        if x0 - margin > 12:
            continue
        markers.append({"num": num, "col": col, "y": y0})

    # 같은 번호가 여러 번 잡히면 가장 위의 것만
    seen = {}
    for mk in markers:
        key = (mk["col"], mk["num"])
        if key not in seen or mk["y"] < seen[key]["y"]:
            seen[key] = mk
    return sorted(seen.values(), key=lambda m: (m["col"], m["y"]))


def crop_questions(pdf_path, out_dir):
    """PDF 전체를 훑어 문항별 이미지를 저장하고 [(번호, 파일명)] 반환."""
    doc = fitz.open(pdf_path)
    os.makedirs(out_dir, exist_ok=True)
    zoom = DPI / 72
    saved = []

    for page_no in range(len(doc)):
        page = doc[page_no]
        markers = find_question_markers(page)
        if not markers:
            continue

        width = page.rect.width
        height = page.rect.height
        mid = width / 2

        for i, mk in enumerate(markers):
            col = mk["col"]
            top = mk["y"] - 6
            # 같은 단의 다음 문항 시작 직전까지
            nxt = next(
                (m for m in markers[i + 1 :] if m["col"] == col),
                None,
            )
            bottom = (nxt["y"] - 6) if nxt else height - 30

            x0 = 0 if col == 0 else mid
            x1 = mid if col == 0 else width
            rect = fitz.Rect(x0, max(top, 0), x1, min(bottom, height))
            if rect.height < 40:
                continue

            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=rect)
            name = f"q{mk['num']:02d}.png"
            pix.save(os.path.join(out_dir, name))
            saved.append((mk["num"], name))

    doc.close()
    # 번호 중복 시 뒤에 나온 것(더 정확한 페이지)을 남긴다
    dedup = {}
    for num, name in saved:
        dedup[num] = name
    return sorted(dedup.items())


def write_data_file(path, exam_id, rnd, level, questions, answers, attribution):
    lines = [
        'import type { MockExam } from "@/lib/types";',
        "",
        "// 국사편찬위원회가 공개한 기출문제를 내려받아 문항별로 잘라 넣은 자료입니다.",
        "// 출처를 반드시 함께 표시하세요.",
        "",
        f"export const ROUND_{rnd}_{level.upper()}: MockExam = {{",
        f'  id: "{exam_id}",',
        f"  round: {rnd},",
        f'  level: "{level}",',
        f"  timeLimitMin: {80 if level == 'advanced' else 70},",
        f'  attribution: "{attribution}",',
        "  questions: [",
    ]
    for num, name in questions:
        ans = answers.get(num, 0)
        note = "" if ans else "  // TODO: 정답 입력 (1~5)"
        lines.append("    {")
        lines.append(f"      number: {num},")
        lines.append(f"      points: 2,")
        lines.append(f'      image: "/exams/{exam_id}/{name}",')
        lines.append(f"      answer: {ans},{note}")
        lines.append("    },")
    lines += ["  ],", "};", ""]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    ap = argparse.ArgumentParser(description="한능검 기출 PDF 임포터")
    ap.add_argument("pdf", help="기출 문제지 PDF 경로")
    ap.add_argument("round", type=int, help="회차 (예: 68)")
    ap.add_argument("level", choices=["advanced", "basic"], help="심화 / 기본")
    ap.add_argument(
        "--answers",
        default="",
        help="정답을 1번부터 쉼표로 구분해 입력 (예: 3,1,4,2,5)",
    )
    ap.add_argument(
        "--attribution",
        default="국사편찬위원회 한국사능력검정시험 기출문제",
        help="출처 표기",
    )
    args = ap.parse_args()

    if not os.path.exists(args.pdf):
        sys.exit(f"PDF를 찾을 수 없습니다: {args.pdf}")

    exam_id = f"{args.round}-{args.level}"
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, "public", "exams", exam_id)

    print(f"▶ {args.pdf} 에서 문항을 잘라냅니다…")
    questions = crop_questions(args.pdf, out_dir)
    if not questions:
        sys.exit(
            "문항을 찾지 못했습니다.\n"
            "  · 스캔 이미지 PDF면 텍스트 좌표를 읽을 수 없습니다 (OCR 필요)\n"
            "  · 편집 형식이 다르면 find_question_markers()를 조정하세요"
        )

    answers = {}
    if args.answers:
        for i, a in enumerate(args.answers.split(","), start=1):
            a = a.strip()
            if a.isdigit():
                answers[i] = int(a)

    data_dir = os.path.join(root, "src", "data", "mock-exams")
    os.makedirs(data_dir, exist_ok=True)
    data_path = os.path.join(data_dir, f"round-{exam_id}.ts")
    write_data_file(
        data_path, exam_id, args.round, args.level, questions, answers, args.attribution
    )

    missing = [n for n, _ in questions if not answers.get(n)]
    print(f"✅ 문항 이미지 {len(questions)}개 → public/exams/{exam_id}/")
    print(f"✅ 데이터 파일 → src/data/mock-exams/round-{exam_id}.ts")
    if missing:
        print(f"⚠️  정답 미입력 {len(missing)}문항: {missing[:12]}{'…' if len(missing) > 12 else ''}")
        print("   생성된 .ts 파일의 answer 값을 채우거나 --answers 로 다시 실행하세요.")
    print()
    print("마지막으로 src/data/mock-exams/index.ts 의 MOCK_EXAMS 배열에 추가하세요:")
    print(f"  import {{ ROUND_{args.round}_{args.level.upper()} }} from './round-{exam_id}';")


if __name__ == "__main__":
    main()
