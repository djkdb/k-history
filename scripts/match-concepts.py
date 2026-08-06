"""기출 문항 → 개념(eventId) 자동 매칭.

사용법:
    python3 scripts/match-concepts.py <개념 JSON> <기출 PDF 디렉터리> [출력 JSON]

    개념 JSON은 ALL_EVENTS를 다음 형태로 내보낸 것이다.
        [{ id, era, title, king, year, keywords, figures, heritage }, ...]
    PDF 디렉터리에는 `<회차>-problem.pdf` 가 들어 있다.

원칙: 확신이 서지 않으면 비워 둔다. 잘못된 연결은 없는 것보다 나쁘다.
사용자는 이 링크를 보고 "이 문항은 이 개념이구나" 하고 배우므로,
틀린 링크는 틀린 지식을 심는다. 그래서 재현율보다 정확도를 택했다.

선택지(①~⑤)는 오답 개념을 일부러 늘어놓으므로 매칭에서 제외한다.

판정 근거는 넷이다.
  ① 고유명사 신호 — 인물·문화재·키워드가 문항에 그대로 나오는가
  ② 연도 대조 — 문항의 연도가 개념의 연도와 맞는가
  ③ 시대 정합 — 문항의 시대 단서와 개념의 시대가 같은가
  ④ 복수 근거 — 단어 하나만 스친 매칭은 버린다

스캔 이미지로만 된 회차(69·73·74·78)는 텍스트 레이어가 없어 매칭할 수 없다.
"""
import glob
import json
import os
import re
import sys

import fitz

# ─── 신호에서 제외할 말 ──────────────────────────────────────────────
# 시대·국가명처럼 너무 흔해 개념을 특정하지 못하는 말
COMMON = {
    "고구려", "백제", "신라", "고려", "조선", "가야", "발해", "부여", "왕", "국왕",
    "나라", "삼국", "전쟁", "개혁", "정치", "제도", "문화", "사회", "경제", "운동",
    "사건", "시대",
}
# 일반 명사·다른 맥락과 충돌해 오탐을 만드는 말 (실제 오탐 사례에서 확인)
AMBIGUOUS = {
    "이익", "인종", "삼국사기", "삼국유사", "정부", "조약", "헌법", "의정부",
    "고종", "선조", "명종", "성종", "태종", "세조", "중종",
}
# 어느 개념에나 붙을 수 있어 키워드 조각으로는 쓸 수 없는 말
GENERIC = {
    "운동", "사건", "정치", "제도", "조약", "개혁", "전쟁", "회의", "조치", "선언",
    "위원회", "정부", "국민", "민주", "항쟁", "봉기", "사업", "계획", "체제",
    "시대", "문화", "경제", "사회", "교육", "신문", "학교", "공동", "선거", "헌법",
    "협정", "수립", "폐지", "설치", "반포", "시행", "진출", "침입", "통치", "정책",
    "지급", "개항", "수용", "반대", "요구", "확대", "강화", "건국", "멸망", "성립",
    "유네스코", "세계", "유산", "기록", "민족", "총독", "공원", "남북", "광복",
    "한양", "국가", "지역", "인물", "임시", "대표", "조직", "활동", "독립", "해방",
    "정벌", "반란", "의병", "조사", "연호", "천도", "사절", "외교", "무역",
}

# ─── 시대 단서 ──────────────────────────────────────────────────────
# 문항 텍스트에 이 말이 나오면 해당 시대의 개념만 후보로 둔다.
ERA_HINTS = [
    (r"구석기|신석기|청동기|주먹도끼|빗살무늬|고인돌|세형 ?동검|비파형 ?동검|"
     r"송국리|반달 ?돌칼|민무늬 ?토기|가락바퀴|막집|움집", {"prehistoric"}),
    (r"고조선|단군|위만|8조법|왕검성", {"gojoseon"}),
    (r"부여|옥저|동예|삼한|소도|영고|무천|서옥제|민며느리", {"proto-three"}),
    (r"광개토|장수왕|근초고|소수림|법흥왕|진흥왕|지증왕|무령왕|성왕|살수|안시성|"
     r"황산벌|계백", {"three-kingdoms"}),
    (r"금관가야|대가야|김수로|구지가|덩이쇠", {"gaya"}),
    (r"발해|대조영|해동성국|신문왕|장보고|청해진|원효|의상|후백제|궁예|견훤",
     {"north-south", "gaya"}),
    (r"고려|왕건|광종|최승로|묘청|무신|삼별초|공민왕|전시과|별무반|팔만대장경",
     {"goryeo"}),
    (r"세종|영조|정조|훈민정음|경국대전|임진왜란|병자호란|사화|붕당|탕평|실학|세도",
     {"joseon"}),
    (r"흥선대원군|강화도 ?조약|갑신정변|임오군란|동학|갑오개혁|을미|아관파천|척화비",
     {"open-port"}),
    (r"대한제국|광무|을사|독립협회|만민공동회|국채보상|의병|안중근", {"daehan-empire"}),
    (r"일제|총독부|헌병 ?경찰|3·1|만세|임시정부|의열단|신간회|창씨개명|광복군|"
     r"산미 ?증식|조선어 ?학회|한글 ?맞춤법|브나로드|물산 ?장려|형평 ?운동|"
     r"토지 ?조사 ?사업|치안유지법|내선일체|황국신민|국가총동원|소작 ?쟁의",
     {"colonial"}),
    (r"광복|미군정|6·25|이승만|박정희|유신|5·18|6월 ?민주|IMF|남북 ?정상", {"modern"}),
]

