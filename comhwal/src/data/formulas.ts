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

  // ── 기본 계산 (더) ─────────────────────────────────────────────
  {
    id: "f-sum-multi",
    minGrade: 2,
    topic: "기본 계산",
    prompt: "떨어져 있는 두 범위 B2:B10과 D2:D10의 합계를 한 수식으로 구하시오.",
    answer: "=SUM(B2:B10,D2:D10)",
    explanation:
      "SUM은 인수를 여러 개 받는다. 떨어진 범위는 쉼표로 이어 적으면 된다.",
    trap: "쉼표 대신 콜론으로 이으면 두 범위 사이의 모든 셀이 통째로 들어간다.",
    importance: 4,
  },
  {
    id: "f-sumproduct",
    minGrade: 2,
    topic: "기본 계산",
    prompt:
      "단가(B2:B10)와 수량(C2:C10)을 곱한 뒤 모두 더한 총액을 구하시오.",
    sample: {
      headers: ["제품", "단가", "수량"],
      rows: [
        ["가", "1000", "3"],
        ["나", "2500", "2"],
      ],
    },
    answer: "=SUMPRODUCT(B2:B10,C2:C10)",
    alternatives: ["=SUM(B2:B10*C2:C10)"],
    explanation:
      "SUMPRODUCT는 짝끼리 곱한 뒤 그 합을 한 번에 낸다. 곱셈 열을 따로 만들 필요가 없다.",
    importance: 4,
  },
  {
    id: "f-max-min-gap",
    minGrade: 2,
    topic: "기본 계산",
    prompt: "B2:B21에서 가장 큰 값과 가장 작은 값의 차이를 구하시오.",
    answer: "=MAX(B2:B21)-MIN(B2:B21)",
    explanation:
      "함수의 결과끼리도 그냥 빼면 된다. 수식 하나에 함수를 두 번 써도 괜찮다.",
    importance: 3,
  },
  {
    id: "f-round-zero",
    minGrade: 2,
    topic: "기본 계산",
    prompt: "C2:C31의 평균을 소수점 첫째 자리에서 반올림해 정수로 구하시오.",
    answer: "=ROUND(AVERAGE(C2:C31),0)",
    explanation:
      "'첫째 자리에서' 반올림하면 정수가 남으므로 자릿수는 0이다. '첫째 자리까지'였다면 1이다.",
    trap: "'~에서'와 '~까지'가 한 자리 차이를 만든다. 문제 지문을 그대로 읽어야 한다.",
    importance: 5,
  },

  // ── 조건 (더) ──────────────────────────────────────────────────
  {
    id: "f-countif-wild",
    minGrade: 2,
    topic: "조건",
    prompt: "A2:A31의 이름 중 성이 '김'인 사람의 수를 구하시오.",
    answer: '=COUNTIF(A2:A31,"김*")',
    explanation:
      "조건 안에서 *는 임의의 여러 글자를 뜻한다. '김*'는 김으로 시작하는 모든 이름이다.",
    trap: "'*김*'은 이름 가운데에 김이 들어간 것까지 센다. 성만 보려면 '김*'이다.",
    importance: 4,
  },
  {
    id: "f-countifs-range",
    minGrade: 2,
    topic: "조건",
    prompt: "B2:B31의 점수가 70 이상 80 미만인 사람의 수를 구하시오.",
    answer: '=COUNTIFS(B2:B31,">=70",B2:B31,"<80")',
    explanation:
      "구간을 셀 때는 같은 범위를 두 번 적고 조건을 위·아래로 나눠 준다.",
    trap: '">=70 AND <80" 처럼 한 조건에 몰아 쓰면 문자로 읽혀 0이 나온다.',
    importance: 5,
  },
  {
    id: "f-sumifs-three",
    minGrade: 2,
    topic: "조건",
    prompt:
      "A2:A31이 \"서울\", B2:B31이 \"3월\", C2:C31이 100 이상인 행에 대해 D2:D31의 합계를 구하시오.",
    answer: '=SUMIFS(D2:D31,A2:A31,"서울",B2:B31,"3월",C2:C31,">=100")',
    explanation:
      "SUMIFS는 조건을 얼마든지 이어 붙일 수 있다. 맨 앞이 더할 범위이고, 그 뒤로 (범위, 조건) 쌍이 반복된다.",
    importance: 4,
  },
  {
    id: "f-averageifs-two",
    minGrade: 2,
    topic: "조건",
    prompt:
      "A2:A31이 \"2학년\"이면서 B2:B31이 \"여\"인 행에 대해 C2:C31의 평균을 구하시오.",
    answer: '=AVERAGEIFS(C2:C31,A2:A31,"2학년",B2:B31,"여")',
    explanation:
      "조건이 둘 이상이면 AVERAGEIFS다. SUMIFS와 마찬가지로 평균 낼 범위가 맨 앞에 온다.",
    trap: "AVERAGEIF는 조건 범위가 맨 앞, AVERAGEIFS는 평균 범위가 맨 앞이다.",
    importance: 4,
  },
  {
    id: "f-countif-dup",
    minGrade: 2,
    topic: "조건",
    prompt:
      "A2의 값이 A2:A31 안에 몇 번 나오는지 세고, 아래로 채울 수 있게 하시오.",
    answer: "=COUNTIF($A$2:$A$31,A2)",
    explanation:
      "찾는 범위는 모든 행에서 같아야 하므로 절대참조로 묶고, 세려는 값만 상대참조로 둔다. 결과가 2 이상이면 중복이다.",
    trap: "범위를 고정하지 않으면 아래로 갈수록 범위가 밀려 늘 1이 나온다.",
    importance: 4,
  },
  {
    id: "f-ifs-grade",
    minGrade: 2,
    topic: "조건",
    prompt:
      "B2의 점수가 90 이상이면 \"수\", 80 이상이면 \"우\", 70 이상이면 \"미\", 그 외에는 \"양\"으로 표시하시오.",
    answer: '=IF(B2>=90,"수",IF(B2>=80,"우",IF(B2>=70,"미","양")))',
    alternatives: ['=IFS(B2>=90,"수",B2>=80,"우",B2>=70,"미",TRUE,"양")'],
    explanation:
      "IF를 거짓 자리에 계속 끼워 넣는다. 큰 값부터 걸러야 하며, 닫는 괄호 수가 IF의 개수와 같아야 한다.",
    trap: "괄호를 하나 덜 닫아 오류가 나는 일이 잦다. IF를 세 번 썼으면 )도 세 개다.",
    importance: 5,
  },
  {
    id: "f-if-blank",
    minGrade: 2,
    topic: "조건",
    prompt:
      "B2가 비어 있으면 빈칸으로 두고, 값이 있으면 B2에 1.1을 곱한 값을 표시하시오.",
    answer: '=IF(B2="","",B2*1.1)',
    alternatives: ['=IF(ISBLANK(B2),"",B2*1.1)'],
    explanation:
      '빈 셀은 ""와 비교해 판단한다. 결과를 빈칸으로 두려면 큰따옴표 두 개를 쓴다.',
    importance: 4,
  },

  // ── 찾기·참조 (더) ─────────────────────────────────────────────
  {
    id: "f-hlookup-basic",
    minGrade: 2,
    topic: "찾기·참조",
    prompt:
      "$B$1:$G$3 표의 첫 행에서 A5의 월을 찾아, 그 열의 세 번째 행 값을 정확히 가져오시오.",
    sample: {
      headers: ["", "1월", "2월", "3월"],
      rows: [
        ["목표", "100", "120", "130"],
        ["실적", "90", "125", "128"],
      ],
    },
    answer: "=HLOOKUP(A5,$B$1:$G$3,3,0)",
    alternatives: ["=HLOOKUP(A5,$B$1:$G$3,3,FALSE)"],
    explanation:
      "월처럼 가로로 늘어선 표에서는 HLOOKUP이다. 세 번째 인수는 열이 아니라 행 번호다.",
    trap: "VLOOKUP은 열 번호, HLOOKUP은 행 번호를 센다.",
    importance: 4,
  },
  {
    id: "f-index-match-2d",
    minGrade: 1,
    topic: "찾기·참조",
    prompt:
      "$B$2:$E$10 표에서 G2의 이름(행)과 H1의 과목(열)이 만나는 칸의 값을 가져오시오. 이름은 $A$2:$A$10, 과목은 $B$1:$E$1에 있다.",
    answer:
      "=INDEX($B$2:$E$10,MATCH(G2,$A$2:$A$10,0),MATCH(H1,$B$1:$E$1,0))",
    explanation:
      "INDEX는 (범위, 행 번호, 열 번호)다. 행과 열을 각각 MATCH로 찾아 넣으면 표의 어느 칸이든 꺼낼 수 있다.",
    trap: "MATCH 두 개의 순서가 바뀌면 엉뚱한 칸이 나온다. 앞이 행, 뒤가 열이다.",
    importance: 5,
  },
  {
    id: "f-choose-weekday",
    minGrade: 2,
    topic: "찾기·참조",
    prompt: "A2의 날짜가 무슨 요일인지 \"일\"~\"토\" 한 글자로 표시하시오.",
    answer: '=CHOOSE(WEEKDAY(A2,1),"일","월","화","수","목","금","토")',
    explanation:
      "WEEKDAY의 옵션 1은 일요일이 1이므로, 그 순서대로 요일을 늘어놓으면 된다.",
    trap: "옵션을 2로 주면 월요일이 1이 되므로 늘어놓는 순서도 월요일부터여야 한다.",
    importance: 4,
  },
  {
    id: "f-index-match-left",
    minGrade: 1,
    topic: "찾기·참조",
    prompt:
      "$A$2:$C$50에서 C열의 점수가 가장 높은 행을 찾아 A열의 이름을 가져오시오.",
    answer:
      "=INDEX($A$2:$A$50,MATCH(MAX($C$2:$C$50),$C$2:$C$50,0))",
    explanation:
      "MAX로 최고점을 구하고 MATCH로 그것이 몇 번째인지 찾은 뒤 INDEX로 같은 번째의 이름을 꺼낸다.",
    importance: 4,
  },
  {
    id: "f-iferror-vlookup",
    minGrade: 2,
    topic: "찾기·참조",
    prompt:
      "A2의 사번으로 $E$2:$F$50에서 이름을 찾되, 없으면 \"미등록\"으로 표시하시오.",
    answer: '=IFERROR(VLOOKUP(A2,$E$2:$F$50,2,0),"미등록")',
    explanation:
      "찾지 못하면 #N/A가 뜨는데, 그 자리를 IFERROR로 감싸면 원하는 문구로 바꿀 수 있다.",
    trap: "IFERROR는 오류일 때만 두 번째 값을 낸다. 결과가 0이거나 빈칸인 것은 오류가 아니다.",
    importance: 5,
  },
  {
    id: "f-offset",
    minGrade: 1,
    topic: "찾기·참조",
    prompt:
      "A1 셀을 기준으로 아래로 2칸, 오른쪽으로 3칸 떨어진 셀의 값을 구하시오.",
    answer: "=OFFSET(A1,2,3)",
    explanation:
      "OFFSET(기준, 행 이동, 열 이동)이다. 아래·오른쪽이 양수, 위·왼쪽이 음수다. 기준 셀 자신은 0,0이다.",
    trap: "1칸 아래는 1이다. 기준을 포함해 세어 2를 넣으면 한 칸 더 내려간다.",
    importance: 3,
  },
  {
    id: "f-indirect",
    minGrade: 1,
    topic: "찾기·참조",
    prompt:
      "B2에 적힌 숫자(예: 5)를 행 번호로 삼아 A열의 그 행 값을 가져오시오.",
    answer: '=INDIRECT("A"&B2)',
    explanation:
      "INDIRECT는 문자로 만든 주소를 진짜 셀 참조로 바꿔 준다. \"A\"와 행 번호를 &로 이어 \"A5\" 같은 주소를 만든다.",
    trap: "따옴표를 빼고 A&B2로 쓰면 A라는 이름을 찾다가 #NAME? 오류가 난다.",
    importance: 3,
  },

  // ── 순위·통계 (더) ─────────────────────────────────────────────
  {
    id: "f-rank-asc",
    minGrade: 2,
    topic: "순위·통계",
    prompt:
      "C2의 기록이 C2:C31 안에서 몇 등인지 구하시오. 기록은 작을수록 좋은 순위다.",
    answer: "=RANK.EQ(C2,$C$2:$C$31,1)",
    alternatives: ["=RANK(C2,$C$2:$C$31,1)"],
    explanation:
      "마지막 인수가 1이면 오름차순, 즉 작은 값이 1등이다. 시간 기록처럼 작을수록 좋은 값에 쓴다.",
    trap: "0이나 생략은 내림차순(큰 값이 1등)이다. 문제가 어느 쪽인지 먼저 본다.",
    importance: 4,
  },
  {
    id: "f-small",
    minGrade: 2,
    topic: "순위·통계",
    prompt: "B2:B31에서 두 번째로 작은 값을 구하시오.",
    answer: "=SMALL(B2:B31,2)",
    explanation: "SMALL(범위, k)는 k번째로 작은 값이다. k에 1을 넣으면 MIN과 같다.",
    importance: 3,
  },
  {
    id: "f-median-mode",
    minGrade: 2,
    topic: "순위·통계",
    prompt: "B2:B31에서 가장 많이 나온 값을 구하시오.",
    answer: "=MODE.SNGL(B2:B31)",
    alternatives: ["=MODE(B2:B31)"],
    explanation:
      "최빈값은 MODE.SNGL이다. 가운데 값은 MEDIAN으로, 자료를 크기순으로 늘어놓았을 때 한가운데 오는 값이다.",
    trap: "중간값(MEDIAN)과 최빈값(MODE)을 바꿔 쓰는 실수가 잦다.",
    importance: 3,
  },
  {
    id: "f-stdev",
    minGrade: 1,
    topic: "순위·통계",
    prompt: "B2:B31 표본의 표준편차를 구하시오.",
    answer: "=STDEV.S(B2:B31)",
    alternatives: ["=STDEV(B2:B31)"],
    explanation:
      "표본이면 STDEV.S, 모집단 전체면 STDEV.P다. 분산은 VAR.S·VAR.P를 쓴다.",
    importance: 2,
  },
  {
    id: "f-top-mark",
    minGrade: 2,
    topic: "순위·통계",
    prompt:
      "B2의 점수가 B2:B31에서 상위 5위 안에 들면 \"우수\", 아니면 빈칸으로 표시하시오.",
    answer: '=IF(RANK.EQ(B2,$B$2:$B$31)<=5,"우수","")',
    alternatives: ['=IF(B2>=LARGE($B$2:$B$31,5),"우수","")'],
    explanation:
      "순위를 구해 5 이하인지 보거나, 5번째로 큰 값 이상인지를 본다. 두 방법 모두 같은 결과를 낸다.",
    importance: 4,
  },

  // ── 텍스트 ─────────────────────────────────────────────────────
  {
    id: "f-mid-find",
    minGrade: 1,
    topic: "텍스트·날짜",
    prompt:
      "A2의 문자열(예: 서울-영업1팀)에서 하이픈 뒤의 글자를 모두 뽑아내시오.",
    answer: "=MID(A2,FIND(\"-\",A2)+1,LEN(A2))",
    alternatives: ["=RIGHT(A2,LEN(A2)-FIND(\"-\",A2))"],
    explanation:
      "FIND로 하이픈이 몇 번째인지 찾고 그 다음 칸부터 끝까지 가져온다. 개수를 넉넉히(LEN) 주면 남은 글자를 모두 가져온다.",
    trap: "FIND는 대소문자를 구분하고, SEARCH는 구분하지 않는다.",
    importance: 4,
  },
  {
    id: "f-right-len",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 상품코드에서 앞 세 글자를 뺀 나머지를 모두 가져오시오.",
    answer: "=RIGHT(A2,LEN(A2)-3)",
    alternatives: ["=MID(A2,4,LEN(A2))"],
    explanation:
      "전체 길이에서 앞의 3을 뺀 만큼을 오른쪽에서 가져온다. 코드 길이가 달라도 그대로 동작한다.",
    importance: 4,
  },
  {
    id: "f-substitute",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2의 전화번호에서 하이픈(-)을 모두 없애시오.",
    answer: '=SUBSTITUTE(A2,"-","")',
    explanation:
      "SUBSTITUTE(문자열, 바꿀 것, 새 것)이다. 새 것을 빈 문자열로 주면 지우는 것이 된다.",
    trap: "REPLACE는 '몇 번째부터 몇 글자'를 자리로 바꾸고, SUBSTITUTE는 '이 글자'를 찾아 바꾼다.",
    importance: 4,
  },
  {
    id: "f-replace-mask",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 주민등록번호에서 8번째 글자부터 7글자를 \"*******\"로 가리시오.",
    answer: '=REPLACE(A2,8,7,"*******")',
    explanation:
      "REPLACE(문자열, 시작 위치, 개수, 새 문자열)이다. 자리를 지정해 바꾸므로 무엇이 있었는지 몰라도 된다.",
    importance: 4,
  },
  {
    id: "f-text-format",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 날짜를 \"2026년 08월\" 처럼 보이는 문자열로 만드시오.",
    answer: '=TEXT(A2,"yyyy년 mm월")',
    explanation:
      "TEXT는 값을 지정한 서식의 문자열로 바꾼다. 결과가 문자가 되므로 계산에는 쓸 수 없다.",
    trap: "셀 서식을 바꾸는 것과 다르다. TEXT는 값 자체를 문자로 만든다.",
    importance: 4,
  },
  {
    id: "f-upper-proper",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2의 영문 이름을 첫 글자만 대문자로 바꾸시오.",
    answer: "=PROPER(A2)",
    explanation:
      "PROPER는 낱말마다 첫 글자만 대문자로 만든다. 전부 대문자는 UPPER, 전부 소문자는 LOWER다.",
    importance: 3,
  },
  {
    id: "f-rept-star",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "B2의 값만큼 별표(★)를 반복해 표시하시오.",
    answer: '=REPT("★",B2)',
    explanation:
      "REPT(문자열, 횟수)는 문자열을 그만큼 되풀이한다. 막대그래프처럼 보이게 할 때 쓴다.",
    importance: 3,
  },
  {
    id: "f-concat-space",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt:
      "A2의 부서와 B2의 이름을 한 셀에 \"영업부 김민수\" 처럼 사이에 공백을 두고 이으시오.",
    answer: '=A2&" "&B2',
    alternatives: ['=CONCAT(A2," ",B2)', '=CONCATENATE(A2," ",B2)'],
    explanation:
      "공백도 하나의 문자이므로 큰따옴표로 감싸 사이에 끼워 넣는다.",
    importance: 4,
  },

  // ── 날짜 ───────────────────────────────────────────────────────
  {
    id: "f-eomonth",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2 날짜가 속한 달의 마지막 날을 구하시오.",
    answer: "=EOMONTH(A2,0)",
    explanation:
      "두 번째 인수는 몇 달 뒤인지다. 0이면 그 달, 1이면 다음 달의 마지막 날이다.",
    trap: "결과가 숫자로 보이면 셀 서식을 날짜로 바꿔 주어야 한다.",
    importance: 3,
  },
  {
    id: "f-workday",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2 날짜에서 주말을 뺀 10일 뒤 날짜를 구하시오.",
    answer: "=WORKDAY(A2,10)",
    explanation:
      "WORKDAY는 토·일을 건너뛰고 날짜를 센다. 세 번째 인수에 공휴일 범위를 주면 그것도 뺀다.",
    importance: 3,
  },
  {
    id: "f-networkdays",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2부터 B2까지의 근무일수(주말 제외)를 구하시오.",
    answer: "=NETWORKDAYS(A2,B2)",
    explanation:
      "시작일과 종료일을 모두 포함해 세되 토·일은 뺀다. 그냥 날짜를 빼면 주말까지 세어진다.",
    trap: "B2-A2 는 달력 일수다. 근무일수와 다르다.",
    importance: 3,
  },
  {
    id: "f-year-month",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2 날짜에서 월만 숫자로 뽑아내시오.",
    answer: "=MONTH(A2)",
    explanation:
      "YEAR·MONTH·DAY는 날짜에서 각 부분을 숫자로 꺼낸다. 반대로 숫자 셋을 날짜로 만드는 것은 DATE다.",
    importance: 3,
  },
  {
    id: "f-hour-minute",
    minGrade: 2,
    topic: "텍스트·날짜",
    prompt: "A2의 시간에서 '시'에 해당하는 숫자만 뽑아내시오.",
    answer: "=HOUR(A2)",
    explanation:
      "HOUR·MINUTE·SECOND는 시간값에서 각 부분을 숫자로 꺼낸다. 시간도 내부적으로는 하루를 1로 보는 소수다.",
    importance: 2,
  },
  {
    id: "f-edate",
    minGrade: 1,
    topic: "텍스트·날짜",
    prompt: "A2 날짜의 3개월 뒤 같은 날짜를 구하시오.",
    answer: "=EDATE(A2,3)",
    explanation:
      "EDATE는 개월 수만큼 이동한 같은 날짜를 준다. 그 달의 마지막 날을 원하면 EOMONTH다.",
    importance: 2,
  },

  // ── 수학 ───────────────────────────────────────────────────────
  {
    id: "f-mod-even",
    minGrade: 2,
    topic: "기본 계산",
    prompt:
      "B2의 숫자가 짝수이면 \"짝\", 홀수이면 \"홀\"로 표시하시오.",
    answer: '=IF(MOD(B2,2)=0,"짝","홀")',
    alternatives: ['=IF(ISEVEN(B2),"짝","홀")'],
    explanation:
      "MOD는 나머지를 준다. 2로 나눈 나머지가 0이면 짝수다. 주민번호 성별 판정에도 같은 꼴을 쓴다.",
    importance: 4,
  },
  {
    id: "f-quotient",
    minGrade: 2,
    topic: "기본 계산",
    prompt: "B2개를 3개씩 담을 때 가득 채운 상자 수를 구하시오.",
    answer: "=INT(B2/3)",
    alternatives: ["=QUOTIENT(B2,3)", "=ROUNDDOWN(B2/3,0)"],
    explanation:
      "가득 찬 상자만 세므로 소수점을 버린다. INT·QUOTIENT·ROUNDDOWN 어느 쪽이든 같다.",
    trap: "남는 것까지 담으려면 버림이 아니라 올림(ROUNDUP)이다.",
    importance: 4,
  },
  {
    id: "f-roundup-box",
    minGrade: 2,
    topic: "기본 계산",
    prompt:
      "B2개를 10개들이 상자에 모두 담으려면 상자가 몇 개 필요한지 구하시오.",
    answer: "=ROUNDUP(B2/10,0)",
    explanation:
      "하나라도 남으면 상자가 하나 더 필요하므로 무조건 올림이다. 자릿수 0은 정수 자리까지다.",
    importance: 4,
  },
  {
    id: "f-abs-diff",
    minGrade: 2,
    topic: "기본 계산",
    prompt: "B2와 C2의 차이를 부호 없이(항상 양수로) 구하시오.",
    answer: "=ABS(B2-C2)",
    explanation: "ABS는 절댓값이다. 어느 쪽이 크든 차이의 크기만 남는다.",
    importance: 3,
  },

  // ── 데이터베이스 함수 (더) ─────────────────────────────────────
  {
    id: "f-daverage",
    minGrade: 2,
    topic: "데이터베이스 함수",
    prompt:
      "A1:D31 표에서 F1:F2 조건에 맞는 행의 \"점수\" 평균을 구하시오.",
    answer: '=DAVERAGE(A1:D31,"점수",F1:F2)',
    explanation:
      "D함수는 모두 (전체 표, 대상 필드, 조건 범위) 세 칸으로 같다. 함수 이름만 바꾸면 합계·평균·개수·최대가 된다.",
    importance: 4,
  },
  {
    id: "f-dmax",
    minGrade: 2,
    topic: "데이터베이스 함수",
    prompt:
      "A1:D31 표에서 F1:G2 조건에 맞는 행의 \"실적\" 중 가장 큰 값을 구하시오.",
    answer: '=DMAX(A1:D31,"실적",F1:G2)',
    explanation:
      "조건 범위를 두 칸으로 넓게 잡으면 두 조건이 AND로 묶인다. 가장 작은 값은 DMIN이다.",
    importance: 3,
  },
  {
    id: "f-dget",
    minGrade: 1,
    topic: "데이터베이스 함수",
    prompt:
      "A1:D31 표에서 F1:F2 조건에 맞는 단 하나의 행을 찾아 \"이름\"을 가져오시오.",
    answer: '=DGET(A1:D31,"이름",F1:F2)',
    explanation:
      "DGET은 조건에 맞는 행이 정확히 하나일 때 그 값을 준다. 하나도 없으면 #VALUE!, 둘 이상이면 #NUM! 오류가 난다.",
    trap: "조건에 맞는 행이 여럿이면 오류다. 여럿을 다루려면 다른 D함수를 쓴다.",
    importance: 3,
  },

  // ── 배열 수식 (더) ─────────────────────────────────────────────
  {
    id: "f-array-average",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "A2:A31의 학과가 \"경영\"인 학생의 B2:B31 평균을 배열 수식으로 구하시오.",
    answer: '=AVERAGE(IF(A2:A31="경영",B2:B31))',
    explanation:
      "조건에 맞지 않는 자리는 FALSE가 되고 AVERAGE가 그것을 세지 않으므로, 곱셈 방식과 달리 0이 평균을 끌어내리지 않는다.",
    trap: "곱셈으로 쓰면 조건에 안 맞는 자리가 0이 되어 평균이 낮아진다. 평균은 IF 형태를 쓴다.",
    importance: 5,
  },
  {
    id: "f-array-count-multi",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "A2:A31이 \"남\"이고 B2:B31이 80 이상 90 미만인 사람의 수를 배열 수식으로 구하시오.",
    answer: '=SUM((A2:A31="남")*(B2:B31>=80)*(B2:B31<90))',
    alternatives: ['=SUMPRODUCT((A2:A31="남")*(B2:B31>=80)*(B2:B31<90))'],
    explanation:
      "조건을 계속 곱해 나가면 모두 참인 자리만 1로 남는다. 구간 조건은 이상과 미만을 따로 곱한다.",
    importance: 5,
  },
  {
    id: "f-array-min",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "A2:A31의 지역이 \"부산\"인 행 중 B2:B31의 가장 작은 값을 배열 수식으로 구하시오.",
    answer: '=MIN(IF(A2:A31="부산",B2:B31))',
    explanation:
      "최솟값에는 반드시 IF 형태를 써야 한다. 곱셈으로 쓰면 조건에 안 맞는 자리의 0이 최솟값으로 잡힌다.",
    trap: "최댓값은 곱셈으로도 대개 맞지만 최솟값은 거의 항상 0이 나온다.",
    importance: 5,
  },
  {
    id: "f-array-frequency",
    minGrade: 1,
    topic: "배열 수식",
    prompt:
      "B2:B31의 점수를 D2:D5의 구간별로 몇 개씩인지 배열 수식으로 구하시오.",
    answer: "=FREQUENCY(B2:B31,D2:D5)",
    explanation:
      "FREQUENCY(데이터, 구간)는 구간마다 개수를 한꺼번에 낸다. 결과가 여러 칸이므로 넣을 범위를 미리 잡아 두고 Ctrl+Shift+Enter로 마쳐야 한다.",
    trap: "결과 칸을 구간 수보다 하나 더 잡아야 마지막 구간을 넘는 값까지 담긴다.",
    importance: 3,
  },

  // ── 재무 (1급) ─────────────────────────────────────────────────
  {
    id: "f-fv-monthly",
    minGrade: 1,
    topic: "재무",
    prompt:
      "연이율 6%(B1)로 매월 말 50만원(B2)씩 3년(B3, 단위 년) 넣었을 때의 만기 금액을 구하시오.",
    answer: "=FV(B1/12,B3*12,-B2)",
    explanation:
      "매월 넣으므로 이율은 12로 나누고 기간은 12를 곱한다. 내 손에서 나가는 돈은 음수로 넣어야 결과가 양수로 나온다.",
    trap: "이율과 기간의 단위를 맞추지 않으면 값이 크게 틀어진다. 둘 다 '월'로 맞춘다.",
    importance: 4,
  },
  {
    id: "f-pmt-loan",
    minGrade: 1,
    topic: "재무",
    prompt:
      "연이율 5%(B1)로 3000만원(B2)을 5년(B3, 단위 년) 동안 매월 갚을 때 매달 갚을 금액을 구하시오.",
    answer: "=PMT(B1/12,B3*12,-B2)",
    explanation:
      "PMT(이율, 기간, 현재 가치)다. 빌린 돈을 음수로 넣으면 매달 갚을 금액이 양수로 나온다.",
    importance: 4,
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
