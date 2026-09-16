import { useApp, type AppState } from "./store";

/**
 * 학습 기록 백업.
 *
 * 기록은 이 기기의 브라우저에만 있다. 서버에 사본을 두지 않으므로 브라우저
 * 데이터를 지우거나 기기를 바꾸면 되찾을 방법이 없다. 앱이 그 사실을
 * 사용자에게 밝히고 있으면서 옮길 방법을 주지 않는 것은 앞뒤가 맞지 않는다.
 *
 * 불러오기는 되돌릴 수 없는 동작이라 두 가지를 지킨다.
 *   · 파일이 이 앱의 백업이 맞는지 확인한 뒤에만 적용한다
 *   · 적용 직전에 지금 기록을 자동 사본으로 남겨, 실수로 덮어써도 되살린다
 */

/** 백업 파일 형식. 나중에 구조가 바뀌어도 옛 파일을 읽을 수 있게 표시해 둔다. */
const FORMAT = "gisa-backup";
const FORMAT_VERSION = 1;
const UNDO_KEY = "gisa:backup-undo";

/** 백업에 담는 것 — 저장소에 남기는 것과 같다 */
export type BackupData = Pick<
  AppState,
  | "settings"
  | "stats"
  | "studiedIds"
  | "studiedAt"
  | "questionMisses"
  | "clearedQuestionIds"
  | "clearedPracticalIds"
  | "reviewCards"
  | "quizHistory"
  | "wrongIds"
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
    settings: s.settings,
    stats: s.stats,
    studiedIds: s.studiedIds,
    studiedAt: s.studiedAt,
    questionMisses: s.questionMisses,
    clearedQuestionIds: s.clearedQuestionIds,
    clearedPracticalIds: s.clearedPracticalIds,
    reviewCards: s.reviewCards,
    quizHistory: s.quizHistory,
    wrongIds: s.wrongIds,
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
  /*
   * ⚠️ 파일 이름을 한글로 두면 안 된다.
   *
   *    크로미움은 blob 내려받기의 download 속성에 아스키가 아닌 글자가 있으면
   *    이름을 통째로 버리고 "download" 로 저장한다 — 확장자도 사라져 나중에
   *    그 파일이 무엇인지 알 수 없고, 다시 고를 때도 .json 으로 걸리지 않는다.
   *    실제로 재어 보니 "plain.json" 은 그대로 오는데 "한글.json" 은
   *    "download" 가 되었다. 이름은 아스키로 적고, 무엇인지는 앱 이름으로 밝힌다.
   */
  a.download = `gisa-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface BackupSummary {
  exportedAt: string | null;
  studied: number;
  reviewCards: number;
  cleared: number;
  mockAttempts: number;
  xp: number;
}

export function summarize(d: BackupData, exportedAt?: string): BackupSummary {
  return {
    exportedAt: exportedAt ?? null,
    studied: d.studiedIds?.length ?? 0,
    reviewCards: d.reviewCards?.length ?? 0,
    cleared:
      (d.clearedQuestionIds?.length ?? 0) + (d.clearedPracticalIds?.length ?? 0),
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
  if (f.format !== FORMAT) throw new Error("이 앱의 백업 파일이 아닙니다.");
  if (typeof f.version !== "number" || f.version > FORMAT_VERSION)
    throw new Error("더 새로운 판의 백업입니다. 앱을 새로고침해 주세요.");
  const d = f.data as BackupData | undefined;
  if (!d || typeof d !== "object") throw new Error("기록이 들어 있지 않습니다.");
  for (const k of [
    "studiedIds",
    "clearedQuestionIds",
    "clearedPracticalIds",
    "reviewCards",
    "quizHistory",
    "wrongIds",
    "mockAttempts",
  ] as const) {
    if (d[k] !== undefined && !Array.isArray(d[k]))
      throw new Error(`백업이 손상되었습니다 (${k}).`);
  }
  return { ...(f as BackupFile), data: d };
}

/**
 * 백업을 적용한다. 지금 기록은 되돌리기용으로 남겨 둔다.
 * 되돌리기는 이 브라우저에서 한 번만 쓸 수 있다.
 */
export function restoreBackup(file: BackupFile): void {
  try {
    localStorage.setItem(UNDO_KEY, JSON.stringify(buildBackup()));
  } catch {
    // 되돌리기 사본을 못 남겨도 복원 자체는 진행한다
  }
  const d = file.data;
  useApp.setState((s) => ({
    settings: d.settings ?? s.settings,
    stats: d.stats ?? s.stats,
    studiedIds: d.studiedIds ?? s.studiedIds,
    studiedAt: d.studiedAt ?? s.studiedAt,
    questionMisses: d.questionMisses ?? s.questionMisses,
    clearedQuestionIds: d.clearedQuestionIds ?? s.clearedQuestionIds,
    clearedPracticalIds: d.clearedPracticalIds ?? s.clearedPracticalIds,
    reviewCards: d.reviewCards ?? s.reviewCards,
    quizHistory: d.quizHistory ?? s.quizHistory,
    wrongIds: d.wrongIds ?? s.wrongIds,
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
    restoreInto(f.data);
    return true;
  } catch {
    return false;
  }
}

function restoreInto(d: BackupData): void {
  useApp.setState((s) => ({
    settings: d.settings ?? s.settings,
    stats: d.stats ?? s.stats,
    studiedIds: d.studiedIds ?? s.studiedIds,
    studiedAt: d.studiedAt ?? s.studiedAt,
    questionMisses: d.questionMisses ?? s.questionMisses,
    clearedQuestionIds: d.clearedQuestionIds ?? s.clearedQuestionIds,
    clearedPracticalIds: d.clearedPracticalIds ?? s.clearedPracticalIds,
    reviewCards: d.reviewCards ?? s.reviewCards,
    quizHistory: d.quizHistory ?? s.quizHistory,
    wrongIds: d.wrongIds ?? s.wrongIds,
    mockAttempts: d.mockAttempts ?? s.mockAttempts,
  }));
}

/**
 * 두 기록을 합친다 — 폰과 태블릿을 함께 쓰는 경우를 위해.
 * 덮어쓰기와 달리 어느 쪽 기록도 버리지 않는다.
 */
export function mergeBackup(file: BackupFile): void {
  try {
    localStorage.setItem(UNDO_KEY, JSON.stringify(buildBackup()));
  } catch {
    /* 무시 */
  }
  const d = file.data;
  useApp.setState((s) => {
    // 복습 카드는 같은 개념이면 더 최근에 본 쪽을 남긴다
    const cards = new Map(s.reviewCards.map((c) => [c.sourceId, c]));
    for (const c of d.reviewCards ?? []) {
      const cur = cards.get(c.sourceId);
      if (!cur || (c.lastReviewedAt ?? 0) > (cur.lastReviewedAt ?? 0))
        cards.set(c.sourceId, c);
    }
    return {
      settings: s.settings ?? d.settings,
      stats: {
        ...s.stats,
        xp: Math.max(s.stats.xp, d.stats?.xp ?? 0),
        streak: Math.max(s.stats.streak, d.stats?.streak ?? 0),
        studyMinutes: Math.max(
          s.stats.studyMinutes,
          d.stats?.studyMinutes ?? 0,
        ),
      },
      studiedIds: [...new Set([...s.studiedIds, ...(d.studiedIds ?? [])])],
      /* 처음 본 때는 이른 쪽을 남긴다 — 나중 것으로 덮으면 "오늘 봤다" 가 된다 */
      studiedAt: Object.fromEntries(
        [...Object.keys(s.studiedAt), ...Object.keys(d.studiedAt ?? {})].map(
          (k) => {
            const a = s.studiedAt[k] ?? Infinity;
            const b = d.studiedAt?.[k] ?? Infinity;
            return [k, Math.min(a, b)];
          },
        ),
      ),
      /* 같은 문항을 폰에서 둘, 태블릿에서 셋 틀렸다면 더 많은 쪽을 남긴다.
         더하면 한쪽에서 옮겨 온 기록을 두 번 세게 된다. */
      questionMisses: Object.fromEntries(
        [
          ...Object.keys(s.questionMisses),
          ...Object.keys(d.questionMisses ?? {}),
        ].map((k) => [
          k,
          Math.max(s.questionMisses[k] ?? 0, d.questionMisses?.[k] ?? 0),
        ]),
      ),
      clearedQuestionIds: [
        ...new Set([...s.clearedQuestionIds, ...(d.clearedQuestionIds ?? [])]),
      ],
      clearedPracticalIds: [
        ...new Set([...s.clearedPracticalIds, ...(d.clearedPracticalIds ?? [])]),
      ],
      reviewCards: [...cards.values()],
      quizHistory: [...s.quizHistory, ...(d.quizHistory ?? [])].slice(-500),
      wrongIds: [...new Set([...s.wrongIds, ...(d.wrongIds ?? [])])],
      mockAttempts: dedupeAttempts([
        ...s.mockAttempts,
        ...(d.mockAttempts ?? []),
      ]),
    };
  });
}

/** 같은 응시(시험 종류 + 시작 시각)는 하나만 남긴다 */
function dedupeAttempts<T extends { track: string; startedAt: number }>(
  list: T[],
): T[] {
  const seen = new Map<string, T>();
  for (const a of list) seen.set(`${a.track}@${a.startedAt}`, a);
  return [...seen.values()].sort((a, b) => a.startedAt - b.startedAt);
}
