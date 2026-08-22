import type { ReactNode } from "react";

/**
 * Part 1 그림.
 *
 * ── 왜 그림을 그렸는가 ────────────────────────────────────────
 * Part 1 은 사진을 보고 푸는 문제인데, 그동안 사진 대신 장면을 한국어로
 * 적어 두었다. 그런데 그것은 다른 시험이 된다 — 한국어 문단을 읽고
 * 영어 문장을 고르는 일이지, 그림을 훑어 동사와 태를 가려내는 일이
 * 아니다. 실제로 이 파트에서 사람이 하는 일은 "무엇이 있나" 가 아니라
 * "누가 무엇을 하고 있나, 그리고 하고 있지 않나" 를 눈으로 확인하는
 * 것이다.
 *
 * ── 왜 사진이 아니라 그림인가 ─────────────────────────────────
 * 남의 사진을 가져다 쓰면 저작권이 걸린다. 자유 이용 사진이라도 문제가
 * 남는다 — 문항이 장면의 세부에 걸려 있기 때문이다. "선반에 서류철이
 * 꽂혀 있다", "파라솔이 접혀 있다", "뒤쪽 소파에는 아무도 없다" 가
 * 오답 선지의 근거인데, 대충 비슷한 사진을 가져오면 근거가 사라지거나
 * 없는 것이 생겨 문제가 틀린 문제가 된다.
 *
 * 그려 넣으면 그림과 문항이 정확히 맞는다. 파일도 몇 KB뿐이고 오프라인
 * 에서도 그대로 뜬다. 사진만큼 진짜 같지는 않지만, 이 파트가 훈련하는
 * 것 — 있는 물건 이름에 낚이지 말고 동작과 태를 보는 것 — 은 그대로
 * 살아 있다.
 *
 * ── 그리는 규칙 ───────────────────────────────────────────────
 * 시험지의 사진처럼 늘 밝은 바탕에 얹는다. 어두운 테마에서도 바꾸지
 * 않는다 — 실제 시험지가 흰 종이이기 때문이고, 그림 안의 명암이 뒤집히면
 * 무엇이 무엇인지 알아보기 어려워진다.
 */

const P = {
  bg: "#eaeef4",
  sky: "#cfe0f3",
  wall: "#dfe5ee",
  floor: "#cdd4de",
  ground: "#d7d2c4",
  wood: "#c49a68",
  woodDark: "#a17a4c",
  metal: "#b4bec9",
  metalDark: "#8b96a3",
  dark: "#39404d",
  line: "#5b6472",
  white: "#fbfcfe",
  paper: "#f3efe4",
  skin: "#e5b088",
  skin2: "#c98d63",
  navy: "#4a6fa5",
  green: "#6f9a76",
  rust: "#c16f56",
  plum: "#8a6b9e",
  gold: "#dcb04a",
  leaf: "#7fa66f",
  leafDark: "#5f8452",
  red: "#c05a4e",
};

/** 시험지의 사진 자리 — 늘 밝은 바탕 */
function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 360 240"
      className="block h-auto w-full"
      role="presentation"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="360" height="240" fill={P.bg} />
      {children}
    </svg>
  );
}

/** 사람 — 머리·몸통·팔다리만. 알아보이면 충분하다. */
function Head({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={P.skin} />
      <path
        d={`M ${x - r} ${y - r * 0.3} A ${r} ${r} 0 0 1 ${x + r} ${y - r * 0.3} L ${x + r} ${y - r * 0.55} A ${r} ${r} 0 0 0 ${x - r} ${y - r * 0.55} Z`}
        fill={P.dark}
      />
    </>
  );
}