# 이 말이 나오면 시대가 확정된다.
# ERA_HINTS는 합집합이라 단서가 여럿이면 오히려 후보가 넓어진다.
# (조선어 학회 문항에 '훈민정음'이 나와 조선 시대까지 후보가 되는 식)
# 아래 단서는 다른 시대 문항에 곁다리로 등장하지 않으므로 후보를 잠가 버린다.
ERA_LOCK = [
    (r"조선어 ?학회|한글 ?맞춤법|브나로드|물산 ?장려|형평 ?운동|치안유지법|"
     r"내선일체|황국신민|국가총동원|창씨개명|산미 ?증식|토지 ?조사 ?사업|"
     r"헌병 ?경찰|조선 ?태형령|조선 ?총독부|신간회|의열단|한국광복군", {"colonial"}),
    (r"유신 ?헌법|5·18|6월 ?민주|4·19|반민특위|농지 ?개혁|새마을|경제 ?개발 ?5개년|"
     r"남북 ?정상 ?회담|7·4 ?남북|금융 ?실명제|국제 ?통화 ?기금", {"modern"}),
]

CROSS_ERA = frozenset()  # 시대를 가로지르는 문항 — 개념 하나로 좁힐 수 없다
NUMBER = re.compile(r"^(\d{1,2})\.$")
TIMELINE = re.compile(r"\(\s*가\s*\)\s*\(\s*나\s*\)\s*\(\s*다\s*\)")


def signals(c):
    """(문자열, 가중치) 목록 — 고유명사일수록 높게."""
    out = []
    for h in c["heritage"]:
        if len(h) >= 3 and h not in AMBIGUOUS:
            out.append((h, 4))
    for f in c["figures"]:
        if len(f) >= 2 and f not in COMMON and f not in AMBIGUOUS:
            out.append((f, 3))
    for k in c["keywords"]:
        if k in COMMON or k in AMBIGUOUS:
            continue
        out.append((k, 4 if len(k) >= 4 else 3 if len(k) >= 3 else 1))
        # 키워드가 여러 낱말이면 조각도 신호로 쓴다.
        # 문항은 '4·13 호헌 조치'를 '호헌 철폐'처럼 변형해 쓰기 때문이다.
        # 조각은 2점이라 혼자서는 절대 매칭을 만들지 못한다.
        if " " in k:
            for part in k.split():
                if len(part) >= 2 and part not in COMMON and part not in GENERIC:
                    out.append((part, 2))
    if c["king"] and c["king"] not in COMMON:
        for k in re.split(r"[·,()\s]+", c["king"]):
            if len(k) >= 2 and k not in COMMON and k not in AMBIGUOUS:
                out.append((k, 3))
    # 제목 토큰은 신호로 쓰지 않는다. 개념명은 문항에 그대로 나오지 않고,
    # '민주화'·'통일'처럼 일반적인 말이 엉뚱한 개념에 걸려 오탐을 만든다
    # (6월 민주 항쟁 문항이 5·18 민주화 운동으로 잡히는 식).
    return out


def stem_years(stem):
    """문항에 나오는 연도들 (3~4자리)"""
    return {int(y) for y in re.findall(r"(?<!\d)(\d{3,4})\s*년", stem)}


def stem_eras(stem):
    """문항의 시대 단서로 후보 시대 집합을 만든다. 단서가 없으면 None."""
    locked = set()
    for pat, eras in ERA_LOCK:
        if re.search(pat, stem):
            locked |= eras
    if locked:
        return locked
    hit, fired = set(), 0
    for pat, eras in ERA_HINTS:
        if re.search(pat, stem):
            hit |= eras
            fired += 1
    # 여러 시대의 단서가 골고루 나오면 특정 사건이 아니라
    # 지역사·주제사처럼 시대를 훑는 문항이다.
    if fired >= 3:
        return CROSS_ERA
    return hit or None


def strip_timeline(stem):
    """‘연표에서 옳게 고른 것은?’ 문항의 연표 부분을 잘라 낸다.

    연표에는 여러 시대의 사건이 나란히 실린다. 그대로 두면 지문이 아니라
    연표 항목에 걸려 엉뚱한 개념이 잡힌다 (묘청의 난 지문 → 쌍성총관부).
    연표는 언제나 (가)(나)(다)(라)(마)로 시작하므로 그 앞까지만 쓴다.
    """
    m = TIMELINE.search(stem)
    return stem[: m.start()] if m else stem


