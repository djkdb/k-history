"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronRight } from "lucide-react";
import { SUBJECT_MAP, subjectInk } from "@/data/exam";
import type { SubjectId } from "@/lib/types";
import {
  cn,
  importanceBg,
  importanceLabel,
  importanceStars,
  paragraphs,
} from "@/lib/utils";

export function Card({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-4",
        onClick && "cursor-pointer transition-transform active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  onClick,
  children,
  type = "button",
  // 아이콘만 있는 단추는 이름이 없다. 그동안 aria-label 을 넘겨도
  // 여기서 받지 않아 조용히 버려지고 있었다 — 화면 낭독기에는 그냥
  // "단추" 라고만 읽혔다.
  "aria-label": ariaLabel,
}: {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit";
  "aria-label"?: string;
}) {
  const variants = {
    primary:
      // Tailwind v4 가 색을 oklch 로 바꾸면서 indigo-500 이 한 단계 밝아졌다.
      // 그 위의 흰 글자는 4.0:1 로 AA(4.5:1)에 못 미친다 — 화면에서 픽셀로 잰 값이다.
      // 가장 자주 누르는 단추라 여기서 흐리면 앱 전체가 흐려 보인다. 한 칸 어둡게.
      "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-600",
    ghost: "bg-white/5 text-zinc-200 hover:bg-white/10",
    outline: "border border-white/15 text-zinc-200 hover:bg-white/5",
    /*
     * ⚠️ red-500 → red-600 이던 것을 한 칸 어둡게 내렸다. 흰 글씨가 그라데이션
     *    왼쪽 위(밝은 쪽)에서 4.14:1 밖에 안 나왔다 — 기준은 4.5 다. 하필
     *    "모든 기록 지우기" 처럼 되돌릴 수 없는 단추가 그랬다.
     */
    danger:
      "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-2xl font-semibold",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  className,
  children,
  title,
}: {
  className?: string;
  children: ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * 얼마나 자주 나오는가.
 *
 * 이 앱은 "반드시 / 자주 / 보통" 세 단계만 쓴다. 별을 다섯 개까지 두면
 * 세 개와 네 개의 차이를 설명할 수 없어 오히려 안 믿게 된다.
 */
export function ImportanceBadge({
  level,
  compact = false,
}: {
  level: "must" | "high" | "normal";
  compact?: boolean;
}) {
  const look = {
    must: {
      label: "반드시",
      cls: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    },
    high: {
      label: "자주",
      cls: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    },
    normal: { label: "보통", cls: "border-white/10 bg-white/5 text-zinc-400" },
  }[level];
  return (
    <span
      className={cn(
        /* 11px 한글은 획이 가늘어 지정한 색의 6할밖에 안 칠해진다 — 밝은
           화면에서 "반드시" 가 3.97:1 로 떨어졌다. 색이 아니라 획을 굵힌다. */
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        look.cls,
      )}
    >
      {compact ? look.label.slice(0, 1) : look.label}
    </span>
  );
}

/**
 * 나에게 어려운 문항.
 *
 * 문항에 난이도를 매겨 붙이지 않는다. 같은 문항이라도 누구에게는 한 번에
 * 풀리고 누구에게는 세 번째도 틀린다. 지어낸 등급 대신 실제로 내가 틀린
 * 횟수를 센다 — 두 번부터 말해 준다. 한 번은 실수일 수 있다.
 */
export function MissBadge({ misses }: { misses: number }) {
  if (misses < 2) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-200">
      여태 {misses}번 틀림
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  className,
  color = "#6366f1",
}: {
  value: number;
  max: number;
  className?: string;
  color?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-white/10",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "#6366f1",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  accent?: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{label}</span>
        {icon && <span style={{ color: accent }}>{icon}</span>}
      </div>
      <div className="mt-1.5 text-2xl font-bold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-zinc-500">{sub}</div>}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 mt-8 flex items-center justify-between">
      <h2 className="text-base font-bold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95",
        active
          ? "pill-on shadow-lg shadow-black/10"
          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200",
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * 줄글 본문.
 * 설명을 <p> 하나에 그대로 부으면 벽이 되어 결국 안 읽게 된다.
 * 문장 두 개씩 끊고 줄 간격을 넉넉히 준다.
 */
export function Prose({
  children,
  per = 2,
  className,
  size = "md",
}: {
  children: string;
  per?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[13px] leading-[1.85]",
    md: "text-[15px] leading-[1.9]",
    lg: "text-lg leading-[1.75] font-bold",
  };
  return (
    <div className={cn("flex flex-col gap-3.5", sizes[size], className)}>
      {paragraphs(children, per).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** 가로로 넘기는 칩 줄 — 오른쪽에 더 있으면 화살표와 그림자를 띄운다 */
export function ScrollRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, children]);

  const nudge = () =>
    ref.current?.scrollBy({
      left: ref.current.clientWidth * 0.7,
      behavior: "smooth",
    });

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        onScroll={measure}
        className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth"
      >
        {children}
      </div>
      {more && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-14"
            style={{
              background:
                "linear-gradient(to left, var(--bg), color-mix(in srgb, var(--bg) 0%, transparent))",
            }}
          />
          {/* before 로 누를 수 있는 범위만 사방 8px 넓혔다 — 28px 동그라미는
              그대로 두고 실제로는 44px 를 누르는 셈이 된다. */}
          <button
            type="button"
            aria-label="오른쪽으로 넘기기"
            onClick={nudge}
            className="pill-on absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform active:scale-90 before:absolute before:-inset-2 before:content-['']"
          >
            <ChevronRight size={15} />
          </button>
        </>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  heading,
  desc,
  action,
}: {
  icon?: ReactNode;
  title: string;
  /** 화면 전체가 이 안내뿐일 때 켠다 — 그 화면의 제목이 되어야 하므로 h1 로 그린다 */
  heading?: boolean;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {icon && <div className="text-4xl opacity-60">{icon}</div>}
      {heading ? (
        <h1 className="font-semibold text-zinc-300">{title}</h1>
      ) : (
        <p className="font-semibold text-zinc-300">{title}</p>
      )}
      {desc && <p className="max-w-xs text-sm text-zinc-500">{desc}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** 과목 표시 — 색은 인라인이라 테마용 변수로 돌려 쓴다 */
export function SubjectBadge({ subject }: { subject: SubjectId }) {
  const s = SUBJECT_MAP[subject];
  if (!s) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: `${s.color}22`, color: subjectInk(s.id) }}
    >
      {s.symbol} {s.short}
    </span>
  );
}

/** 개념 안의 비교 표 — 좁은 화면에서는 표 안에서만 가로로 넘긴다 */
export function CompareTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[12px] font-bold text-zinc-400">{title}</p>
      <div className="overflow-x-auto">
        <table className="cmp-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className={j === 0 ? "font-bold" : "text-zinc-400"}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 보여 주기만 하는 쿼리 — 줄바꿈을 적어 둔 그대로 지킨다 */
export function SqlBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "sql-block sql-surface rounded-xl border border-white/10 px-3.5 py-3 text-[12.5px] leading-[1.75] text-zinc-200",
        className,
      )}
    >
      {children.trim()}
    </pre>
  );
}

/**
 * 글 안의 코드와 굵은 글씨.
 *
 * 개념 본문과 해설에 `int *p` 같은 코드 조각과 **강조**를 적어 두었는데,
 * 그대로 내보내니 화면에 별표와 백틱이 날것으로 보였다. 프로그래밍 시험
 * 앱에서 코드가 코드로 보이지 않는 것은 그냥 오타처럼 읽힌다.
 *
 * 마크다운 전부를 들이지 않고 이 둘만 읽는다 — 본문에 쓰는 것이 이 둘뿐이다.
 */
export function RichText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const out: ReactNode[] = [];
  // 백틱과 ** 를 한 번에 훑는다. 백틱 안의 별표는 코드로 남아야 하므로
  // 코드를 먼저 잡는 순서로 둔다.
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(children)) !== null) {
    if (m.index > last) out.push(children.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <code
          key={m.index}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.92em] text-indigo-100"
        >
          {m[1]}
        </code>,
      );
    } else {
      out.push(
        <strong key={m.index} className="font-bold text-zinc-100">
          {m[2]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < children.length) out.push(children.slice(last));
  return <span className={className}>{out}</span>;
}
