"use client";

import type { FigEdge, FigNode, Figure, Tone } from "@/lib/types";
import { RichText } from "./ui";

/**
 * 그림 — 개념을 눈으로 보게 하는 도해.
 *
 * 글만 읽을 때보다 말과 그림을 함께 볼 때 더 오래 남는다(이중 부호화). 그림은
 * 설명 바로 옆에 두고(공간 근접), 핵심은 색으로 짚는다(신호). 장식은 넣지 않는다.
 *
 * 색은 모두 CSS 변수(--t-*)로 칠해 밝은·어두운 테마에서 같이 읽힌다.
 */
export function FigureView({ f }: { f: Figure }) {
  return (
    <figure className="fig mt-5">
      <figcaption className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-zinc-400">
        <span className="fig-dot" aria-hidden /> {f.title}
      </figcaption>
      <div className="fig-frame">
        {f.kind === "graph" && <Graph f={f} />}
        {f.kind === "grid" && <Grid f={f} />}
        {f.kind === "bars" && <Bars f={f} />}
        {f.kind === "gantt" && <Gantt f={f} />}
        {f.kind === "fields" && <Fields f={f} />}
        {f.kind === "stack" && <Stack f={f} />}
        {f.kind === "plot" && <Plot f={f} />}
      </div>
      {f.caption && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
          <RichText>{f.caption}</RichText>
        </p>
      )}
    </figure>
  );
}

export function Figures({ list }: { list?: Figure[] }) {
  if (!list || list.length === 0) return null;
  return (
    <>
      {list.map((f, i) => (
        <FigureView key={i} f={f} />
      ))}
    </>
  );
}

const tone = (t?: Tone) => `t-${t ?? "zinc"}`;

/* ── graph ─────────────────────────────────────────── */

const DW = 92;
const DH = 38;

function size(n: FigNode) {
  if (n.shape === "circle") {
    const d = n.w ?? 44;
    return { w: d, h: d };
  }
  return { w: n.w ?? DW, h: n.h ?? DH };
}

/** 가운데에서 p 쪽으로 그은 선이 상자 가장자리와 만나는 점 */
function edgePoint(n: FigNode, px: number, py: number) {
  const { w, h } = size(n);
  const dx = px - n.x;
  const dy = py - n.y;
  if (dx === 0 && dy === 0) return { x: n.x, y: n.y };
  if (n.shape === "circle") {
    const r = w / 2 + 2;
    const len = Math.hypot(dx, dy);
    return { x: n.x + (dx / len) * r, y: n.y + (dy / len) * r };
  }
  const hw = w / 2 + 2;
  const hh = h / 2 + 2;
  const s = Math.min(hw / Math.abs(dx || 1e-9), hh / Math.abs(dy || 1e-9));
  return { x: n.x + dx * s, y: n.y + dy * s };
}

function Lines({ text, x, y, size: fs, className }: { text: string; x: number; y: number; size: number; className?: string }) {
  const lines = text.split("\n");
  const lh = fs * 1.25;
  const y0 = y - ((lines.length - 1) * lh) / 2;
  return (
    <text x={x} y={y0} textAnchor="middle" dominantBaseline="central" fontSize={fs} className={className}>
      {lines.map((ln, i) => (
        <tspan key={i} x={x} y={y0 + i * lh}>
          {ln}
        </tspan>
      ))}
    </text>
  );
}