def blank(stem, words):
    """매칭에 쓰인 단어를 지운 문항 텍스트 (시대 단서의 독립성 확인용)"""
    for w in sorted(words, key=len, reverse=True):
        stem = stem.replace(w, " ")
    return stem


def make_matcher(concepts):
    by_id = {c["id"]: c for c in concepts}
    sig = {c["id"]: signals(c) for c in concepts}

    def match(stem, min_score=4):
        stem = strip_timeline(stem)
        years = stem_years(stem)
        eras = stem_eras(stem)
        if eras is CROSS_ERA:
            return []

        scores = {}
        for cid, sigs in sig.items():
            c = by_id[cid]
            score, hits, strongest = 0, 0, 0
            seen = set()
            for word, w in sorted(sigs, key=lambda t: -len(t[0])):
                if not word or word not in stem:
                    continue
                # 조각(2점)이 이미 잡힌 키워드의 일부라면 새 근거가 아니다.
                # ('6·25 전쟁'을 세고 다시 '6·25'를 세면 근거가 부풀려진다)
                if w <= 2 and any(word in got for got in seen):
                    continue
                if word in seen:
                    continue
                score += w
                hits += 1
                strongest = max(strongest, w)
                seen.add(word)
            if not score:
                continue

            # 조각 신호만 모인 매칭은 근거가 되지 못한다
            if strongest < 3:
                continue

            # ③ 시대 정합 — 문항의 시대 단서와 어긋나면 배제
            if eras and c["era"] not in eras:
                continue

            # 시대 단서가 매칭된 단어 자체에서 나왔다면 뒷받침이 아니다.
            # ('훈민정음' 하나로 조선이 되고 그 조선이 다시 근거가 되는 순환)
            # 단어를 지운 뒤에도 같은 시대가 나올 때만 독립 근거로 인정한다.
            indep = eras is not None and c["era"] in (
                stem_eras(blank(stem, seen)) or set()
            )

            # ② 연도 대조 — 맞으면 크게 가점, 한참 어긋나면 감점
            exact = bool(years) and any(y == c["year"] for y in years)
            if years:
                if any(abs(y - c["year"]) <= 2 for y in years):
                    score += 5
                elif all(abs(y - c["year"]) > 60 for y in years):
                    score -= 3

            # ④ 단어 신호가 하나뿐이면 대개 우연히 스친 것이다.
            #    (오답 보기·연표 항목·지나가는 언급에서도 단어는 걸린다)
            #    연도가 정확히 맞거나, 강한 고유명사에 독립적인 시대 근거가
            #    함께 있을 때만 단독 신호를 인정한다.
            if hits < 2 and not exact and not (strongest >= 4 and indep):
                continue

            scores[cid] = score

        if not scores:
            return []
        rk = sorted(scores.items(), key=lambda kv: -kv[1])
        if rk[0][1] < min_score:
            return []
        if len(rk) > 1 and rk[1][1] >= rk[0][1]:
            return []  # 1위가 갈리지 않으면 보류
        return [rk[0][0]]

    return match


# ─── PDF에서 문항 발문 뽑기 ─────────────────────────────────────────
def markers(doc, anchors=(43, 374), tol=4):
    """‘12.’ 같은 문항 번호의 위치 — 2단 조판이라 x좌표로 단을 가른다"""
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


def stems(pdf):
    """문항 번호 → 발문+자료 텍스트 (선택지 ①부터는 잘라 낸다)"""
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
        out[n] = " ".join(w[4] for w in ws).split("①")[0]
    doc.close()
    return out


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    concepts_path, pdf_dir = sys.argv[1], sys.argv[2]
    out_path = sys.argv[3] if len(sys.argv) > 3 else "matched.json"

    with open(concepts_path, encoding="utf8") as fp:
        concepts = json.load(fp)
    match = make_matcher(concepts)

    result, total, questions = {}, 0, 0
    for path in sorted(glob.glob(os.path.join(pdf_dir, "*-problem.pdf"))):
        rnd = int(os.path.basename(path).split("-")[0])
        st = stems(path)
        if not st:
            print(f"{rnd}회: 텍스트 레이어 없음 — 건너뜀")
            continue
        got = {n: match(s) for n, s in st.items()}
        hit = sum(1 for v in got.values() if v)
        result[rnd] = {n: v for n, v in got.items() if v}
        total += hit
        questions += len(st)
        print(f"{rnd}회: {hit}/{len(st)}")

    with open(out_path, "w", encoding="utf8") as fp:
        json.dump(result, fp, ensure_ascii=False, indent=1)
    print(f"\n연결 {total}/{questions} → {out_path}")


if __name__ == "__main__":
    main()
