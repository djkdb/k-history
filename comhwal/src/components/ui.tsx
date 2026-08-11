"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { SubjectId } from "@/lib/types";
import { SUBJECT_MAP } from "@/data/subjects";
import { prettyKey } from "@/lib/shortcut";
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
}: {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit";
}) {
  const variants = {
    primary:
      "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-indigo-600",
    ghost: "bg-white/5 text-zinc-200 hover:bg-white/10",
    outline: "border border-white/15 text-zinc-200 hover:bg-white/5",
    danger:
      "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25",
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

export function ImportanceBadge({
  importance,
  compact = false,
}: {
  importance: number;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        importanceBg(importance),
      )}
    >
      <span className="tracking-tighter">{importanceStars(importance)}</span>
      {!compact && importanceLabel(importance)}
    </span>
  );
}

export function SubjectBadge({ subject }: { subject: SubjectId }) {
  const s = SUBJECT_MAP[subject];
  if (!s) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {s.name}
    </span>
  );
}

/** 1급 전용 표시 — 2급 준비생에게는 아예 안 보이므로 1급 화면에서만 뜬다 */
export function GradeBadge({ minGrade }: { minGrade: 1 | 2 }) {
  if (minGrade !== 1) return null;
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-300">
      1급
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
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/10", className)}
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
    ref.current?.scrollBy({ left: ref.current.clientWidth * 0.7, behavior: "smooth" });

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
          <button
            type="button"
            aria-label="오른쪽으로 넘기기"
            onClick={nudge}
            className="pill-on absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform active:scale-90"
          >
            <ChevronRight size={15} />
          </button>
        </>
      )}
    </div>
  );
}

/** 자판 모양 키캡 — "Ctrl + Shift + L" 을 실제 키처럼 보여 준다 */
export function KeyCaps({
  combo,
  size = "md",
  down = false,
}: {
  combo: string;
  size?: "md" | "lg";
  down?: boolean;
}) {
  const parts = combo.includes("+")
    ? prettyKey(combo.toLowerCase().replace(/\s/g, "")).split(" + ")
    : [combo];
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-zinc-500">+</span>}
          <kbd
            className={cn(
              "keycap",
              size === "lg" && "keycap-lg",
              down && "keycap-down",
            )}
          >
            {p}
          </kbd>
        </span>
      ))}
    </span>
  );
}

/** 개념 안의 비교 표 — 좁은 화면에서는 가로로 스크롤된다 */
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
      <p className="mb-2 text-[13px] font-bold text-zinc-300">{title}</p>
      <div className="no-scrollbar overflow-x-auto">
        <table className="cmp-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={j === 0 ? "font-semibold" : ""}>
                    {c}
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

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {icon && <div className="text-4xl opacity-60">{icon}</div>}
      <p className="font-semibold text-zinc-300">{title}</p>
      {desc && <p className="max-w-xs text-sm text-zinc-500">{desc}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