function Node({ n }: { n: FigNode }) {
  const { w, h } = size(n);
  const x = n.x - w / 2;
  const y = n.y - h / 2;
  const cls = `fig-node ${tone(n.tone)}`;
  const fs = n.shape === "text" ? 12 : 12.5;
  let shape: React.ReactNode = null;
  switch (n.shape) {
    case "text":
      break;
    case "circle":
      shape = <circle cx={n.x} cy={n.y} r={w / 2} className={cls} />;
      break;
    case "pill":
      shape = <rect x={x} y={y} width={w} height={h} rx={h / 2} className={cls} />;
      break;
    case "diamond":
      shape = (
        <polygon
          points={`${n.x},${y} ${x + w},${n.y} ${n.x},${y + h} ${x},${n.y}`}
          className={cls}
        />
      );
      break;
    case "db":
      shape = (
        <g className={cls}>
          <path d={`M${x},${y + 6} v${h - 12} a${w / 2},6 0 0 0 ${w},0 v${-(h - 12)}`} />
          <ellipse cx={n.x} cy={y + 6} rx={w / 2} ry={6} />
        </g>
      );
      break;
    case "dashed":
      shape = <rect x={x} y={y} width={w} height={h} rx={8} className={`${cls} fig-dashed`} />;
      break;
    default:
      shape = <rect x={x} y={y} width={w} height={h} rx={8} className={cls} />;
  }
  return (
    <g>
      {shape}
      <Lines text={n.label} x={n.x} y={n.y + (n.shape === "db" ? 3 : 0)} size={fs} className={n.shape === "text" ? "fig-sub" : "fig-ink"} />
    </g>
  );
}

function Edge({ e, map }: { e: FigEdge; map: Record<string, FigNode> }) {
  const a = map[e.from];
  const b = map[e.to];
  if (!a || !b) return null;
  const bend = e.bend ?? 0;
  // 휘는 선이면 조절점 쪽을 보고 가장자리를 잡는다
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const cx = mx + (-(b.y - a.y) / len) * bend;
  const cy = my + ((b.x - a.x) / len) * bend;
  const p1 = edgePoint(a, bend ? cx : b.x, bend ? cy : b.y);
  const p2 = edgePoint(b, bend ? cx : a.x, bend ? cy : a.y);
  const d = bend ? `M${p1.x},${p1.y} Q${cx},${cy} ${p2.x},${p2.y}` : `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
  // 이름표 자리: 곧은 선은 가운데, 휜 선은 곡선의 꼭대기 근처
  const lx = bend ? (p1.x + 2 * cx + p2.x) / 4 : (p1.x + p2.x) / 2;
  const ly = bend ? (p1.y + 2 * cy + p2.y) / 4 : (p1.y + p2.y) / 2;
  const t = e.tone ?? "zinc";
  return (
    <g>
      <path
        d={d}
        fill="none"
        className={`fig-edge t-${t}${e.dashed ? " fig-dashed" : ""}`}
        markerEnd={e.plain ? undefined : `url(#arr-${t})`}
        markerStart={e.both ? `url(#arr-${t})` : undefined}
      />
      {e.label && <EdgeLabel text={e.label} x={lx} y={ly} />}
    </g>
  );
}

function EdgeLabel({ text, x, y }: { text: string; x: number; y: number }) {
  const lines = text.split("\n");
  const w = Math.max(...lines.map((l) => measure(l))) * 11 + 10;
  const h = lines.length * 14 + 4;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} className="fig-label-bg" />
      <Lines text={text} x={x} y={y} size={11} className="fig-sub" />
    </g>
  );
}

/** 글자 폭 어림 — 한글·전각은 1, 라틴은 0.58 */
function measure(s: string) {
  let n = 0;
  for (const ch of s) n += /[ᄀ-ᇿ　-鿿가-힯＀-￯]/.test(ch) ? 1 : 0.58;
  return n;
}

const TONES: Tone[] = ["indigo", "emerald", "amber", "rose", "sky", "violet", "zinc"];

