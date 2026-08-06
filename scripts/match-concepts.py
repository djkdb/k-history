"""기출 문항 → 개념(eventId) 자동 매칭.

사용법:
    # 1) 개념 데이터 내보내기 (프로젝트 루트에서)
    #    ALL_EVENTS를 concepts.json으로 저장하는 tsx 스크립트를 먼저 실행
    # 2) python3 scripts/match-concepts.py
    #    → matched.json 생성, 이를 데이터 파일의 eventIds에 반영

정확도는 표본 검토 기준 약 85%입니다. 완벽하지 않으므로
결과 화면에서도 '자동으로 찾아낸 개념'임을 밝힙니다.
스캔 시험지 회차는 텍스트 레이어가 없어 매칭할 수 없습니다.


문항의 발문+자료(선택지 제외)에서 고유명사 신호를 찾아 개념에 연결한다.
선택지는 오답 개념을 언급하므로 매칭에 쓰면 안 된다.
확신이 서지 않으면 비워 둔다 — 잘못된 연결은 없는 것보다 나쁘다.
"""
import fitz, re, json, os
SC = "/tmp/claude-0/-home-user-k-history/722826a7-4a03-5af7-906f-5a177ee33ccd/scratchpad"
CONCEPTS = json.load(open(f"{SC}/concepts.json", encoding="utf8"))
M = re.compile(r'^(\d{1,2})\.$')

# 시대·국가명처럼 너무 흔해 개념을 특정하지 못하는 말
COMMON = {"고구려","백제","신라","고려","조선","가야","발해","부여","왕","국왕","나라",
          "삼국","전쟁","개혁","정치","제도","문화","사회","경제","운동","사건","시대"}

# 일반 명사·다른 맥락과 충돌해 오탐을 만드는 말 (실제 오탐 사례에서 확인)
AMBIGUOUS = {"이익", "인종", "삼국사기", "삼국유사", "정부", "조약", "헌법", "의정부",
             "고종", "선조", "명종", "성종", "태종", "세조", "중종"}

def signals(c):
    """(문자열, 가중치) 목록 — 고유명사일수록 높게"""
    out = []
    for h in c["heritage"]:
        if len(h) >= 3 and h not in AMBIGUOUS: out.append((h, 4))
    for f in c["figures"]:
        if len(f) >= 2 and f not in COMMON and f not in AMBIGUOUS: out.append((f, 3))
    for k in c["keywords"]:
        if k in COMMON or k in AMBIGUOUS: continue
        out.append((k, 4 if len(k) >= 4 else 3 if len(k) >= 3 else 1))
    if c["king"] and c["king"] not in COMMON:
        for k in re.split(r'[·,()\s]+', c["king"]):
            if len(k) >= 2 and k not in COMMON: out.append((k, 3))
    for t in re.split(r'[\s·—,():]+', c["title"]):
        t = re.sub(r'(과|와|의|은|는|이|가|을|를)$', '', t)
        if len(t) >= 3 and t not in COMMON: out.append((t, 2))
    return out

SIG = {c["id"]: signals(c) for c in CONCEPTS}

def match(stem, min_score=4):
    """1위가 2위보다 확실히 앞설 때만 단일 배정한다.
       애매하면 비워 둔다 — 잘못된 개념으로 보내는 것이 최악이다."""
    scores = {}
    for cid, sigs in SIG.items():
        s = 0
        seen = set()
        for word, w in sigs:
            if word in seen: continue
            if word and word in stem:
                s += w; seen.add(word)
        if s: scores[cid] = s
    if not scores: return []
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])
    best = ranked[0][1]
    if best < min_score: return []
    if len(ranked) > 1 and ranked[1][1] >= best: return []   # 동점이면 판단 보류
    return [ranked[0][0]]

def markers(doc, anchors=(43,374), tol=4):
    found = []
    for pi, pg in enumerate(doc):
        for w in pg.get_text("words"):
            m = M.match(w[4])
            if not m: continue
            n = int(m.group(1))
            if not 1 <= n <= 50: continue
            for ci, ax in enumerate(anchors):
                if abs(w[0]-ax) <= tol: found.append({"n":n,"p":pi,"c":ci,"y":w[1]}); break
    best = {}
    for f in found:
        if f["n"] not in best or (f["p"],f["y"]) < (best[f["n"]]["p"], best[f["n"]]["y"]):
            best[f["n"]] = f
    return best

def stems(pdf):
    doc = fitz.open(pdf); mk = markers(doc)
    byc = {}
    for f in mk.values(): byc.setdefault((f["p"],f["c"]), []).append(f)
    for v in byc.values(): v.sort(key=lambda f: f["y"])
    out = {}
    for n, f in mk.items():
        pg = doc[f["p"]]; W, H = pg.rect.width, pg.rect.height
        sib = byc[(f["p"],f["c"])]; i = sib.index(f)
        top = f["y"]-8; bottom = sib[i+1]["y"]-8 if i+1 < len(sib) else H-30
        left = max((43,374)[f["c"]]-12, 0); right = (374-14) if f["c"]==0 else W-20
        ws = pg.get_text("words", clip=fitz.Rect(left, max(top,0), right, min(bottom,H)))
        ws = sorted(ws, key=lambda w: (round(w[1]/3), w[0]))
        txt = " ".join(w[4] for w in ws)
        out[n] = txt.split("①")[0]   # 선택지 제외
    doc.close()
    return out

if __name__ == "__main__":
    base = f"{SC}/exams"
    result = {}
    for r in [70,71,72,75,76,77]:
        st = stems(f"{base}/{r}-problem.pdf")
        got = {n: match(s) for n, s in st.items()}
        hit = sum(1 for v in got.values() if v)
        result[r] = got
        print(f"{r}회: {hit}/50 매칭 ({hit*2}%)")
    json.dump(result, open(f"{SC}/matched.json","w"), ensure_ascii=False)
    tot = sum(sum(1 for v in g.values() if v) for g in result.values())
    print(f"\n합계 {tot}/300 ({tot/3:.0f}%)")
