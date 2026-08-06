import { useApp, type AppState } from "./store";

/**
 * 학습 기록 백업.
 *
 * 기록은 사용자 기기에만 있다. 브라우저 데이터를 지우거나 기기를 바꾸면
 * 되찾을 방법이 없으므로, 파일로 빼 두고 되돌릴 길을 연다.
 *
 * 불러오기는 되돌릴 수 없는 동작이라 두 가지를 지킨다.
 *   · 파일이 이 앱의 백업이 맞는지 확인한 뒤에만 적용한다
 *   · 적용 직전에 지금 기록을 자동 백업으로 남겨 실수로 덮어써도 되살린다
 */

/** 백업 파일 형식. 나중에 구조가 바뀌어도 옛 파일을 읽을 수 있게 표시해 둔다. */
const FORMAT = "khlm-backup";
const FORMAT_VERSION = 1;
const UNDO_KEY = "khlm:backup-undo";

/** 백업에 담는 필드 — 저장소에 저장하는 것과 같다 */
export type BackupData = Pick<
  AppState,
  | "exam"
  | "stats"
  | "studiedEventIds"
  | "reviewCards"
  | "quizHistory"
  | "wrongEventIds"
  | "mockAttempts"
>;

export interface BackupFile {
  format: typeof FORMAT;
  version: number;
  exportedAt: string;
  data: BackupData;
}

function snapshot(): BackupData {
  const s = useApp.getState();
  return {
    exam: s.exam,
    stats: s.stats,
    studiedEventIds: s.studiedEventIds,
    reviewCards: s.reviewCards,
    quizHistory: s.quizHistory,
    wrongEventIds: s.wrongEventIds,
    mockAttempts: s.mockAttempts,
  };
}

/** 지금 기록을 백업 파일 내용으로 만든다 */
export function buildBackup(): BackupFile {
  return {
    format: FORMAT,
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: snapshot(),
  };
}

