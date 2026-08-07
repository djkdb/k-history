#!/usr/bin/env python3
"""회차 데이터 파일에 해설(과 선택지 원문)을 채워 넣는다.

사용법:
    python3 scripts/apply-explanations.py <해설.json> [--text <문항원문.json>]

해설 JSON 형식:
    { "62": { "1": "…", "2": "…" }, "63": { … } }

--text 로 dump-exam-text.py 결과를 함께 주면 선택지 원문(options)도 넣는다.
채점 화면에서 "정답 ③"만 보여 주는 대신 그 선택지가 무엇이었는지 함께
보여 주려면 options가 있어야 한다.

같은 회차에 두 번 돌려도 안전하다. 기존 explanation·options를 지우고
새로 넣기 때문에, 해설을 고쳐 쓴 뒤 다시 실행하면 그대로 반영된다.
"""

import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mock-exams")

# 기존 값 제거용. 생성기가 쓰는 한 줄 형태와 prettier가 접는 두 줄 형태를 모두 지운다.
DROP_EXPLANATION = re.compile(r"\n +explanation:\s*\n?\s*\"(?:[^\"\\]|\\.)*\",")
DROP_OPTIONS = re.compile(r"\n +options: \[(?:[^\]]*)\],")


def esc(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"')


def apply_round(rnd: str, exps: dict, texts: dict | None) -> int:
    path = os.path.join(ROOT, f"round-{rnd}-advanced.ts")
    if not os.path.exists(path):
        print(f"  ⚠️  {path} 없음 — 건너뜀")
        return 0
    src = open(path, encoding="utf-8").read()
    done = 0

    # 문항 블록을 number로 찾아 그 블록 안에서만 손댄다
    def repl(m: re.Match) -> str:
        nonlocal done
        block = m.group(0)
        num = m.group(1)
        exp = exps.get(num)
        opts = (texts or {}).get(num, {}).get("options") if texts else None
        if not exp and not opts:
            return block
        block = DROP_EXPLANATION.sub("", block)
        block = DROP_OPTIONS.sub("", block)
        add = ""
        if exp:
            add += f'\n      explanation:\n        "{esc(exp)}",'
        if opts and len(opts) == 5 and all(o.strip() for o in opts):
            joined = ",\n".join(f'        "{esc(o)}"' for o in opts)
            add += f"\n      options: [\n{joined},\n      ],"
        if exp:
            done += 1
        # 블록 끝의 닫는 중괄호 직전에 끼워 넣는다
        return block.rstrip().rstrip(",").rstrip()[: -len("}")].rstrip() + add + "\n    },"

    # { number: N, … } 한 덩어리
    src = re.sub(
        r"\{\n      number: (\d+),.*?\n    \},",
        repl,
        src,
        flags=re.S,
    )
    open(path, "w", encoding="utf-8").write(src)
    return done


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    exps = json.load(open(sys.argv[1], encoding="utf-8"))
    texts = None
    if "--text" in sys.argv:
        texts = json.load(
            open(sys.argv[sys.argv.index("--text") + 1], encoding="utf-8")
        )

    for rnd in sorted(exps, key=int):
        n = apply_round(rnd, exps[rnd], (texts or {}).get(rnd))
        print(f"{rnd}회: 해설 {n}문항 반영")


if __name__ == "__main__":
    main()
