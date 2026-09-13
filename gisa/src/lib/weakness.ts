import { SUBJECTS, SUBJECT_MAP, cutoff, type SubjectId } from "@/data/exam";
import { CONCEPT_MAP } from "@/data/concepts";
import { QUESTIONS } from "@/data/questions";
import { PRACTICAL_QUESTIONS } from "@/data/practical";
import type { MockAttempt } from "@/lib/types";

export interface Weakness {
  subject: SubjectId;
  /** 가장 최근 모의고사에서 이 과목 점수 (본 적 없으면 null) */
  mockScore: number | null;
  /** 그 점수가 과락선 아래인가 */
  failed: boolean;
  /** 지금 틀린 채로 남아 있는 개념 수 */
  wrong: number;
  /** 이 과목의 개념을 몇 개나 봤는가 */
  studied: number;
  total: number;
  /** 급한 정도 — 클수록 먼저 봐야 한다 */
  urgency: number;
  /** 왜 급한지 한 줄 */
  why: string;
  /**
   * 짚을 근거가 실제로 있는가.
   *
   * 아직 안 본 개념이 많다는 것은 약점이 아니라 출발점이다. 그것만으로
   * "지금 가장 급한 곳" 이라고 말하면, 아무것도 안 한 사람에게 처음부터
   * 빨간 카드를 들이미는 꼴이 된다. 시험을 보았거나 틀린 적이 있을 때만
   * 참이다.
   */
  grounded: boolean;
}

/**
 * 지금 어디부터 봐야 하는가.
 *
 * 기록은 쌓이는데 그걸 읽어 주는 곳이 없으면 사용자는 늘 1과목부터 다시
 * 시작한다. 시험이 한 달 남은 사람에게 필요한 것은 "어디가 무너졌는지"다.
 *
 * 과락은 평균과 다른 무게를 갖는다. 평균이 아무리 높아도 한 과목이 40점에
 * 못 미치면 떨어지므로, 과락 난 과목을 무엇보다 앞에 둔다.
 */
export function analyze(
  attempts: MockAttempt[],
  wrongIds: string[],
  studiedIds: string[],
): Weakness[] {
  const lastWritten = [...attempts]
    .reverse()
    .find((a) => a.track === "written");
  const wrongSet = new Set(wrongIds);

  return SUBJECTS.map((s) => {
    const mine = lastWritten?.bySubject.find((b) => b.subject === s.id);
    const mockScore =
      mine && mine.total > 0
        ? Math.round((mine.correct / mine.total) * 100)
        : null;
    const failed = mine ? mine.correct < cutoff(s.id) : false;

    // 이 과목에 속한 개념 중 지금 틀린 채로 남은 것
    const wrong = [...wrongSet].filter(
      (id) => CONCEPT_MAP[id]?.subject === s.id,
    ).length;
    const conceptsHere = Object.values(CONCEPT_MAP).filter(
      (c) => c.subject === s.id,
    );
    const studied = conceptsHere.filter((c) =>
      studiedIds.includes(c.id),
    ).length;
    const total = conceptsHere.length;

    /*
     * 급한 정도를 하나의 수로 모은다.
     *   과락      — 다른 무엇보다 앞이다. 평균이 높아도 떨어진다
     *   낮은 점수 — 40점을 넘겨도 60에 못 미치면 여전히 위험하다
     *   틀린 개념 — 한 번 틀린 것은 또 틀린다
     *   안 본 개념 — 아직 손도 대지 않은 곳
     */
    let urgency = 0;
    let why = "";
    if (failed) {
      urgency += 1000;
      why = `지난 모의고사에서 ${mockScore}점 — 과락입니다`;
    } else if (mockScore !== null && mockScore < 60) {
      urgency += 400 + (60 - mockScore) * 5;
      why = `지난 모의고사에서 ${mockScore}점 — 평균 60점에 못 미칩니다`;
    }
    urgency += wrong * 30;
    urgency += (total - studied) * 5;
    if (!why) {
      if (wrong > 0) why = `틀린 채로 남은 개념이 ${wrong}개 있습니다`;
      else if (studied < total)
        why = `아직 안 본 개념이 ${total - studied}개 있습니다`;
      else why = "이 과목은 한 바퀴 돌았습니다";
    }

    return {
      subject: s.id,
      mockScore,
      failed,
      wrong,
      studied,
      total,
      urgency,
      why,
      grounded: mockScore !== null || wrong > 0,
    };
  }).sort((a, b) => b.urgency - a.urgency);
}

/** 그 과목에 남은 문항이 몇 개인가 — 권하기 전에 실제로 풀 것이 있는지 본다 */
export function stock(subject: SubjectId): {
  written: number;
  practical: number;
} {
  return {
    written: QUESTIONS.filter((q) => q.subject === subject).length,
    practical: PRACTICAL_QUESTIONS.filter((q) => q.subject === subject).length,
  };
}

export function subjectName(id: SubjectId): string {
  return SUBJECT_MAP[id].name;
}