/** 백업 파일을 내려받는다 */
export function downloadBackup(): void {
  const file = buildBackup();
  const stamp = file.exportedAt.slice(0, 10);
  const blob = new Blob([JSON.stringify(file, null, 1)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `한국사-학습기록-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface BackupSummary {
  exportedAt: string | null;
  studied: number;
  reviewCards: number;
  quizzes: number;
  mockAttempts: number;
  xp: number;
}

export function summarize(d: BackupData, exportedAt?: string): BackupSummary {
  return {
    exportedAt: exportedAt ?? null,
    studied: d.studiedEventIds?.length ?? 0,
    reviewCards: d.reviewCards?.length ?? 0,
    quizzes: d.quizHistory?.length ?? 0,
    mockAttempts: d.mockAttempts?.length ?? 0,
    xp: d.stats?.xp ?? 0,
  };
}

/** 파일 내용이 이 앱의 백업이 맞는지 확인한다 */
export function parseBackup(text: string): BackupFile {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("JSON 파일이 아닙니다.");
  }
  if (!json || typeof json !== "object") throw new Error("빈 파일입니다.");
  const f = json as Partial<BackupFile>;
  if (f.format !== FORMAT)
    throw new Error("이 앱의 백업 파일이 아닙니다.");
  if (typeof f.version !== "number" || f.version > FORMAT_VERSION)
    throw new Error("더 새로운 버전의 백업입니다. 앱을 새로고침해 주세요.");
  const d = f.data as BackupData | undefined;
  if (!d || typeof d !== "object") throw new Error("기록이 들어 있지 않습니다.");
  for (const k of [
    "studiedEventIds",
    "reviewCards",
    "quizHistory",
    "wrongEventIds",
    "mockAttempts",
  ] as const) {
    if (d[k] !== undefined && !Array.isArray(d[k]))
      throw new Error(`백업이 손상되었습니다 (${k}).`);
  }
  return { ...(f as BackupFile), data: d };
}

/**
 * 백업을 적용한다. 지금 기록은 되돌리기용으로 남겨 둔다.
 * 되돌리기는 이 브라우저에서 한 번만, 새로고침 전까지 유효하다.
 */
export function restoreBackup(file: BackupFile): void {
  try {
    localStorage.setItem(UNDO_KEY, JSON.stringify(buildBackup()));
  } catch {
    // 되돌리기 사본을 못 남겨도 복원 자체는 진행한다
  }
  const d = file.data;
  useApp.setState((s) => ({
    exam: d.exam ?? s.exam,
    stats: d.stats ?? s.stats,
    studiedEventIds: d.studiedEventIds ?? s.studiedEventIds,
    reviewCards: d.reviewCards ?? s.reviewCards,
    quizHistory: d.quizHistory ?? s.quizHistory,
    wrongEventIds: d.wrongEventIds ?? s.wrongEventIds,
    mockAttempts: d.mockAttempts ?? s.mockAttempts,
  }));
}

/** 되돌릴 기록이 있는지 */
export function undoAvailable(): BackupSummary | null {
  try {
    const raw = localStorage.getItem(UNDO_KEY);
    if (!raw) return null;
    const f = parseBackup(raw);
    return summarize(f.data, f.exportedAt);
  } catch {
    return null;
  }
}

/** 불러오기 직전 상태로 되돌린다 */
export function undoRestore(): boolean {
  try {
    const raw = localStorage.getItem(UNDO_KEY);
    if (!raw) return false;
    const f = parseBackup(raw);
    localStorage.removeItem(UNDO_KEY);
    const d = f.data;
    useApp.setState({
      exam: d.exam,
      stats: d.stats,
      studiedEventIds: d.studiedEventIds,
      reviewCards: d.reviewCards,
      quizHistory: d.quizHistory,
      wrongEventIds: d.wrongEventIds,
      mockAttempts: d.mockAttempts,
    });
    return true;
  } catch {
    return false;
  }
}

/** 두 기록을 합친다 — 기기 두 대를 쓰는 경우를 위해 */
export function mergeBackup(file: BackupFile): void {
  try {
    localStorage.setItem(UNDO_KEY, JSON.stringify(buildBackup()));
  } catch {
    /* 무시 */
  }
  const d = file.data;
  useApp.setState((s) => {
    // 복습 카드는 같은 개념이면 더 최근에 본 쪽을 남긴다
    const cards = new Map(s.reviewCards.map((c) => [c.eventId, c]));
    for (const c of d.reviewCards ?? []) {
      const cur = cards.get(c.eventId);
      if (!cur || (c.lastReviewedAt ?? 0) > (cur.lastReviewedAt ?? 0))
        cards.set(c.eventId, c);
    }
    return {
      exam: s.exam ?? d.exam,
      stats: {
        ...s.stats,
        xp: Math.max(s.stats.xp, d.stats?.xp ?? 0),
        totalStudyMinutes: Math.max(
          s.stats.totalStudyMinutes,
          d.stats?.totalStudyMinutes ?? 0,
        ),
        streak: Math.max(s.stats.streak, d.stats?.streak ?? 0),
        badges: [...new Set([...s.stats.badges, ...(d.stats?.badges ?? [])])],
      },
      studiedEventIds: [
        ...new Set([...s.studiedEventIds, ...(d.studiedEventIds ?? [])]),
      ],
      reviewCards: [...cards.values()],
      quizHistory: [...s.quizHistory, ...(d.quizHistory ?? [])].slice(-500),
      wrongEventIds: [
        ...new Set([...s.wrongEventIds, ...(d.wrongEventIds ?? [])]),
      ],
      mockAttempts: dedupeAttempts([
        ...s.mockAttempts,
        ...(d.mockAttempts ?? []),
      ]),
    };
  });
}

/** 같은 응시(시험 + 시작 시각)는 하나만 남긴다 */
function dedupeAttempts<T extends { examId: string; startedAt: number }>(
  list: T[],
): T[] {
  const seen = new Map<string, T>();
  for (const a of list) seen.set(`${a.examId}@${a.startedAt}`, a);
  return [...seen.values()].sort((a, b) => a.startedAt - b.startedAt);
}
