import type { ListeningSet } from "@/lib/types";

/**
 * Part 2 · 질의응답 — 추가 문항.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * 실제 시험에서 Part 2 는 25문항 — 듣기 100문항의 4분의 1이다. 그런데
 * 한 문항이 문장 하나로 끝나서, 만드는 쪽에서는 가장 적게 쓰고 넘어가기
 * 쉽다. 그렇게 두면 모의고사에서 Part 2 만 실제보다 훨씬 가볍게 지나가
 * "시험장에서 처음 겪는 파트"가 된다.
 *
 * 이 파트에서 틀리는 이유는 늘 넷 중 하나다.
 *   ① 의문사를 놓쳤다 (When 을 묻는데 장소로 답하는 선택지에 걸린다)
 *   ② 비슷한 소리에 낚였다 (work/walk, copy/coffee, mail/male)
 *   ③ 같은 단어가 반복되는 선택지를 답으로 골랐다
 *   ④ 되묻거나 모른다고 답하는 '간접 응답'을 답이 아니라고 버렸다
 * 오답마다 넷 중 무엇인지 밝혀 둔다.
 */
export const LISTENING_P2: ListeningSet[] = [
  /* ── 의문사 의문문 (What · When · Where · Who · Why · How) ── */
  {
    id: "l2-where-supplies",
    part: 2,
    band: 600,
    script: [{ speaker: "man", text: "Where do we keep the extra printer paper?" }],
    questions: [
      {
        id: "q-l2-where-supplies-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 2,
        choices: [
          {
            text: "About twice a month.",
            why: "빈도로 답했다. How often 을 물었다면 맞을 답이다 — 의문사를 놓치면 이런 선택지가 답처럼 들린다.",
          },
          {
            text: "Yes, I printed it this morning.",
            why: "의문사 의문문에 Yes 로 시작하는 답은 쓰지 않는다. print 를 되풀이해 그럴듯하게 들리게 한 오답이다.",
          },
          {
            text: "In the cabinet by the copier.",
            why: "정답. Where 에 장소로 답했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-what-time-open",
    part: 2,
    band: 600,
    script: [{ speaker: "woman", text: "What time does the branch office open?" }],
    questions: [
      {
        id: "q-l2-what-time-open-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 0,
        choices: [
          { text: "At nine on weekdays.", why: "정답. What time 에 시각으로 답했다." },
          {
            text: "On the third floor.",
            why: "장소로 답했다. branch office 라는 말에 이끌려 위치를 떠올리게 만든 오답이다.",
          },
          {
            text: "It's a new opening.",
            why: "open 의 파생어 opening 을 되풀이했을 뿐 시각을 말하지 않았다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-who-training",
    part: 2,
    band: 600,
    script: [
      { speaker: "man", text: "Who's leading the safety training on Thursday?" },
    ],
    questions: [
      {
        id: "q-l2-who-training-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 1,
        choices: [
          {
            text: "In the main auditorium.",
            why: "장소로 답했다. Who 를 놓치면 걸린다.",
          },
          {
            text: "Someone from the head office.",
            why: "정답. 이름을 대지 않고 '본사에서 오는 사람'이라고 답했다. Part 2 의 정답은 이렇게 사람을 특정하지 않는 일이 잦다.",
          },
          {
            text: "It was a very safe trip.",
            why: "safety 와 safe 의 소리를 겹쳤을 뿐 답이 아니다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-why-closed",
    part: 2,
    band: 700,
    script: [
      { speaker: "woman", text: "Why was the north entrance closed this morning?" },
    ],
    questions: [
      {
        id: "q-l2-why-closed-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "Please close it behind you.",
            why: "closed 를 close 로 되받았을 뿐이다. 같은 단어가 되풀이되는 선택지는 대개 오답이다.",
          },
          {
            text: "Sometime next week.",
            why: "시점으로 답했다. Why 에는 이유가 와야 한다.",
          },
          {
            text: "They were repaving the walkway.",
            why: "정답. 이유를 댔다. 이유를 대는 답은 Because 없이 그냥 사실을 말하는 형태가 더 흔하다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-how-long-review",
    part: 2,
    band: 700,
    script: [{ speaker: "man", text: "How long will the budget review take?" }],
    questions: [
      {
        id: "q-l2-how-long-review-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "About fifty pages.",
            why: "분량으로 답했다. How long 은 기간을 묻는데 길이로 알아들으면 이렇게 걸린다.",
          },
          { text: "A couple of days at most.", why: "정답. 기간으로 답했다." },
          {
            text: "The budget was approved.",
            why: "budget 을 되풀이했다. 질문의 핵심 낱말이 그대로 나오는 선택지를 조심한다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-how-many-attend",
    part: 2,
    band: 600,
    script: [
      { speaker: "woman", text: "How many people signed up for the seminar?" },
    ],
    questions: [
      {
        id: "q-l2-how-many-attend-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 0,
        choices: [
          { text: "Forty-two so far.", why: "정답. How many 에 수로 답했다." },
          {
            text: "I'll sign the form later.",
            why: "signed 와 sign 의 소리를 겹쳤다.",
          },
          {
            text: "It starts at two.",
            why: "시각으로 답했다. 세미나 이야기라 그럴듯하게 들리지만 묻는 것은 인원이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-what-happened-order",
    part: 2,
    band: 700,
    script: [{ speaker: "man", text: "What happened to the order we placed on Monday?" }],
    questions: [
      {
        id: "q-l2-what-happened-order-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "In alphabetical order.",
            why: "order 를 '순서'라는 다른 뜻으로 되받았다. 한 낱말의 두 뜻을 겹치는 것은 Part 2 의 단골 함정이다.",
          },
          {
            text: "Yes, on Monday morning.",
            why: "의문사 의문문에 Yes 는 오지 않는다. Monday 를 그대로 되풀이했다.",
          },
          {
            text: "It's scheduled to arrive tomorrow.",
            why: "정답. 주문이 어떻게 됐는지를 답했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-which-room",
    part: 2,
    band: 700,
    script: [
      { speaker: "woman", text: "Which conference room did you reserve for us?" },
    ],
    questions: [
      {
        id: "q-l2-which-room-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "For about an hour.",
            why: "기간으로 답했다. reserve 에서 '얼마나'를 떠올리게 만든 오답이다.",
          },
          { text: "The one next to the lobby.", why: "정답. 어느 것인지를 가려 답했다." },
          {
            text: "I have a reservation, too.",
            why: "reserve 의 파생어 reservation 을 되풀이했을 뿐이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-how-get-there",
    part: 2,
    band: 600,
    script: [{ speaker: "man", text: "How did you get to the client site yesterday?" }],
    questions: [
      {
        id: "q-l2-how-get-there-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 2,
        choices: [
          {
            text: "It went very well.",
            why: "방문이 어땠는지를 답했다. How 로 시작하지만 여기서는 수단을 묻는다.",
          },
          {
            text: "Around four o'clock.",
            why: "시각으로 답했다. yesterday 에 이끌리면 고르게 된다.",
          },
          { text: "I took the company shuttle.", why: "정답. 수단으로 답했다." },
        ],
      },
    ],
  },

  /* ── Yes/No 의문문 ── */
  {
    id: "l2-yn-received",
    part: 2,
    band: 600,
    script: [{ speaker: "woman", text: "Did you receive my message about the venue?" }],
    questions: [
      {
        id: "q-l2-yn-received-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "Yes, I read it this morning.",
            why: "정답. Yes 뒤에 무엇을 했는지를 덧붙였다. Yes/No 만 있는 답보다 이렇게 한 마디 붙는 것이 정답인 경우가 많다.",
          },
          {
            text: "The receipt is in the folder.",
            why: "receive 와 receipt 의 소리를 겹쳤다.",
          },
          {
            text: "At the downtown venue.",
            why: "venue 를 되풀이했을 뿐 받았는지에 답하지 않았다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-yn-has-left",
    part: 2,
    band: 700,
    script: [{ speaker: "man", text: "Has the shipment left the warehouse yet?" }],
    questions: [
      {
        id: "q-l2-yn-has-left-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "On the left side of the building.",
            why: "left 를 '왼쪽'이라는 다른 뜻으로 되받았다.",
          },
          {
            text: "Not until the paperwork is signed.",
            why: "정답. No 라고 말하지 않고 '서류가 서명될 때까지는 아니다'로 아직임을 밝혔다.",
          },
          {
            text: "We have plenty of warehouse space.",
            why: "warehouse 를 되풀이했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-yn-anyone-checked",
    part: 2,
    band: 800,
    script: [
      { speaker: "woman", text: "Has anyone checked whether the projector works?" },
    ],
    questions: [
      {
        id: "q-l2-yn-anyone-checked-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "Please check in at the front desk.",
            why: "checked 를 check in 으로 되받았다.",
          },
          {
            text: "Yes, I'd like a project update.",
            why: "projector 와 project 의 소리를 겹쳤다. 한 글자 차이로 뜻이 갈리는 짝이다.",
          },
          {
            text: "Ji-woo was setting it up earlier.",
            why: "정답. '누가 아까 설치하고 있었다'로 사실상 확인됐음을 알린다. Yes/No 없이 상황을 알려 주는 답이 정답인 것이 Part 2 다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-yn-still-hiring",
    part: 2,
    band: 700,
    script: [{ speaker: "man", text: "Are we still hiring for the design team?" }],
    questions: [
      {
        id: "q-l2-yn-still-hiring-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Two positions are still open.",
            why: "정답. Yes 없이 '두 자리가 아직 비어 있다'로 답을 대신했다.",
          },
          {
            text: "She was hired last spring.",
            why: "hiring 의 과거형 hired 를 되풀이했다. 시제까지 어긋난다.",
          },
          {
            text: "The design looks great.",
            why: "design 을 되풀이했다.",
          },
        ],
      },
    ],
  },

  /* ── 부정 의문문 · 부가 의문문 ── */
  {
    id: "l2-neg-didnt-you",
    part: 2,
    band: 700,
    script: [
      { speaker: "woman", text: "Didn't you order the replacement filters last week?" },
    ],
    questions: [
      {
        id: "q-l2-neg-didnt-you-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "No, they weren't very orderly.",
            why: "order 와 orderly 의 소리를 겹쳤다.",
          },
          {
            text: "I meant to, but I ran out of time.",
            why: "정답. 부정 의문문이라고 답이 달라지지 않는다 — 안 했으면 안 했다고 말하면 된다. '하려 했는데 시간이 없었다'가 그것이다.",
          },
          {
            text: "The filter is under the sink.",
            why: "filter 를 되풀이했고, 묻는 것에 답하지 않았다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-tag-isnt-it",
    part: 2,
    band: 700,
    script: [
      { speaker: "man", text: "The quarterly figures are due today, aren't they?" },
    ],
    questions: [
      {
        id: "q-l2-tag-isnt-it-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "About three quarters of them.",
            why: "quarterly 와 quarters 의 소리를 겹쳤다.",
          },
          {
            text: "Yes, they figured it out.",
            why: "figures 를 동사 figure out 으로 되받았다.",
          },
          {
            text: "Actually, the deadline moved to Friday.",
            why: "정답. 부가 의문문은 '맞죠?'라고 확인하는 말이라, 사실을 바로잡아 주는 답이 자주 정답이 된다.",
          },
        ],
      },
    ],
  },

  /* ── 선택 의문문 ── */
  {
    id: "l2-choice-print-email",
    part: 2,
    band: 700,
    script: [
      {
        speaker: "woman",
        text: "Should I print the handouts or email them to everyone?",
      },
    ],
    questions: [
      {
        id: "q-l2-choice-print-email-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "Yes, I emailed them.",
            why: "A 냐 B 냐를 묻는 선택 의문문에 Yes/No 로 답하지 않는다.",
          },
          {
            text: "Whichever is faster for you.",
            why: "정답. 둘 중 하나를 고르지 않고 상대에게 맡기는 답이다. 선택 의문문의 정답으로 자주 나온다.",
          },
          {
            text: "The printer is out of toner.",
            why: "얼핏 그럴듯하지만 어느 쪽으로 할지에 답하지 않았다. print 를 되풀이한 오답이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-choice-today-tomorrow",
    part: 2,
    band: 600,
    script: [
      {
        speaker: "man",
        text: "Would you rather meet today or tomorrow afternoon?",
      },
    ],
    questions: [
      {
        id: "q-l2-choice-today-tomorrow-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 2,
        choices: [
          {
            text: "In the meeting room.",
            why: "장소로 답했다. meet 을 되풀이한 오답이다.",
          },
          {
            text: "Yes, that works.",
            why: "선택 의문문에 Yes 는 오지 않는다.",
          },
          {
            text: "Tomorrow would be better.",
            why: "정답. 둘 중 하나를 골랐다.",
          },
        ],
      },
    ],
  },

  /* ── 요청·제안 ── */
  {
    id: "l2-req-could-you",
    part: 2,
    band: 600,
    script: [
      {
        speaker: "woman",
        text: "Could you forward me the client's contact information?",
      },
    ],
    questions: [
      {
        id: "q-l2-req-could-you-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "Sure, I'll send it right away.",
            why: "정답. 부탁에 승낙으로 답했다.",
          },
          {
            text: "He contacted me yesterday.",
            why: "contact 를 동사로 되받았다.",
          },
          {
            text: "At the front of the building.",
            why: "장소로 답했다. 부탁에 대한 답이 아니다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-req-why-dont-we",
    part: 2,
    band: 700,
    script: [
      { speaker: "man", text: "Why don't we push the launch back a week?" },
    ],
    questions: [
      {
        id: "q-l2-req-why-dont-we-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "Because the road was blocked.",
            why: "Why don't we 는 이유를 묻는 말이 아니라 제안이다. Because 로 답하면 걸린다 — 이 파트에서 가장 자주 놓치는 형태다.",
          },
          {
            text: "It launched last month.",
            why: "launch 를 되풀이했고 시제도 어긋난다.",
          },
          {
            text: "Let me check with marketing first.",
            why: "정답. 제안에 '먼저 확인해 보겠다'로 답했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-req-would-you-mind",
    part: 2,
    band: 800,
    script: [
      {
        speaker: "woman",
        text: "Would you mind covering the front desk during lunch?",
      },
    ],
    questions: [
      {
        id: "q-l2-req-would-you-mind-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 1,
        choices: [
          {
            text: "Yes, I'd be happy to.",
            why: "Would you mind 는 '꺼리십니까'라는 뜻이라 승낙은 No 쪽이다. Yes 로 답하면 거절이 되어 뒤의 말과 어긋난다.",
          },
          {
            text: "Not at all — what time?",
            why: "정답. Not at all 이 승낙이다. 이어서 시각을 되물어 자연스럽다.",
          },
          {
            text: "The lunch menu changed.",
            why: "lunch 를 되풀이했다.",
          },
        ],
      },
    ],
  },

  /* ── 평서문 ── */
  {
    id: "l2-stmt-copier-jam",
    part: 2,
    band: 700,
    script: [{ speaker: "man", text: "The copier on this floor is jammed again." }],
    questions: [
      {
        id: "q-l2-stmt-copier-jam-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "I'd like a coffee, thanks.",
            why: "copier 와 coffee 의 소리를 겹쳤다. Part 2 에서 손꼽히게 자주 나오는 짝이다.",
          },
          {
            text: "On the second floor.",
            why: "floor 를 되풀이했을 뿐, 고장 났다는 말에 대한 답이 아니다.",
          },
          {
            text: "I'll call maintenance.",
            why: "정답. 문제를 말하면 해결을 맡겠다고 답한다. 평서문 문제의 전형적인 정답이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-stmt-cant-find",
    part: 2,
    band: 700,
    script: [
      { speaker: "woman", text: "I can't find the file you mentioned yesterday." },
    ],
    questions: [
      {
        id: "q-l2-stmt-cant-find-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "It might be in the shared drive.",
            why: "정답. 못 찾겠다는 말에 어디 있을지로 답했다.",
          },
          {
            text: "Yes, I found it interesting.",
            why: "find 를 '흥미롭다'는 다른 뜻으로 되받았다.",
          },
          {
            text: "I filed it under her name.",
            why: "file 을 동사로 되받았다. 소리는 같지만 답이 되지 않는다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-stmt-running-late",
    part: 2,
    band: 600,
    script: [{ speaker: "man", text: "I'm running a little late for the briefing." }],
    questions: [
      {
        id: "q-l2-stmt-running-late-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 1,
        choices: [
          {
            text: "He runs every morning.",
            why: "running 을 '달리다'라는 뜻으로 되받았다.",
          },
          {
            text: "Don't worry, we haven't started.",
            why: "정답. 늦는다는 말에 괜찮다고 답했다.",
          },
          {
            text: "It's too late to register.",
            why: "late 를 되풀이했을 뿐이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-stmt-budget-cut",
    part: 2,
    band: 800,
    script: [
      {
        speaker: "woman",
        text: "The travel budget's been cut for the second half of the year.",
      },
    ],
    questions: [
      {
        id: "q-l2-stmt-budget-cut-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "I traveled there twice.",
            why: "travel 을 되풀이했다.",
          },
          {
            text: "Cut it in half, please.",
            why: "cut 과 half 를 그대로 되받았다. 낱말이 둘이나 겹치면 오히려 오답을 의심해야 한다.",
          },
          {
            text: "Then we'll have to do more calls online.",
            why: "정답. 예산이 깎였다는 말에 '그러면 이렇게 하자'로 이어 갔다.",
          },
        ],
      },
    ],
  },

  /* ── 간접 응답 (모른다·되묻기·제3자에게) ── */
  {
    id: "l2-indirect-ask-someone",
    part: 2,
    band: 800,
    script: [
      { speaker: "man", text: "When will the renovated lobby reopen to the public?" },
    ],
    questions: [
      {
        id: "q-l2-indirect-ask-someone-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 1,
        choices: [
          {
            text: "The lobby looks much brighter.",
            why: "lobby 를 되풀이했다. 감상은 시점에 대한 답이 아니다.",
          },
          {
            text: "Hasn't the notice been posted yet?",
            why: "정답. 되묻기로 답했다. '공지가 아직 안 붙었나요?'는 곧 '나도 거기서 봐야 안다'는 뜻이다. 800점대에서 갈리는 형태다.",
          },
          {
            text: "Yes, it was renovated last year.",
            why: "의문사 의문문에 Yes 는 오지 않는다. renovated 도 그대로 되풀이했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-indirect-dont-know",
    part: 2,
    band: 800,
    script: [
      {
        speaker: "woman",
        text: "How much did the new packaging machine cost?",
      },
    ],
    questions: [
      {
        id: "q-l2-indirect-dont-know-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Purchasing would have that figure.",
            why: "정답. 금액을 모른다고 말하는 대신 '구매팀이 알 것'이라고 넘겼다. 모른다는 답은 이렇게 다른 데를 가리키는 모습으로 나온다.",
          },
          {
            text: "It costs a lot to ship.",
            why: "cost 를 되풀이했을 뿐 금액을 말하지 않았다.",
          },
          {
            text: "In the packaging department.",
            why: "packaging 을 되풀이했고 장소로 답했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-indirect-not-decided",
    part: 2,
    band: 900,
    script: [
      { speaker: "man", text: "Which vendor did we end up going with?" },
    ],
    questions: [
      {
        id: "q-l2-indirect-not-decided-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 900,
        answer: 2,
        choices: [
          {
            text: "At the end of the hallway.",
            why: "end 를 '끝'이라는 다른 뜻으로 되받았다.",
          },
          {
            text: "They're a reliable vendor.",
            why: "vendor 를 되풀이했다. 어느 업체인지에 답하지 않았다.",
          },
          {
            text: "The contract hasn't been signed yet.",
            why: "정답. '아직 계약이 안 됐다' — 곧 정해지지 않았다는 뜻이다. 질문에 바로 답하지 않고 상황으로 답을 대신하는, 900점대에서 갈리는 형태다.",
          },
        ],
      },
    ],
  },

  /* ── 소리 함정을 정면으로 다루는 것들 ── */
  {
    id: "l2-sound-mail-male",
    part: 2,
    band: 700,
    script: [{ speaker: "woman", text: "Did the contract arrive in the mail?" }],
    questions: [
      {
        id: "q-l2-sound-mail-male-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "A male colleague dropped by.",
            why: "mail 과 male 은 소리가 같다. 뜻은 전혀 다르다.",
          },
          {
            text: "It came by courier instead.",
            why: "정답. 우편이 아니라 택배로 왔다고 답했다.",
          },
          {
            text: "Please contract them today.",
            why: "contract 를 억지로 동사처럼 썼다. 낱말만 되풀이한 오답이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-sound-fair-fare",
    part: 2,
    band: 800,
    script: [{ speaker: "man", text: "Is the train fare included in the reimbursement?" }],
    questions: [
      {
        id: "q-l2-sound-fair-fare-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "The job fair is next Tuesday.",
            why: "fare 와 fair 는 소리가 같다.",
          },
          {
            text: "I trained the new hires.",
            why: "train 을 동사로 되받았다.",
          },
          {
            text: "Only if you keep the ticket stub.",
            why: "정답. 조건을 붙여 답했다. Yes 대신 '~인 경우에만'으로 답하는 형태다.",
          },
        ],
      },
    ],
  },

  /* ── 600점대 기본기 보강 ── */
  {
    id: "l2-basic-where-park",
    part: 2,
    band: 600,
    script: [{ speaker: "woman", text: "Where can I park during the renovation?" }],
    questions: [
      {
        id: "q-l2-basic-where-park-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 0,
        choices: [
          { text: "The lot across the street is open.", why: "정답. 장소로 답했다." },
          {
            text: "It's a lovely park.",
            why: "park 를 '공원'이라는 다른 뜻으로 되받았다.",
          },
          {
            text: "For two more weeks.",
            why: "기간으로 답했다. renovation 에 이끌리면 고르게 된다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-basic-when-start",
    part: 2,
    band: 600,
    script: [{ speaker: "man", text: "When does the new policy take effect?" }],
    questions: [
      {
        id: "q-l2-basic-when-start-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 1,
        choices: [
          {
            text: "It's very effective.",
            why: "effect 와 effective 의 소리를 겹쳤다.",
          },
          { text: "Starting the first of next month.", why: "정답. 시점으로 답했다." },
          {
            text: "In the employee handbook.",
            why: "장소로 답했다. policy 라는 말에 이끌리면 그럴듯하게 들린다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-basic-who-called",
    part: 2,
    band: 600,
    script: [{ speaker: "woman", text: "Who called about the catering estimate?" }],
    questions: [
      {
        id: "q-l2-basic-who-called-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 2,
        choices: [
          {
            text: "Around three thirty.",
            why: "시각으로 답했다. called 에서 '언제'를 떠올리게 만든 오답이다.",
          },
          {
            text: "Yes, I'll call them back.",
            why: "의문사 의문문에 Yes 는 오지 않는다. call 도 되풀이했다.",
          },
          {
            text: "The manager from Bluewood.",
            why: "정답. 사람으로 답했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-basic-what-need",
    part: 2,
    band: 600,
    script: [{ speaker: "man", text: "What do I need to bring to the orientation?" }],
    questions: [
      {
        id: "q-l2-basic-what-need-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 600,
        answer: 0,
        choices: [
          {
            text: "Just a photo ID.",
            why: "정답. 무엇을 가져오면 되는지로 답했다.",
          },
          {
            text: "It was oriented to the east.",
            why: "orientation 과 oriented 의 소리를 겹쳤다.",
          },
          {
            text: "I brought mine yesterday.",
            why: "bring 의 과거형 brought 를 되풀이했다. 묻는 사람이 무엇을 가져갈지에 답하지 않았다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-basic-how-often",
    part: 2,
    band: 700,
    script: [
      { speaker: "woman", text: "How often does the elevator get inspected?" },
    ],
    questions: [
      {
        id: "q-l2-basic-how-often-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "On the top floor.",
            why: "장소로 답했다. elevator 에 이끌리면 고르게 된다.",
          },
          { text: "Twice a year, I believe.", why: "정답. 빈도로 답했다." },
          {
            text: "The inspector just left.",
            why: "inspected 의 파생어 inspector 를 되풀이했다.",
          },
        ],
      },
    ],
  },

  /* ── 700~800점대 마무리 ── */
  {
    id: "l2-mid-approval-needed",
    part: 2,
    band: 800,
    script: [
      {
        speaker: "man",
        text: "Do I need approval to order supplies over a hundred dollars?",
      },
    ],
    questions: [
      {
        id: "q-l2-mid-approval-needed-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 2,
        choices: [
          {
            text: "The supplier is in Busan.",
            why: "supplies 와 supplier 의 소리를 겹쳤다.",
          },
          {
            text: "Yes, they approved of the design.",
            why: "approval 을 approve of 로 되받았다. 뜻도 '승인'이 아니라 '마음에 들어 하다'가 됐다.",
          },
          {
            text: "Anything over fifty now goes through your manager.",
            why: "정답. Yes 대신 기준을 알려 주어 사실상 답했다. 금액까지 바로잡아 준다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-mid-who-else",
    part: 2,
    band: 800,
    script: [
      { speaker: "woman", text: "Who else should be copied on this message?" },
    ],
    questions: [
      {
        id: "q-l2-mid-who-else-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 800,
        answer: 0,
        choices: [
          {
            text: "Just the two team leads for now.",
            why: "정답. 누구를 넣을지로 답했다.",
          },
          {
            text: "I made three copies.",
            why: "copied 를 '복사하다'라는 다른 뜻으로 되받았다. 이메일의 copy 는 참조를 넣는다는 뜻이다.",
          },
          {
            text: "The message was clear.",
            why: "message 를 되풀이했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-mid-where-file",
    part: 2,
    band: 700,
    script: [
      { speaker: "man", text: "Where should I submit the expense report?" },
    ],
    questions: [
      {
        id: "q-l2-mid-where-file-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 1,
        choices: [
          {
            text: "By Friday at the latest.",
            why: "시점으로 답했다. submit 에서 '언제까지'를 떠올리게 만든 오답이다.",
          },
          {
            text: "Through the online portal now.",
            why: "정답. 어디에 내는지로 답했다. 장소가 꼭 방이나 건물이어야 하는 것은 아니다.",
          },
          {
            text: "The expenses were higher than expected.",
            why: "expense 를 되풀이했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-mid-cant-attend",
    part: 2,
    band: 700,
    script: [
      {
        speaker: "woman",
        text: "I won't be able to attend Thursday's product demo.",
      },
    ],
    questions: [
      {
        id: "q-l2-mid-cant-attend-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 2,
        choices: [
          {
            text: "The attendance was excellent.",
            why: "attend 의 파생어 attendance 를 되풀이했다.",
          },
          {
            text: "Yes, the product sells well.",
            why: "product 를 되풀이했다. 못 온다는 말에 대한 답이 아니다.",
          },
          {
            text: "I'll record it for you.",
            why: "정답. 못 온다는 말에 대신 녹화해 주겠다고 답했다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-mid-badge-broken",
    part: 2,
    band: 700,
    script: [{ speaker: "man", text: "My entry badge stopped working this morning." }],
    questions: [
      {
        id: "q-l2-mid-badge-broken-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 700,
        answer: 0,
        choices: [
          {
            text: "Security can reprogram it downstairs.",
            why: "정답. 문제를 말하면 어디서 해결하는지로 답한다.",
          },
          {
            text: "I work every morning.",
            why: "working 과 work 의 소리를 겹쳤고 morning 도 되풀이했다.",
          },
          {
            text: "It's a nice badge.",
            why: "badge 를 되풀이했을 뿐이다.",
          },
        ],
      },
    ],
  },
  {
    id: "l2-mid-two-versions",
    part: 2,
    band: 900,
    script: [
      {
        speaker: "woman",
        text: "Are these the final figures, or is another revision coming?",
      },
    ],
    questions: [
      {
        id: "q-l2-mid-two-versions-1",
        audioOnlyChoices: true,
        skill: "response",
        band: 900,
        answer: 1,
        choices: [
          {
            text: "Yes, they're revised.",
            why: "선택 의문문에 Yes 는 오지 않는다. revision 을 되풀이하기도 했다.",
          },
          {
            text: "Accounting is still closing the books.",
            why: "정답. '회계가 아직 마감 중'이라는 상황 하나로 '아직 최종본이 아니다'까지 알린다. 둘 중 하나를 말하지 않고 답하는 900점대 형태다.",
          },
          {
            text: "The final version is on page four.",
            why: "final 을 되풀이했다. 다른 문서 이야기로 새 버렸다.",
          },
        ],
      },
    ],
  },
];
