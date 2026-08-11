import type { FormulaTask, Grade } from "@/lib/types";
import { inGrade } from "./subjects";

/**
 * 실기 수식 문제.
 *
 * 실기 시험은 엑셀을 직접 다루므로 앱이 그대로 재현할 수 없다.
 * 하지만 실기에서 시간을 잡아먹는 지점은 클릭이 아니라 "이 조건이면
 * 어떤 함수를 어떤 참조로 쓰는가"를 떠올리는 순간이다. 그 순간만
 * 떼어 내 반복한다.
 *
 * answer는 채점 기준이 되는 모범 수식이고, alternatives에 적힌 수식도
 * 정답으로 인정한다. 채점은 lib/grade-formula.ts가 공백·대소문자를
 * 정리한 뒤 비교한다.
 */
export const FORMULA_TASKS: FormulaTask[] = [
  // ── 기본 계산 ──────────────────────────────────────────────────
  {
    id: "f-sum-basic",
    minGrade: 2,
    topic: "기본 계산",
    prompt:
      "B2:B10에 들어 있는 판매량의 합계를 구하시오.",
    answer: "=SUM(B2:B10)",
    explanation:
      "연속된 범위의 합계는 SUM 하나면 된다. 범위는 콜론(:)으로 잇는다.",
    importance: 5,
  },
  {
    id: "f-average-round",
    minGrade: 2,
    topic: "기본 계산",
    prompt:
      "C2:C21의 평균을 구하되 소수점 첫째 자리까지 나오도록 반올림하시오.",
    answer: "=ROUND(AVERAGE(C2:C21),1)",
    explanation:
      "ROUND의 두 번째 인수가 자릿수다. 소수점 첫째 자리까지 남기려면 1이다. 함수 안에 함수를 넣을 때는 안쪽부터 계산된다고 생각하면 순서가 잡힌다.",
    trap: "'소수점 첫째 자리까지'와 '소수점 첫째 자리에서'는 다르다. 앞은 1, 뒤는 0이다.",
    importance: 5,
  },
  {
    id: "f-percent-abs",
    minGrade: 2,
    topic: "기본 계산",
    prompt:
      "B2의 판매량이 전체 합계(B2:B10)에서 차지하는 비율을 구하고, B11까지 아래로 채울 수 있게 하시오.",
    sample: {
      headers: ["제품", "판매량"],
      rows: [
        ["가", "120"],
        ["나", "80"],
        ["다", "200"],
      ],
    },
    answer: "=B2/SUM($B$2:$B$10)",
    alternatives: ["=B2/SUM(B$2:B$10)"],
    explanation:
      "분자는 행마다 달라져야 하므로 상대참조, 분모인 전체 합계는 어느 행에서든 같아야 하므로 절대참조다. 아래로만 채운다면 행만 고정한 B$2:B$10도 맞다.",
    trap: "분모를 고정하지 않으면 아래로 채울 때 범위가 함께 내려가 값이 틀어진다.",
    importance: 5,
  },

  // ── 조건 ──────────────────────────────────────────────────────
  {
    id: "f-if-basic",
    minGrade: 2,
    topic: "조건",
    prompt:
      "D2의 점수가 60 이상이면 \"합격\", 아니면 \"불합격\"으로 표시하시오.",
    answer: '=IF(D2>=60,"합격","불합격")',
    explanation:
      "IF(조건, 참일 때, 거짓일 때) 세 칸이다. 결과가 글자면 큰따옴표로 감싼다.",
    trap: "따옴표를 빼면 정의되지 않은 이름으로 읽혀 #NAME? 오류가 난다.",
    importance: 5,
  },
  {
    id: "f-if-nested",
    minGrade: 2,
    topic: "조건",
    prompt:
      "E2의 점수가 90 이상이면 \"A\", 80 이상이면 \"B\", 그 외에는 \"C\"로 표시하시오.",
    answer: '=IF(E2>=90,"A",IF(E2>=80,"B","C"))',
    alternatives: ['=IFS(E2>=90,"A",E2>=80,"B",TRUE,"C")'],
    explanation:
      "조건이 여러 개면 거짓 자리에 IF를 다시 넣는다. 큰 값부터 차례로 걸러야 하며, 앞 조건이 걸러 준 덕분에 뒤 조건에 '90 미만'을 따로 쓰지 않아도 된다.",
    trap: "작은 값부터 쓰면(60 이상 → C) 모든 값이 첫 조건에 걸려 버린다.",
    importance: 5,
  },
  {
    id: "f-if-and",
    minGrade: 2,
    topic: "조건",
    prompt:
      "B2가 \"영업부\"이면서 C2가 50 이상이면 \"우수\", 아니면 빈칸으로 두시오.",
    answer: '=IF(AND(B2="영업부",C2>=50),"우수","")',
    explanation:
      "조건 두 개를 모두 만족해야 하면 AND, 하나만 만족해도 되면 OR로 묶어 IF의 첫 칸에 넣는다. 빈칸은 따옴표 두 개(\"\")다.",
    trap: '빈칸을 만들려고 아무것도 안 쓰면 FALSE가 표시된다. ""를 반드시 넣는다.',
    importance: 5,
  },
  {
    id: "f-countif",
    minGrade: 2,
    topic: "조건",
    prompt:
      "B2:B31 중 값이 80 이상인 셀의 개수를 구하시오.",
    answer: '=COUNTIF(B2:B31,">=80")',
    explanation:
      "COUNTIF의 조건은 비교 연산자까지 통째로 큰따옴표 안에 넣는다. 등호로 같은지만 볼 때는 =는 생략할 수 있다.",
    trap: '따옴표 밖에 >= 를 두면(">"&80 형태가 아니라 >=80 그대로) 오류가 난다.',
    importance: 5,
  },
  {
    id: "f-sumif",
    minGrade: 2,
    topic: "조건",
    prompt:
      "A2:A31의 부서가 \"영업부\"인 행에 대해 C2:C31의 실적 합계를 구하시오.",
    answer: '=SUMIF(A2:A31,"영업부",C2:C31)',
    explanation:
      "SUMIF(조건범위, 조건, 합계범위) 순서다. 조건을 보는 열과 더하는 열이 다르면 세 번째 인수를 반드시 적는다.",
    trap: "조건 범위와 합계 범위를 바꿔 적는 실수가 가장 흔하다. 조건이 먼저다.",
    importance: 5,
  },
  {
    id: "f-countifs",
    minGrade: 2,
    topic: "조건",
    prompt:
      "A2:A31이 \"1학년\"이면서 D2:D31이 90 이상인 행의 개수를 구하시오.",
    answer: '=COUNTIFS(A2:A31,"1학년",D2:D31,">=90")',
    explanation:
      "조건이 둘 이상이면 뒤에 S가 붙는다. 범위와 조건을 한 쌍씩 번갈아 적으며 모든 범위의 크기가 같아야 한다.",
    trap: "COUNTIFS는 범위가 먼저, SUMIFS는 합계 범위가 맨 앞이다. S가 붙으면서 SUMIFS만 순서가 바뀐다.",
    importance: 5,
  },
  {
    id: "f-sumifs",
    minGrade: 2,
    topic: "조건",
    prompt:
      "A2:A31이 \"서울\"이고 B2:B31이 \"3월\"인 행에 대해 C2:C31의 합계를 구하시오.",
    answer: '=SUMIFS(C2:C31,A2:A31,"서울",B2:B31,"3월")',
    explanation:
      "SUMIFS는 더할 범위를 맨 앞에 쓴다. SUMIF와 순서가 정반대라는 점이 이 함수의 전부다.",
    trap: "SUMIF는 (조건범위, 조건, 합계범위), SUMIFS는 (합계범위, 조건범위, 조건…)이다.",
    importance: 5,
  },

  // ── 찾기·참조 ──────────────────────────────────────────────────
  {
    id: "f-vlookup-exact",
    minGrade: 2,
    topic: "찾기·참조",
    prompt:
      "A2에 입력된 사번으로 $F$2:$H$50 표에서 이름(표의 세 번째 열)을 정확히 찾아오시오.",
    sample: {
      headers: ["F(사번)", "G(부서)", "H(이름)"],
      rows: [
        ["1001", "영업부", "김민수"],
        ["1002", "총무부", "이서연"],
      ],
    },
    answer: "=VLOOKUP(A2,$F$2:$H$50,3,0)",
    alternatives: ["=VLOOKUP(A2,$F$2:$H$50,3,FALSE)"],
    explanation:
      "사번처럼 딱 맞는 값을 찾을 때는 마지막 인수가 0(FALSE)이다. 열 번호 3은 시트의 H열이 아니라 지정한 범위 안에서 세 번째라는 뜻이다.",
    trap: "찾을 값(사번)은 반드시 범위의 첫 열에 있어야 한다. 표에서 이름이 왼쪽이면 VLOOKUP으로 못 찾는다.",
    importance: 5,
  },
  {
    id: "f-vlookup-approx",
    minGrade: 2,
    topic: "찾기·참조",
    prompt:
      "B2의 점수를 아래 등급표($E$2:$F$5)에 맞춰 등급으로 바꾸시오. 등급표는 하한 점수와 등급으로 되어 있다.",
    sample: {
      headers: ["E(하한)", "F(등급)"],
      rows: [
        ["0", "D"],
        ["60", "C"],
        ["80", "B"],
        ["90", "A"],
      ],
    },
    answer: "=VLOOKUP(B2,$E$2:$F$5,2,1)",
    alternatives: ["=VLOOKUP(B2,$E$2:$F$5,2,TRUE)", "=VLOOKUP(B2,$E$2:$F$5,2)"],
    explanation:
      "구간을 찾을 때는 근사값(TRUE·1·생략)이다. 표의 첫 열이 오름차순이어야 하며, 찾는 값보다 크지 않은 값 중 가장 큰 것을 잡는다.",
    trap: "여기서 0(FALSE)을 쓰면 딱 맞는 점수가 없는 대부분의 행에서 #N/A가 난다.",
    importance: 5,
  },
  {
    id: "f-index-match",
    minGrade: 1,
    topic: "찾기·참조",
    prompt:
      "$A$2:$C$50에서 B열의 이름이 E2와 같은 행을 찾아, 같은 행의 A열 사번을 가져오시오. (찾을 값이 왼쪽에 없는 경우)",
    answer: "=INDEX($A$2:$A$50,MATCH(E2,$B$2:$B$50,0))",
    explanation:
      "VLOOKUP은 찾을 값이 왼쪽 첫 열에 있어야 하지만, INDEX·MATCH는 방향을 가리지 않는다. MATCH가 '몇 번째 행인가'를 세고, INDEX가 그 번째의 값을 꺼낸다.",
    trap: "MATCH의 마지막 인수 0을 빠뜨리면 근사값으로 동작해 정렬되지 않은 자료에서 엉뚱한 값이 나온다.",
    importance: 5,
  },
  {
    id: "f-choose-mid",
    minGrade: 2,
    topic: "찾기·참조",
    prompt:
      "B2에 든 주민등록번호 뒷자리의 첫 글자(전체에서 8번째 문자)가 1 또는 3이면 \"남\", 2 또는 4면 \"여\"로 표시하시오.",
    answer: '=CHOOSE(MID(B2,8,1),"남","여","남","여")',
    alternatives: ['=IF(OR(MID(B2,8,1)="1",MID(B2,8,1)="3"),"남","여")'],
    explanation:
      "CHOOSE는 첫 인수의 숫자만큼 뒤의 값 중 하나를 고른다. MID로 뽑은 값은 문자지만 CHOOSE가 숫자로 알아서 읽는다. 1·2·3·4 순서대로 남·여·남·여를 적어 두면 된다.",
    trap: "MID의 시작 위치는 1부터 센다. 하이픈까지 포함해 몇 번째인지 문제 지문을 그대로 따라야 한다.",
    importance: 4,
  },

  // ── 순위·통계 ──────────────────────────────────────────────────
  {
    id: "f-rank",
    minGrade: 2,
    topic: "순위·통계",
    prompt:
      "C2의 점수가 C2:C31 안에서 몇 등인지(높을수록 1등) 구하고, 아래로 채울 수 있게 하시오.",
    answer: "=RANK.EQ(C2,$C$2:$C$31,0)",
    alternatives: [
      "=RANK.EQ(C2,$C$2:$C$31)",
      "=RANK(C2,$C$2:$C$31,0)",
      "=RANK(C2,$C$2:$C$31)",
    ],
    explanation:
      "비교 대상 범위는 모든 행에서 같아야 하므로 절대참조로 묶는다. 마지막 인수 0(또는 생략)이 내림차순, 즉 큰 값이 1등이다.",
    trap: "범위를 절대참조로 묶지 않으면 아래로 채울 때 범위가 밀려 순위가 뒤죽박죽이 된다.",
    importance: 5,
  },
  {
    id: "f-large",
    minGrade: 2,
    topic: "순위·통계",
    prompt:
      "B2:B31에서 세 번째로 큰 값을 구하시오.",
    answer: "=LARGE(B2:B31,3)",
    explanation:
      "LARGE는 k번째로 큰 값, SMALL은 k번째로 작은 값이다. k에 1을 넣으면 각각 MAX·MIN과 같아진다.",
    importance: 4,
  },
  {
    id: "f-averageifs",
    minGrade: 2,
    topic: "순위·통계",
    prompt:
      "A2:A31의 학년이 \"2학년\"인 행에 대해 C2:C31의 평균을 구하시오.",
    answer: '=AVERAGEIF(A2:A31,"2학년",C2:C31)',
    alternatives: ['=AVERAGEIFS(C2:C31,A2:A31,"2학년")'],
    explanation:
      "AVERAGEIF는 SUMIF와 인수 순서가 같다(조건범위, 조건, 평균범위). 조건이 둘 이상이면 AVERAGEIFS로 넘어가고, 그때는 평균 범위가 맨 앞으로 온다.",
    importance: 4,
  },

  // ── 텍스트·날짜 ────────────────────────────────────────────────
  {
    id: "f-text-concat",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 성과 B2의 이름을 붙여 한 셀에 표시하시오. (예: 김 + 민수 → 김민수)",
    answer: "=A2&B2",
    alternatives: ["=CONCAT(A2,B2)", "=CONCATENATE(A2,B2)"],
    explanation:
      "& 연산자가 가장 짧다. 사이에 공백을 넣고 싶으면 =A2&\" \"&B2처럼 따옴표로 감싼 공백을 끼운다.",
    importance: 4,
  },
  {
    id: "f-left-mid",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 상품코드(예: SEO-2024-01)에서 앞 세 글자만 뽑아내시오.",
    answer: "=LEFT(A2,3)",
    explanation:
      "왼쪽에서 셀 때는 LEFT, 오른쪽에서 셀 때는 RIGHT, 중간이면 MID(문자열, 시작, 개수)다.",
    trap: "LEFT·RIGHT는 인수가 두 개, MID만 세 개다.",
    importance: 4,
  },
  {
    id: "f-datedif",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "B2의 입사일부터 오늘까지의 근속 연수를 정수로 구하시오.",
    answer: '=DATEDIF(B2,TODAY(),"Y")',
    explanation:
      "DATEDIF(시작일, 종료일, 단위)이며 단위는 \"Y\"(년), \"M\"(월), \"D\"(일)이다. 함수 목록에 뜨지 않지만 정상적으로 동작한다.",
    trap: "시작일이 뒤에 오면 #NUM! 오류가 난다. 항상 이른 날짜가 먼저다.",
    importance: 4,
  },
  {
    id: "f-weekday",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 날짜가 토요일이나 일요일이면 \"휴일\", 아니면 빈칸으로 표시하시오.",
    answer: '=IF(WEEKDAY(A2,2)>=6,"휴일","")',
    alternatives: ['=IF(OR(WEEKDAY(A2)=1,WEEKDAY(A2)=7),"휴일","")'],
    explanation:
      "WEEKDAY의 두 번째 인수를 2로 주면 월요일이 1, 토요일이 6, 일요일이 7이 되어 주말 판정이 간단해진다. 옵션을 생략하면 일요일이 1이다.",
    trap: "옵션 1(기본)과 2는 시작 요일이 다르다. 어느 쪽을 썼는지에 따라 비교할 숫자가 달라진다.",
    importance: 4,
  },

  // ── 데이터베이스 함수 ──────────────────────────────────────────
  {
    id: "f-dsum",
    minGrade: 1,
    topic: "데이터베이스 함수",
    prompt:
      "A1:D31의 표에서 F1:F2에 적어 둔 조건에 맞는 행의 \"실적\" 열 합계를 구하시오.",
    answer: '=DSUM(A1:D31,"실적",F1:F2)',
    alternatives: ["=DSUM(A1:D31,4,F1:F2)"],
    explanation:
      "D함수는 (전체 표, 대상 필드, 조건 범위) 세 칸이다. 표와 조건 범위 모두 필드명이 들어간 첫 행을 포함해야 한다. 필드는 이름을 따옴표로 쓰거나 몇 번째 열인지 숫자로 쓴다.",
    trap: "표 범위에 머리글 행을 빼고 A2부터 잡으면 필드명을 못 찾아 오류가 난다.",
    importance: 4,
  },
  {
    id: "f-dcount",
    minGrade: 1,
    topic: "데이터베이스 함수",
    prompt:
      "A1:D31의 표에서 조건 범위 F1:G2에 맞는 행의 개수를 구하시오. (대상 필드는 숫자가 든 \"점수\" 열)",
    answer: '=DCOUNT(A1:D31,"점수",F1:G2)',
    alternatives: ['=DCOUNTA(A1:D31,"점수",F1:G2)'],
    explanation:
      "DCOUNT는 지정한 필드가 숫자인 행만 센다. 문자 필드를 세려면 DCOUNTA를 써야 한다. 조건 범위를 넓게 잡으면 조건이 AND로 묶인다.",
    importance: 3,
  },

  // ── 배열 수식 (1급) ────────────────────────────────────────────
  {
    id: "f-array-count",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "A2:A31의 부서가 \"영업부\"이면서 B2:B31의 실적이 50 이상인 행의 개수를 배열 수식으로 구하시오.",
    answer: '=SUM((A2:A31="영업부")*(B2:B31>=50))',
    alternatives: ['=SUMPRODUCT((A2:A31="영업부")*(B2:B31>=50))'],
    explanation:
      "조건식은 TRUE(1)와 FALSE(0)를 늘어놓은 배열이 된다. 두 배열을 곱하면 둘 다 참인 자리만 1이 남고, 그 합이 곧 개수다. 입력을 Ctrl+Shift+Enter로 마쳐야 중괄호가 붙는다.",
    trap: "SUMPRODUCT를 쓰면 Ctrl+Shift+Enter 없이도 동작한다. 문제에서 배열 수식을 요구하면 SUM 쪽을 쓴다.",
    importance: 5,
  },
  {
    id: "f-array-sum",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "A2:A31의 지역이 \"서울\"인 행에 대해 C2:C31의 합계를 배열 수식으로 구하시오.",
    answer: '=SUM((A2:A31="서울")*C2:C31)',
    alternatives: ['=SUM(IF(A2:A31="서울",C2:C31))', '=SUMPRODUCT((A2:A31="서울")*C2:C31)'],
    explanation:
      "조건 배열(1과 0)에 합칠 값을 곱하면 조건에 맞지 않는 자리는 0이 되어 합계에서 빠진다. 조건부 합계 배열 수식의 기본 꼴이다.",
    importance: 5,
  },
  {
    id: "f-array-max",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "A2:A31의 학과가 \"경영\"인 학생 중 B2:B31 점수의 최고점을 배열 수식으로 구하시오.",
    answer: '=MAX((A2:A31="경영")*B2:B31)',
    alternatives: ['=MAX(IF(A2:A31="경영",B2:B31))'],
    explanation:
      "조건에 맞지 않는 자리는 0이 되므로, 점수가 모두 양수인 자료에서는 MAX로 바로 최고점을 얻는다. 음수가 섞일 수 있으면 IF 형태를 써야 한다.",
    trap: "점수에 음수가 있으면 곱셈 방식은 0을 최댓값으로 잡을 수 있다. 그럴 때는 IF 형태가 안전하다.",
    importance: 4,
  },
  {
    id: "f-array-index",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "B2:B31의 점수가 가장 높은 사람의 이름(A2:A31)을 배열 수식으로 구하시오.",
    answer: "=INDEX(A2:A31,MATCH(MAX(B2:B31),B2:B31,0))",
    explanation:
      "MAX로 최고점을 구하고, MATCH로 그 점수가 몇 번째인지 찾고, INDEX로 같은 번째의 이름을 꺼낸다. 안쪽부터 차례로 읽으면 구조가 그대로 보인다.",
    trap: "MATCH의 마지막 인수 0을 빠뜨리면 정렬을 전제한 근사 검색이 되어 엉뚱한 이름이 나온다.",
    importance: 5,
  },
];

export const FORMULA_MAP: Record<string, FormulaTask> = Object.fromEntries(
  FORMULA_TASKS.map((f) => [f.id, f]),
);

/** 급수에 드는 수식 문제만 */
export function formulasFor(grade: Grade, topic?: string): FormulaTask[] {
  return FORMULA_TASKS.filter(
    (f) => inGrade(grade, f.minGrade) && (!topic || f.topic === topic),
  );
}

/** 갈래 목록 — 데이터에 나온 순서를 지킨다 */
export function formulaTopics(grade: Grade): string[] {
  const seen: string[] = [];
  for (const f of formulasFor(grade)) {
    if (!seen.includes(f.topic)) seen.push(f.topic);
  }
  return seen;
}