function Limb({
  x1, y1, x2, y2, c = P.skin, w = 5,
}: { x1: number; y1: number; x2: number; y2: number; c?: string; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" />;
}

function Torso({
  x, y, w = 22, h = 34, c = P.navy, rx = 7,
}: { x: number; y: number; w?: number; h?: number; c?: string; rx?: number }) {
  return <rect x={x - w / 2} y={y} width={w} height={h} rx={rx} fill={c} />;
}

function Box({
  x, y, w, h, c = P.wood, d = P.woodDark,
}: { x: number; y: number; w: number; h: number; c?: string; d?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={2} fill={c} />
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={d} strokeWidth={1.5} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={d} strokeWidth={1.5} />
    </>
  );
}

/** 의자 — 옆에서 본 모습 */
function Chair({ x, y, s = 1, c = P.woodDark }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-1} y={-26} width={4} height={28} rx={1.5} fill={c} />
      <rect x={-1} y={-2} width={20} height={4} rx={1.5} fill={c} />
      <rect x={0} y={2} width={3} height={14} rx={1} fill={c} />
      <rect x={16} y={2} width={3} height={14} rx={1} fill={c} />
    </g>
  );
}

export const PART1_ART: Record<string, ReactNode> = {
  /* ── 사무실: 여자가 앉아 노트북 화면을 보고 있다 ── */
  "l1-office-desk": (
    <Frame>
      <rect y="0" width="360" height="176" fill={P.wall} />
      <rect y="176" width="360" height="64" fill={P.floor} />
      {/* 뒤쪽 선반 — 서류철이 가지런히 */}
      <rect x="232" y="46" width="104" height="76" rx="3" fill={P.woodDark} />
      <rect x="236" y="50" width="96" height="30" fill={P.wall} />
      <rect x="236" y="86" width="96" height="32" fill={P.wall} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={`a${i}`} x={240 + i * 15} y={53} width={11} height={24} rx={1.5}
          fill={[P.rust, P.navy, P.green, P.gold, P.plum, P.rust][i]} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={`b${i}`} x={240 + i * 15} y={89} width={11} height={26} rx={1.5}
          fill={[P.navy, P.green, P.rust, P.plum, P.navy, P.gold][i]} />
      ))}
      {/* 책상 */}
      <rect x="40" y="150" width="190" height="8" rx="2" fill={P.wood} />
      <rect x="52" y="158" width="7" height="42" fill={P.woodDark} />
      <rect x="212" y="158" width="7" height="42" fill={P.woodDark} />
      {/* 노트북 */}
      <path d="M132 150 L140 116 L188 116 L192 150 Z" fill={P.metalDark} />
      <path d="M143 120 L185 120 L188 146 L139 146 Z" fill="#2b3442" />
      <rect x="128" y="148" width="70" height="5" rx="2" fill={P.metal} />
      {/* 서류 몇 장과 머그컵 */}
      <rect x="198" y="143" width="30" height="7" rx="1" fill={P.paper} transform="rotate(-5 213 146)" />
      <rect x="200" y="137" width="28" height="7" rx="1" fill={P.white} transform="rotate(4 214 140)" />
      {/* 머그컵 — 오답 선지가 이것을 가리키므로 사람 뒤에 숨으면 안 된다 */}
      <rect x="60" y="132" width="15" height="18" rx="2" fill={P.rust} />
      <path d="M75 137 q7 4 0 8" stroke={P.rust} strokeWidth="3" fill="none" />
      <ellipse cx="67.5" cy="132" rx="7.5" ry="2.5" fill="#8f4a37" />
      {/* 앉아 있는 여자 — 화면 쪽을 보고 있다 */}
      <Chair x={86} y={196} s={1.15} c={P.metalDark} />
      <Torso x={104} y={126} w={26} h={40} c={P.plum} />
      <Head x={104} y={112} r={10} />
      <Limb x1={112} y1={136} x2={132} y2={148} />
      <Limb x1={98} y1={138} x2={96} y2={160} c={P.plum} w={9} />
      <Limb x1={104} y1={166} x2={120} y2={176} c={P.dark} w={9} />
      <Limb x1={120} y1={176} x2={122} y2={198} c={P.dark} w={8} />
    </Frame>
  ),

  /* ── 노천 카페: 의자는 놓여 있고 사람은 없다. 파라솔은 접혀 있다 ── */
  "l1-street-cafe": (
    <Frame>
      <rect y="0" width="360" height="150" fill={P.sky} />
      <rect y="150" width="360" height="90" fill={P.ground} />
      {/* 건물 */}
      <rect x="0" y="24" width="120" height="126" fill={P.wall} />
      <rect x="16" y="52" width="30" height="40" fill={P.metal} />
      <rect x="66" y="52" width="30" height="40" fill={P.metal} />
      <rect x="34" y="106" width="44" height="44" fill={P.woodDark} />
      {[0, 1, 2].map((i) => {
        const x = 132 + i * 76;
        return (
          <g key={i}>
            {/* 접힌 파라솔 */}
            <path d={`M ${x + 26} 60 l 7 0 l -3.5 -22 Z`} fill={P.green} />
            <rect x={x + 28} y={60} width={3} height={70} fill={P.metalDark} />
            {/* 탁자 */}
            <ellipse cx={x + 29} cy={130} rx={30} ry={7} fill={P.white} />
            <rect x={x + 26} y={130} width={6} height={30} fill={P.metalDark} />
            <ellipse cx={x + 29} cy={160} rx={13} ry={4} fill={P.metalDark} />
            {/* 의자 둘 — 비어 있다 */}
            <Chair x={x - 2} y={162} s={0.9} c={P.metal} />
            <g transform={`translate(${x + 74} 162) scale(-0.9 0.9)`}>
              <Chair x={0} y={0} s={1} c={P.metal} />
            </g>
          </g>
        );
      })}
    </Frame>
  ),

  /* ── 창고: 남자 둘이 상자를 손수레에 싣고 있다 ── */
  "l1-warehouse": (
    <Frame>
      <rect y="0" width="360" height="180" fill={P.wall} />
      <rect y="180" width="360" height="60" fill={P.floor} />
      {/* 쌓인 상자 */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <Box key={`${r}${c}`} x={16 + c * 34} y={92 + r * 30} w={32} h={28} />
        )),
      )}
      {/* 지게차 */}
      <rect x="278" y="120" width="54" height="34" rx="4" fill={P.gold} />
      <rect x="286" y="96" width="30" height="26" rx="3" fill={P.metalDark} />
      <rect x="266" y="86" width="6" height="76" fill={P.metalDark} />
      <rect x="252" y="152" width="24" height="5" fill={P.metalDark} />
      <circle cx="292" cy="160" r="11" fill={P.dark} />
      <circle cx="324" cy="160" r="9" fill={P.dark} />
      {/* 손수레 */}
      <rect x="150" y="150" width="66" height="7" rx="2" fill={P.metalDark} />
      <rect x="212" y="112" width="6" height="44" fill={P.metalDark} />
      <circle cx="162" cy="164" r="8" fill={P.dark} />
      <circle cx="206" cy="164" r="8" fill={P.dark} />
      <Box x={158} y={128} w={34} h={22} c={P.paper} d={P.metal} />
      {/* 두 남자가 상자를 들어 올린다 */}
      <Box x={118} y={112} w={30} h={24} />
      <Torso x={104} y={116} w={22} h={34} c={P.navy} />
      <Head x={104} y={104} r={9} />
      <Limb x1={112} y1={122} x2={122} y2={120} />
      <Limb x1={104} y1={150} x2={100} y2={176} c={P.dark} w={8} />
      <Limb x1={104} y1={150} x2={112} y2={176} c={P.dark} w={8} />
      <Torso x={162} y={116} w={22} h={34} c={P.green} />
      <Head x={162} y={104} r={9} />
      <Limb x1={154} y1={122} x2={146} y2={120} />
      <Limb x1={162} y1={150} x2={158} y2={176} c={P.dark} w={8} />
      <Limb x1={162} y1={150} x2={170} y2={176} c={P.dark} w={8} />
    </Frame>
  ),

  /* ── 주방: 남자가 도마에서 채소를 썰고 있다 ── */
  "l1-kitchen-prep": (
    <Frame>
      <rect y="0" width="360" height="164" fill={P.wall} />
      <rect y="164" width="360" height="76" fill={P.floor} />
      {/* 벽에 걸린 국자와 프라이팬 */}
      <rect x="34" y="30" width="150" height="4" rx="2" fill={P.metalDark} />
      <circle cx="60" cy="58" r="16" fill={P.metalDark} />
      <rect x="58" y="34" width="4" height="12" fill={P.metalDark} />
      <path d="M104 34 v20 a9 9 0 0 0 18 0" stroke={P.metal} strokeWidth="4" fill="none" />
      <path d="M150 34 v16" stroke={P.metal} strokeWidth="4" />
      <ellipse cx="150" cy="56" rx="9" ry="7" fill={P.metal} />
      {/* 조리대 */}
      <rect x="20" y="148" width="320" height="10" rx="2" fill={P.metal} />
      <rect x="20" y="158" width="320" height="44" fill={P.metalDark} />
      {/* 화구 위 냄비 */}
      <rect x="250" y="140" width="52" height="8" rx="2" fill={P.dark} />
      <rect x="258" y="118" width="36" height="24" rx="3" fill={P.metal} />
      <rect x="254" y="114" width="44" height="5" rx="2" fill={P.metalDark} />
      {/* 도마와 채소 */}
      <rect x="96" y="140" width="76" height="9" rx="2" fill={P.wood} />
      <circle cx="112" cy="136" r="5" fill={P.leaf} />
      <circle cx="124" cy="136" r="5" fill={P.rust} />
      <circle cx="136" cy="136" r="5" fill={P.leafDark} />
      {/* 칼 — 썰고 있다는 것이 정답의 근거라 또렷해야 한다 */}
      <g transform="rotate(-28 150 132)">
        <rect x="132" y="129" width="30" height="6" rx="1" fill="#e3e8ee" stroke={P.metalDark} strokeWidth="1" />
        <rect x="160" y="128" width="12" height="8" rx="2" fill={P.dark} />
      </g>
      {/* 남자 — 썰고 있다 */}
      <Torso x={140} y={92} w={26} h={40} c={P.white} />
      <Head x={140} y={78} r={10} />
      <rect x="130" y="66" width="20" height="7" rx="3" fill={P.white} />
      <Limb x1={150} y1={102} x2={160} y2={126} />
      <Limb x1={130} y1={102} x2={118} y2={124} />
    </Frame>
  ),

  /* ── 도서관: 사람은 없다. 수레에 책이 쌓여 있다 ── */
  "l1-library-shelves": (
    <Frame>
      <rect y="0" width="360" height="182" fill={P.wall} />
      <rect y="182" width="360" height="58" fill={P.floor} />
      {[0, 1].map((s) => {
        const x = s === 0 ? 8 : 244;
        return (
          <g key={s}>
            <rect x={x} y="26" width="108" height="156" rx="3" fill={P.woodDark} />
            {[0, 1, 2, 3].map((r) => (
              <g key={r}>
                <rect x={x + 5} y={31 + r * 38} width={98} height={32} fill="#e7e2d6" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <rect key={i} x={x + 8 + i * 12} y={34 + r * 38} width={9} height={26} rx={1}
                    fill={[P.rust, P.navy, P.green, P.gold, P.plum, P.rust, P.navy, P.leafDark][(i + r) % 8]} />
                ))}
              </g>
            ))}
          </g>
        );
      })}
      {/* 가운데 통로의 책 수레 */}
      <rect x="146" y="150" width="72" height="8" rx="2" fill={P.metalDark} />
      <rect x="150" y="158" width="6" height="24" fill={P.metalDark} />
      <rect x="208" y="158" width="6" height="24" fill={P.metalDark} />
      <circle cx="156" cy="188" r="7" fill={P.dark} />
      <circle cx="208" cy="188" r="7" fill={P.dark} />
      {/* 쌓인 책 */}
      <rect x="156" y="140" width="48" height="10" rx="2" fill={P.navy} />
      <rect x="160" y="130" width="44" height="10" rx="2" fill={P.rust} />
      <rect x="163" y="120" width="38" height="10" rx="2" fill={P.green} />
    </Frame>
  ),

  /* ── 공사 현장: 안전모 쓴 둘이 도면을 함께 본다 ── */
  "l1-construction-site": (
    <Frame>
      <rect y="0" width="360" height="168" fill={P.sky} />
      <rect y="168" width="360" height="72" fill={P.ground} />
      {/* 크레인 */}
      <rect x="292" y="30" width="8" height="138" fill={P.gold} />
      <rect x="228" y="30" width="104" height="7" fill={P.gold} />
      <line x1="248" y1="37" x2="248" y2="78" stroke={P.metalDark} strokeWidth="2.5" />
      <rect x="240" y="78" width="17" height="14" rx="2" fill={P.metalDark} />
      {/* 비계 */}
      <g stroke={P.metalDark} strokeWidth="4">
        {[0, 1, 2, 3].map((i) => <line key={i} x1={40 + i * 34} y1="60" x2={40 + i * 34} y2="168" />)}
        {[0, 1, 2].map((i) => <line key={i} x1="40" y1={72 + i * 34} x2="142" y2={72 + i * 34} />)}
      </g>
      {/* 도면을 함께 들여다보는 두 사람 */}
      <rect x="176" y="118" width="52" height="34" rx="2" fill={P.white} transform="rotate(-6 202 135)" />
      <g stroke={P.navy} strokeWidth="1.5" opacity="0.7">
        <line x1="184" y1="128" x2="220" y2="126" />
        <line x1="184" y1="136" x2="212" y2="134" />
        <line x1="184" y1="144" x2="218" y2="142" />
      </g>
      <Torso x={162} y={116} w={24} h={38} c={P.gold} />
      <Head x={162} y={102} r={9.5} />
      <path d="M150 100 a12 10 0 0 1 24 0 z" fill={P.rust} />
      <rect x="148" y="99" width="28" height="4" rx="2" fill={P.rust} />
      <Limb x1={172} y1={124} x2={186} y2={132} />
      <Limb x1={162} y1={154} x2={158} y2={182} c={P.dark} w={8} />
      <Limb x1={162} y1={154} x2={170} y2={182} c={P.dark} w={8} />
      <Torso x={244} y={116} w={24} h={38} c={P.navy} />
      <Head x={244} y={102} r={9.5} />
      <path d="M232 100 a12 10 0 0 1 24 0 z" fill={P.gold} />
      <rect x="230" y="99" width="28" height="4" rx="2" fill={P.gold} />
      <Limb x1={234} y1={124} x2={220} y2={132} />
      <Limb x1={244} y1={154} x2={240} y2={182} c={P.dark} w={8} />
      <Limb x1={244} y1={154} x2={252} y2={182} c={P.dark} w={8} />
    </Frame>
  ),

  /* ── 승강장: 사람들이 노란 선 뒤에서 기다린다. 열차는 없다 ── */
  "l1-train-platform": (
    <Frame>
      <rect y="0" width="360" height="150" fill="#c3cad4" />
      <rect y="150" width="360" height="90" fill={P.floor} />
      {/* 선로 — 비어 있다 */}
      <rect y="196" width="360" height="44" fill="#9aa3ae" />
      <rect y="196" width="360" height="4" fill={P.gold} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 46} y="212" width="34" height="6" rx="1" fill="#7d8590" />
      ))}
      <rect y="222" width="360" height="4" fill={P.metalDark} />
      {/* 전광판 — 켜져 있다 */}
      <rect x="112" y="18" width="136" height="40" rx="4" fill={P.dark} />
      <rect x="120" y="26" width="60" height="7" rx="2" fill={P.gold} />
      <rect x="120" y="38" width="88" height="7" rx="2" fill={P.gold} />
      <rect x="176" y="58" width="8" height="18" fill={P.metalDark} />
      {/* 기다리는 사람 셋 */}
      {[
        { x: 76, c: P.navy },
        { x: 168, c: P.rust },
        { x: 262, c: P.green },
      ].map((p, i) => (
        <g key={i}>
          <Torso x={p.x} y={116} w={23} h={38} c={p.c} />
          <Head x={p.x} y={102} r={9.5} />
          <Limb x1={p.x - 10} y1={124} x2={p.x - 13} y2={148} c={p.c} w={8} />
          <Limb x1={p.x + 10} y1={124} x2={p.x + 13} y2={148} c={p.c} w={8} />
          <Limb x1={p.x} y1={154} x2={p.x - 5} y2={186} c={P.dark} w={8} />
          <Limb x1={p.x} y1={154} x2={p.x + 6} y2={186} c={P.dark} w={8} />
        </g>
      ))}
    </Frame>
  ),

  /* ── 회의실: 사람은 없다. 물잔과 메모지가 놓여 있다 ── */
  "l1-meeting-room-empty": (
    <Frame>
      <rect y="0" width="360" height="176" fill={P.wall} />
      <rect y="176" width="360" height="64" fill={P.floor} />
      {/* 내려와 있는 화면 */}
      <rect x="104" y="14" width="152" height="8" rx="2" fill={P.metalDark} />
      <rect x="110" y="22" width="140" height="76" fill="#f7f8fa" stroke={P.metal} strokeWidth="2" />
      {/* 긴 탁자 */}
      <ellipse cx="180" cy="164" rx="140" ry="28" fill={P.wood} />
      <ellipse cx="180" cy="160" rx="140" ry="28" fill="#d8b183" />
      {/* 물잔과 메모지 */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 84 + i * 48;
        return (
          <g key={i}>
            <rect x={x - 14} y={150} width={22} height={12} rx={1.5} fill={P.white} />
            <rect x={x + 12} y={144} width={10} height={16} rx={2} fill="#dff0fb" stroke={P.metal} strokeWidth="1" />
          </g>
        );
      })}
      {/* 둘러놓은 의자 — 모두 비어 있다 */}
      {[0, 1, 2, 3].map((i) => (
        <g key={`f${i}`}>
          <rect x={64 + i * 62} y={186} width={38} height={8} rx={3} fill={P.metalDark} />
          <rect x={70 + i * 62} y={194} width={5} height={16} fill={P.metalDark} />
          <rect x={92 + i * 62} y={194} width={5} height={16} fill={P.metalDark} />
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`b${i}`} x={62 + i * 62} y={104} width={38} height={34} rx={5} fill={P.metal} />
      ))}
    </Frame>
  ),

  /* ── 노천 시장: 여자가 과일을 고른다. 상인은 저울 옆에 ── */
  "l1-outdoor-market": (
    <Frame>
      <rect y="0" width="360" height="150" fill={P.sky} />
      <rect y="150" width="360" height="90" fill={P.ground} />
      {/* 차양 */}
      <path d="M26 44 L334 44 L316 68 L44 68 Z" fill={P.rust} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={40 + i * 48} y={44} width={24} height={24} fill={P.white} opacity="0.55" />
      ))}
      <rect x="30" y="44" width="5" height="118" fill={P.woodDark} />
      <rect x="326" y="44" width="5" height="118" fill={P.woodDark} />
      {/* 좌판 */}
      <rect x="52" y="146" width="256" height="10" rx="2" fill={P.wood} />
      <rect x="52" y="156" width="256" height="30" fill={P.woodDark} />
      {/* 종류별 과일 상자 */}
      {[
        { x: 64, c: P.red },
        { x: 128, c: P.gold },
        { x: 192, c: P.leaf },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={128} width={54} height={18} rx={2} fill={P.woodDark} />
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={b.x + 10 + k * 12} cy={126} r={7} fill={b.c} />
          ))}
        </g>
      ))}
      {/* 저울 */}
      <rect x="266" y="132" width="30" height="14" rx="2" fill={P.metal} />
      <rect x="276" y="120" width="10" height="12" fill={P.metalDark} />
      <circle cx="281" cy="116" r="8" fill={P.white} stroke={P.metalDark} strokeWidth="2" />
      {/* 고르는 여자 — 손을 과일 쪽으로 */}
      <Torso x={100} y={106} w={25} h={38} c={P.plum} />
      <Head x={100} y={92} r={9.5} />
      <Limb x1={110} y1={114} x2={128} y2={126} />
      {/* 저울 옆의 상인 */}
      <Torso x={300} y={104} w={24} h={38} c={P.green} />
      <Head x={300} y={90} r={9.5} />
      <Limb x1={290} y1={112} x2={286} y2={132} c={P.green} w={8} />
    </Frame>
  ),

  /* ── 호텔 로비: 여자가 프런트에서 직원과 이야기. 소파는 비었다 ── */
  "l1-hotel-lobby": (
    <Frame>
      <rect y="0" width="360" height="180" fill={P.wall} />
      <rect y="180" width="360" height="60" fill={P.floor} />
      {/* 뒤쪽 벽과 빈 소파 */}
      <rect x="18" y="120" width="104" height="30" rx="6" fill={P.plum} />
      <rect x="18" y="96" width="104" height="28" rx="8" fill="#9b7bb0" />
      <rect x="22" y="150" width="8" height="16" fill={P.woodDark} />
      <rect x="110" y="150" width="8" height="16" fill={P.woodDark} />
      {/* 프런트 */}
      <rect x="188" y="126" width="150" height="12" rx="3" fill={P.wood} />
      <rect x="196" y="138" width="134" height="52" fill={P.woodDark} />
      {/* 직원 — 프런트 뒤 */}
      <Torso x={286} y={92} w={24} h={36} c={P.white} />
      <Head x={286} y={78} r={9.5} />
      <Limb x1={276} y1={100} x2={266} y2={120} c={P.white} w={8} />
      {/* 손님 — 프런트 앞에서 이야기 중 */}
      <Torso x={206} y={98} w={25} h={38} c={P.rust} />
      <Head x={206} y={84} r={9.5} />
      <Limb x1={216} y1={106} x2={230} y2={120} />
      <Limb x1={206} y1={136} x2={202} y2={172} c={P.dark} w={9} />
      <Limb x1={206} y1={136} x2={214} y2={172} c={P.dark} w={9} />
      {/* 옆에 세워 둔 여행 가방 */}
      <rect x="152" y="132" width="34" height="46" rx="4" fill={P.navy} />
      <rect x="164" y="112" width="6" height="22" fill={P.metalDark} />
      <rect x="158" y="108" width="18" height="5" rx="2" fill={P.metalDark} />
      <circle cx="160" cy="180" r="4" fill={P.dark} />
      <circle cx="180" cy="180" r="4" fill={P.dark} />
    </Frame>
  ),

  /* ── 공원: 벤치 둘이 마주 놓이고, 하나에 남자가 앉아 책을 읽는다 ── */
  "l1-park-bench": (
    <Frame>
      <rect y="0" width="360" height="158" fill={P.sky} />
      <rect y="158" width="360" height="82" fill="#b9cf9f" />
      {/* 나무 */}
      <rect x="60" y="92" width="16" height="76" fill={P.woodDark} />
      <circle cx="68" cy="70" r="44" fill={P.leaf} />
      <circle cx="38" cy="86" r="28" fill={P.leafDark} />
      <circle cx="98" cy="84" r="30" fill={P.leafDark} />
      {/* 앞쪽 벤치 — 남자가 앉아 책을 읽는다 */}
      <rect x="150" y="166" width="96" height="8" rx="2" fill={P.wood} />
      <rect x="150" y="140" width="96" height="7" rx="2" fill={P.wood} />
      <rect x="152" y="174" width="6" height="22" fill={P.woodDark} />
      <rect x="238" y="174" width="6" height="22" fill={P.woodDark} />
      <Torso x={196} y={124} w={26} h={40} c={P.navy} />
      <Head x={196} y={110} r={9.5} />
      <Limb x1={206} y1={134} x2={216} y2={146} />
      <Limb x1={186} y1={134} x2={178} y2={146} />
      <path d="M172 146 l24 -6 l24 6 l-24 8 Z" fill={P.white} stroke={P.metal} strokeWidth="1.5" />
      <Limb x1={196} y1={164} x2={214} y2={172} c={P.dark} w={9} />
      <Limb x1={214} y1={172} x2={216} y2={192} c={P.dark} w={8} />
      {/* 마주 놓인 빈 벤치 */}
      <rect x="264" y="150" width="76" height="7" rx="2" fill={P.wood} />
      <rect x="264" y="130" width="76" height="6" rx="2" fill={P.wood} />
      <rect x="266" y="157" width="5" height="18" fill={P.woodDark} />
      <rect x="332" y="157" width="5" height="18" fill={P.woodDark} />
      {/* 세워 둔 자전거 */}
      <circle cx="92" cy="184" r="18" fill="none" stroke={P.dark} strokeWidth="3.5" />
      <circle cx="140" cy="184" r="18" fill="none" stroke={P.dark} strokeWidth="3.5" />
      <path d="M92 184 L114 162 L140 184 M114 162 L124 184" stroke={P.rust} strokeWidth="3.5" fill="none" />
      <path d="M108 158 l14 0" stroke={P.dark} strokeWidth="3" />
    </Frame>
  ),

  /* ── 공장: 여자가 컨베이어 옆에서 지나가는 제품을 살핀다 ── */
  "l1-factory-line": (
    <Frame>
      <rect y="0" width="360" height="176" fill={P.wall} />
      <rect y="176" width="360" height="64" fill={P.floor} />
      {/* 벽에 붙은 안전 수칙 */}
      <rect x="238" y="26" width="88" height="60" rx="3" fill={P.white} stroke={P.metal} strokeWidth="2" />
      <path d="M282 36 l14 24 h-28 z" fill={P.gold} stroke={P.dark} strokeWidth="2" />
      <rect x="280" y="46" width="4" height="8" fill={P.dark} />
      <rect x="250" y="68" width="64" height="4" rx="2" fill={P.metal} />
      <rect x="250" y="76" width="46" height="4" rx="2" fill={P.metal} />
      {/* 컨베이어 벨트 */}
      <rect x="0" y="146" width="360" height="16" fill={P.metalDark} />
      <rect x="0" y="140" width="360" height="8" fill={P.metal} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx={22 + i * 52} cy={154} r={6} fill={P.dark} />
      ))}
      <rect x="30" y="162" width="8" height="30" fill={P.metalDark} />
      <rect x="298" y="162" width="8" height="30" fill={P.metalDark} />
      {/* 줄지어 흘러가는 포장 상자 */}
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} x={18 + i * 76} y={114} w={44} h={26} c={P.paper} d={P.metal} />
      ))}
      {/* 여자 — 작업복, 살펴보는 자세 */}
      <Torso x={196} y={78} w={26} h={42} c="#7f9bbd" />
      <Head x={196} y={64} r={10} />
      <rect x="185" y="52" width="22" height="6" rx="3" fill={P.gold} />
      <Limb x1={206} y1={88} x2={218} y2={112} c="#7f9bbd" w={8} />
      <Limb x1={186} y1={88} x2={176} y2={112} c="#7f9bbd" w={8} />
      <Limb x1={196} y1={120} x2={190} y2={150} c={P.dark} w={9} />
      <Limb x1={196} y1={120} x2={204} y2={150} c={P.dark} w={9} />
    </Frame>
  ),
};