function Graph({ f }: { f: Extract<Figure, { kind: "graph" }> }) {
  const map = Object.fromEntries(f.nodes.map((n) => [n.id, n]));
  return (
    <svg viewBox={`0 0 ${f.w} ${f.h}`} className="fig-svg" role="img" aria-label={f.title} style={{ maxWidth: f.w * 1.35 }}>
      <defs>
        {TONES.map((t) => (
          <marker key={t} id={`arr-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className={`fig-arrow t-${t}`} />
          </marker>
        ))}
      </defs>
      {(f.edges ?? []).map((e, i) => (
        <Edge key={i} e={e} map={map} />
      ))}
      {f.nodes.map((n) => (
        <Node key={n.id} n={n} />
      ))}
    </svg>
  );
}

/* ── grid ──────────────────────────────────────────── */

function Grid({ f }: { f: Extract<Figure, { kind: "grid" }> }) {
  const mark = new Map<string, Tone>();
  for (const m of f.marks ?? []) mark.set(`${m.r},${m.c}`, m.tone ?? "indigo");
  return (
    <div className="overflow-x-auto">
      <table className={`fig-grid${f.mono ? " font-mono" : ""}`}>
        {f.cols && (
          <thead>
            <tr>
              {f.rows && <th />}
              {f.cols.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {f.cells.map((row, r) => (
            <tr key={r}>
              {f.rows && <th>{f.rows[r]}</th>}
              {row.map((cell, c) => {
                const t = mark.get(`${r},${c}`);
                return (
                  <td key={c} className={t ? `fig-mark t-${t}` : undefined}>
                    <RichText>{cell}</RichText>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── bars ──────────────────────────────────────────── */

function Bars({ f }: { f: Extract<Figure, { kind: "bars" }> }) {
  const max = Math.max(...f.items.map((i) => i.value), 1e-9);
  return (
    <div className="flex flex-col gap-1.5 p-3">
      {f.items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-[34%] shrink-0 text-right text-[12px] leading-tight text-zinc-300">
            <RichText>{it.label}</RichText>
          </span>
          <span className="relative h-5 min-w-0 flex-1">
            <span
              className={`fig-bar ${tone(it.tone ?? "indigo")}`}
              style={{ width: `${Math.max(2, (it.value / max) * 100)}%` }}
            />
          </span>
          <span className="w-[22%] shrink-0 text-[11.5px] font-semibold tabular-nums text-zinc-300">
            {it.text ?? `${it.value}${f.unit ?? ""}`}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── gantt ─────────────────────────────────────────── */

function Gantt({ f }: { f: Extract<Figure, { kind: "gantt" }> }) {
  const pct = (v: number) => `${(v / f.end) * 100}%`;
  return (
    <div className="p-3">
      {f.rows.map((row, i) => (
        <div key={i} className="mb-1.5 flex items-center gap-2">
          <span className="w-[22%] shrink-0 text-right text-[12px] font-semibold text-zinc-300">{row.label}</span>
          <span className="fig-track relative h-7 min-w-0 flex-1">
            {row.segs.map((s, j) => (
              <span
                key={j}
                className={`fig-seg ${tone(s.tone ?? "indigo")}`}
                style={{ left: pct(s.from), width: pct(s.to - s.from) }}
              >
                {s.label}
              </span>
            ))}
          </span>
        </div>
      ))}
      {f.ticks && (
        <div className="flex gap-2">
          <span className="w-[22%] shrink-0" />
          <span className="relative h-4 min-w-0 flex-1">
            {f.ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2 text-[10.5px] tabular-nums text-zinc-500" style={{ left: pct(t) }}>
                {t}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── fields (비트 배치·레코드 형식) ──────────────────── */

function Fields({ f }: { f: Extract<Figure, { kind: "fields" }> }) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {f.rows.map((row, i) => (
        <div key={i}>
          {row.label && <p className="mb-1 text-[11.5px] font-semibold text-zinc-400">{row.label}</p>}
          <div className="flex overflow-hidden rounded-lg">
            {row.fields.map((fl, j) => (
              <div key={j} className={`fig-field ${tone(fl.tone)}`} style={{ flexGrow: fl.span, flexBasis: 0 }}>
                <span className="block font-mono text-[12.5px] font-bold leading-tight">{fl.text}</span>
                {fl.sub && <span className="mt-0.5 block text-[10.5px] leading-tight opacity-80">{fl.sub}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── stack (계층·피라미드) ─────────────────────────── */

function Stack({ f }: { f: Extract<Figure, { kind: "stack" }> }) {
  const n = f.layers.length;
  return (
    <div className="flex flex-col items-center gap-1 p-3">
      {f.top && <p className="text-[11.5px] font-semibold text-zinc-400">▲ {f.top}</p>}
      {f.layers.map((l, i) => {
        const w = f.shape === "pyramid" ? 38 + (62 * (i + 1)) / n : 100;
        return (
          <div key={i} className={`fig-layer ${tone(l.tone ?? "indigo")}`} style={{ width: `${w}%` }}>
            <span className="block text-[13px] font-bold leading-snug">
              <RichText>{l.label}</RichText>
            </span>
            {l.note && (
              <span className="mt-0.5 block text-[11.5px] leading-snug opacity-85">
                <RichText>{l.note}</RichText>
              </span>
            )}
          </div>
        );
      })}
      {f.bottom && <p className="text-[11.5px] font-semibold text-zinc-400">▼ {f.bottom}</p>}
    </div>
  );
}

/* ── plot (곡선·산점도) ─────────────────────────────── */

function Plot({ f }: { f: Extract<Figure, { kind: "plot" }> }) {
  const W = 340;
  const H = f.h ?? 200;
  const L = 36;
  const R = 12;
  const T = 12;
  const B = 30;
  const [x0, x1] = f.xr;
  const [y0, y1] = f.yr;
  const sx = (v: number) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
  const sy = (v: number) => H - B - ((v - y0) / (y1 - y0)) * (H - T - B);
  const legend = f.series.filter((s) => s.label);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="fig-svg" role="img" aria-label={f.title} style={{ maxWidth: W * 1.35 }}>
        {/* 눈금선 */}
        {(f.yticks ?? []).map((t) => (
          <g key={`y${t}`}>
            <line x1={L} x2={W - R} y1={sy(t)} y2={sy(t)} className="fig-gridline" />
            <text x={L - 5} y={sy(t)} textAnchor="end" dominantBaseline="central" fontSize={10} className="fig-sub">
              {t}
            </text>
          </g>
        ))}
        {(f.xticks ?? []).map((t) => (
          <text key={`x${t}`} x={sx(t)} y={H - B + 12} textAnchor="middle" fontSize={10} className="fig-sub">
            {t}
          </text>
        ))}
        {/* 축 */}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} className="fig-axis" />
        <line x1={L} x2={L} y1={T} y2={H - B} className="fig-axis" />
        {f.x && (
          <text x={W - R} y={H - 4} textAnchor="end" fontSize={11} className="fig-sub">
            {f.x}
          </text>
        )}
        {f.y && (
          <text x={L + 4} y={T + 2} textAnchor="start" dominantBaseline="hanging" fontSize={11} className="fig-sub">
            {f.y}
          </text>
        )}
        {(f.vlines ?? []).map((v, i) => (
          <g key={`v${i}`}>
            <line x1={sx(v.x)} x2={sx(v.x)} y1={T} y2={H - B} className={`fig-edge fig-dashed t-${v.tone ?? "zinc"}`} />
            {v.label && (
              <text x={sx(v.x) + 4} y={T + 14} fontSize={10.5} className="fig-sub">
                {v.label}
              </text>
            )}
          </g>
        ))}
        {f.series.map((s, i) => {
          const t = s.tone ?? "indigo";
          const showLine = s.dots ? !!s.line : true;
          const d = s.pts.map(([x, y], j) => `${j ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ");
          return (
            <g key={i}>
              {showLine && <path d={d} fill="none" className={`fig-edge fig-curve t-${t}${s.dashed ? " fig-dashed" : ""}`} />}
              {s.dots &&
                s.pts.map(([x, y], j) => <circle key={j} cx={sx(x)} cy={sy(y)} r={4.2} className={`fig-node t-${t}`} />)}
            </g>
          );
        })}
        {(f.notes ?? []).map((n, i) => (
          <text
            key={`n${i}`}
            x={sx(n.x)}
            y={sy(n.y)}
            textAnchor={n.anchor ?? "middle"}
            dominantBaseline="central"
            fontSize={11}
            className={n.tone ? `fig-note t-${n.tone}` : "fig-sub"}
          >
            {n.text}
          </text>
        ))}
      </svg>
      {legend.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 pb-2.5 text-[11.5px] text-zinc-300">
          {legend.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className={`fig-swatch t-${s.tone ?? "indigo"}${s.dashed ? " dashed" : ""}`} /> {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
