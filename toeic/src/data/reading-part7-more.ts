import type { ReadingSet } from "@/lib/types";

/**
 * Part 7 · 독해 — 추가 지문.
 *
 * 실제 시험지를 옮긴 것이 아니라, 공개된 시험 구성에 맞춰 새로 쓴 것이다.
 * (ETS 는 기출문제를 공개하지 않는다.)
 *
 * 읽기 100문항 중 54문항이 여기에 있다. 그런데 시험장에서 시간이 모자라
 * 손도 못 대고 나오는 것도 여기다. 그래서 지문 길이를 실제와 비슷하게
 * 맞췄다 — 짧게 써 두면 연습이 되지 않는다.
 *
 * 문항마다 evidence 에 **본문 어느 문장이 근거인지** 적어 둔다. Part 7 을
 * 틀리는 이유는 대개 '못 읽어서'가 아니라 '근거 아닌 문장을 근거로 삼아서'다.
 *
 * 이중·삼중 지문(passage 가 둘 이상)에는 반드시 두 지문을 함께 봐야
 * 풀리는 crossref 문항을 넣는다. 그것이 그 형식의 존재 이유다.
 */
export const READING_PART7_MORE: ReadingSet[] = [
  /* ── 단일 지문 ── */
  {
    id: "r7m-notice-elevator",
    part: 7,
    band: 600,
    docType: "notice",
    passage: [
      {
        docType: "notice",
        body: `ELEVATOR SERVICE — 4 to 8 August

Elevators 1 and 2 in the north tower will be out of service from Monday 4 August through Friday 8 August for their annual safety inspection. Elevator 3 will remain in operation throughout.

Because a single elevator will serve all fourteen floors, waits of five to ten minutes should be expected between 8:30 and 9:30 in the morning and again between 5:00 and 6:00 in the evening. Staff whose schedules allow are encouraged to arrive before 8:30.

The north stairwell is open on all floors and is the fastest option for anyone travelling three floors or fewer.

Deliveries should be routed to the south tower loading dock during this period; the north dock will be used to stage inspection equipment.

Questions may be directed to Building Services at extension 2200.`,
      },
    ],
    questions: [
      {
        id: "q-r7m-notice-elevator-1",
        prompt: "What is the purpose of the notice?",
        skill: "gist",
        band: 600,
        answer: 2,
        evidence: "Elevators 1 and 2 … will be out of service … for their annual safety inspection.",
        choices: [
          { text: "To announce a building closure", why: "건물을 닫는 것이 아니라 승강기 두 대만 멈춘다." },
          { text: "To report an elevator malfunction", why: "고장이 아니라 정기 점검이다." },
          {
            text: "To inform staff of temporary elevator closures",
            why: "정답. 첫 문단이 그대로 목적이다.",
          },
          { text: "To introduce new safety rules", why: "새 규칙을 알리는 글이 아니다." },
        ],
      },
      {
        id: "q-r7m-notice-elevator-2",
        prompt: "What are staff encouraged to do?",
        skill: "detail",
        band: 700,
        answer: 0,
        evidence: "Staff whose schedules allow are encouraged to arrive before 8:30.",
        choices: [
          {
            text: "Come to work earlier if possible",
            why: "정답. 일정이 되는 사람은 8시 30분 전에 오라고 권한다.",
          },
          { text: "Use the south tower elevators", why: "남쪽 타워 이야기는 배송에만 나온다." },
          { text: "Work from home that week", why: "재택 이야기는 없다." },
          { text: "Report delays to Building Services", why: "내선번호는 문의용이지 지연 신고용이 아니다." },
        ],
      },
      {
        id: "q-r7m-notice-elevator-3",
        prompt: "For whom is the stairwell suggested?",
        skill: "detail",
        band: 700,
        answer: 3,
        evidence: "the fastest option for anyone travelling three floors or fewer",
        choices: [
          { text: "Delivery personnel", why: "배송은 남쪽 하역장으로 보내라고 했다." },
          { text: "Inspection crews", why: "점검반 이야기는 장비를 두는 데만 나온다." },
          { text: "Anyone going to the fourteenth floor", why: "14층은 계단으로 갈 거리가 아니다." },
          {
            text: "People moving a few floors",
            why: "정답. 세 층 이내면 계단이 가장 빠르다고 했다.",
          },
        ],
      },
    ],
  },
  {
    id: "r7m-article-bakery",
    part: 7,
    band: 700,
    docType: "article",
    passage: [
      {
        docType: "article",
        header: [
          { label: "Publication", value: "Ridgeway Business Weekly" },
          { label: "Date", value: "3 March" },
        ],
        body: `Small Bakery Finds Growth in an Unlikely Place

When Nadia Farouk opened Sesame & Salt six years ago, she assumed her customers would be neighbors buying bread on their way home. For the first two years, that was true, and the shop barely covered its rent.

The change came from a direction she had not planned for. In 2023, a nearby hotel asked whether she could supply breakfast pastries for its guests. Ms. Farouk agreed, though it meant starting her day at three in the morning. Within a year, four more hotels and two cafés had signed on, and wholesale accounted for more than half of the bakery's revenue.

"I spent two years trying to get more people through the front door," she said. "It turned out the growth was in the back."

That shift required investment. Ms. Farouk took out a loan for a second oven and hired three overnight bakers. She also stopped selling sandwiches, a decision she says was harder than it sounds. "They sold well. But they took the same oven space as forty croissants, and the croissants were spoken for before they came out."

Sesame & Salt now employs eleven people, up from three. The retail counter remains open, though it accounts for a shrinking share of sales. Ms. Farouk says she has no plans to close it. "That counter is where people find out we exist," she said. "The hotels found me because someone bought a loaf here first."`,
      },
    ],
    questions: [
      {
        id: "q-r7m-article-bakery-1",
        prompt: "What is the article mainly about?",
        skill: "gist",
        band: 700,
        answer: 1,
        evidence: "the growth was in the back — 도매로 사업의 축이 옮겨 간 이야기",
        choices: [
          { text: "A bakery's plan to open new locations", why: "지점 확장 이야기는 나오지 않는다." },
          {
            text: "How a bakery grew by supplying other businesses",
            why: "정답. 호텔·카페 납품이 매출의 절반을 넘겼다는 것이 글의 축이다.",
          },
          { text: "The rising cost of baking ingredients", why: "재료비 이야기는 없다." },
          { text: "A neighborhood's changing population", why: "동네 인구 이야기는 없다." },
        ],
      },
      {
        id: "q-r7m-article-bakery-2",
        prompt: "Why did Ms. Farouk stop selling sandwiches?",
        skill: "detail",
        band: 800,
        answer: 3,
        evidence: "they took the same oven space as forty croissants, and the croissants were spoken for",
        choices: [
          { text: "They did not sell well.", why: "잘 팔렸다고 본인이 말한다. 정면으로 반대되는 오답이다." },
          { text: "Customers complained about the price.", why: "가격 불만 이야기는 없다." },
          { text: "She could not hire enough staff.", why: "인력은 오히려 늘렸다." },
          {
            text: "They used oven space needed for orders already placed.",
            why: "정답. 같은 오븐 자리에 크루아상 마흔 개가 들어가고, 그것은 이미 주문이 잡혀 있었다.",
          },
        ],
      },
      {
        id: "q-r7m-article-bakery-3",
        prompt: "Why does Ms. Farouk keep the retail counter open?",
        skill: "inference",
        band: 800,
        answer: 0,
        evidence: "That counter is where people find out we exist … The hotels found me because someone bought a loaf here first.",
        choices: [
          {
            text: "It brings in the wholesale customers.",
            why: "정답. 호텔이 그를 알게 된 것도 누군가 매장에서 빵을 샀기 때문이다. 매출이 아니라 '알려지는 통로'로서 남긴다.",
          },
          { text: "It is the most profitable part of the business.", why: "매출 비중은 오히려 줄고 있다고 했다." },
          { text: "The lease requires it.", why: "임대 조건 이야기는 없다." },
          { text: "It was her original business plan.", why: "처음 계획이었던 것은 맞지만, 지금 유지하는 이유로 밝힌 것은 다른 것이다." },
        ],
      },
      {
        id: "q-r7m-article-bakery-4",
        prompt: "The word \"spoken for\" in paragraph 4 is closest in meaning to",
        skill: "vocab-incontext",
        band: 800,
        answer: 2,
        evidence: "the croissants were spoken for before they came out",
        choices: [
          { text: "discussed", why: "'말해지다'라는 글자 뜻에 끌린 오답이다." },
          { text: "advertised", why: "광고 이야기가 아니다." },
          {
            text: "already reserved",
            why: "정답. 나오기도 전에 임자가 정해져 있었다는 뜻이다. 문맥상 의미 문제는 이렇게 글자 뜻과 다른 자리를 묻는다.",
          },
          { text: "recommended", why: "추천받았다는 뜻이 아니다." },
        ],
      },
    ],
  },
  {
    id: "r7m-chat-shift-swap",
    part: 7,
    band: 700,
    docType: "chat",
    passage: [
      {
        docType: "chat",
        body: `Renata Silva (2:14 P.M.)
Is anyone able to take my Saturday evening shift? Something came up.

Tomas Weber (2:16 P.M.)
I could, but I'm already on the schedule for Saturday morning. Would that be a problem?

Renata Silva (2:17 P.M.)
Let me check the handbook. I think there's a rule about doubles.

Priya Anand (2:19 P.M.)
There is — you can't work more than ten hours in a day without a manager's sign-off. Morning plus evening would be twelve.

Tomas Weber (2:20 P.M.)
That settles it, then.

Priya Anand (2:21 P.M.)
I'm free Saturday evening. I've only got Sunday this week.

Renata Silva (2:22 P.M.)
That would save me. Do you want to message Dae-ho or should I?

Priya Anand (2:23 P.M.)
I'll do it. He usually wants it in writing from whoever's picking it up.`,
      },
    ],
    questions: [
      {
        id: "q-r7m-chat-shift-swap-1",
        prompt: "What is Ms. Silva trying to do?",
        skill: "gist",
        band: 600,
        answer: 1,
        evidence: "Is anyone able to take my Saturday evening shift?",
        choices: [
          { text: "Request time off for a vacation", why: "휴가 이야기가 아니라 하루 근무 교대다." },
          {
            text: "Find someone to cover a shift",
            why: "정답. 첫 줄 그대로다.",
          },
          { text: "Change the store's hours", why: "영업 시간 이야기는 없다." },
          { text: "Report a scheduling error", why: "일정 오류가 아니다." },
        ],
      },
      {
        id: "q-r7m-chat-shift-swap-2",
        prompt: "At 2:20 P.M., what does Mr. Weber most likely mean when he writes, \"That settles it, then\"?",
        skill: "intent",
        band: 800,
        answer: 2,
        evidence: "you can't work more than ten hours in a day … Morning plus evening would be twelve.",
        choices: [
          { text: "He will ask the manager for approval.", why: "승인을 받아 보겠다는 말이 아니다. 곧바로 다른 사람이 나선다." },
          { text: "He agrees to work both shifts.", why: "정반대다." },
          {
            text: "He cannot take the shift.",
            why: "정답. 바로 앞에서 '하루 10시간을 넘길 수 없는데 12시간이 된다'는 규정이 나왔다. 그래서 '그럼 안 되겠다'는 뜻이다.",
          },
          { text: "He thinks the rule should be changed.", why: "규정을 두고 의견을 말한 것이 아니다." },
        ],
      },
      {
        id: "q-r7m-chat-shift-swap-3",
        prompt: "What will Ms. Anand do next?",
        skill: "detail",
        band: 700,
        answer: 3,
        evidence: "I'll do it. He usually wants it in writing from whoever's picking it up.",
        choices: [
          { text: "Work on Sunday instead", why: "일요일은 원래 그의 근무일이다." },
          { text: "Check the employee handbook", why: "규정은 이미 그가 알려 주었다." },
          { text: "Ask Mr. Weber to trade shifts", why: "베버는 못 하기로 정리됐다." },
          {
            text: "Notify the manager in writing",
            why: "정답. 대호에게 자기가 알리겠다고 했고, 맡는 사람이 글로 알리는 것이 관례라고 덧붙인다.",
          },
        ],
      },
    ],
  },
  {
    id: "r7m-email-complaint",
    part: 7,
    band: 700,
    docType: "email",
    passage: [
      {
        docType: "email",
        header: [
          { label: "To", value: "support@vantagesound.com" },
          { label: "From", value: "h.oyelaran@mailbox.net" },
          { label: "Subject", value: "Order 88-4192 — wrong item" },
          { label: "Date", value: "17 June" },
        ],
        body: `To whom it may concern,

On 9 June I ordered a pair of VS-40 studio headphones from your website. The package arrived yesterday, but it contains the VS-30 model instead. The packing slip lists the VS-40, so I assume this was a picking error rather than a substitution.

I would like the correct model sent out. I do not need a refund, and I would rather not wait for the return to be processed before the replacement ships — I need the headphones for a recording session on 28 June.

I have kept the VS-30 in its original box and have not removed the protective film. I am happy to drop it at a carrier location once you send a return label.

One more thing: your website's order page still shows this order as "Preparing to ship," which is why I did not contact you sooner. You may want to look into that.

Regards,
Hakeem Oyelaran`,
      },
    ],
    questions: [
      {
        id: "q-r7m-email-complaint-1",
        prompt: "Why did Mr. Oyelaran write the e-mail?",
        skill: "gist",
        band: 600,
        answer: 0,
        evidence: "it contains the VS-30 model instead … I would like the correct model sent out.",
        choices: [
          {
            text: "He received the wrong product.",
            why: "정답. 다른 모델이 왔으니 맞는 것을 보내 달라는 것이 용건이다.",
          },
          { text: "His order never arrived.", why: "어제 도착했다고 밝혔다." },
          { text: "He wants to cancel an order.", why: "취소가 아니라 교체를 원한다." },
          { text: "A product was damaged in shipping.", why: "파손 이야기는 없다." },
        ],
      },
      {
        id: "q-r7m-email-complaint-2",
        prompt: "What does Mr. Oyelaran specifically ask the company NOT to do?",
        skill: "detail",
        band: 800,
        answer: 2,
        evidence: "I would rather not wait for the return to be processed before the replacement ships",
        choices: [
          { text: "Send a return label", why: "반품 라벨은 오히려 보내 달라고 한다." },
          { text: "Contact him by phone", why: "연락 방법 이야기는 없다." },
          {
            text: "Delay the replacement until the return is handled",
            why: "정답. 반품 처리를 기다렸다가 보내지는 말아 달라고 못 박는다. 28일 녹음 일정이 이유다.",
          },
          { text: "Charge him for shipping", why: "배송비 이야기는 나오지 않는다." },
        ],
      },
      {
        id: "q-r7m-email-complaint-3",
        prompt: "What does Mr. Oyelaran suggest is a problem on the website?",
        skill: "detail",
        band: 700,
        answer: 1,
        evidence: "your website's order page still shows this order as \"Preparing to ship\"",
        choices: [
          { text: "The wrong model is listed for sale.", why: "상품 목록 오류 이야기가 아니다." },
          {
            text: "The order status is not up to date.",
            why: "정답. 이미 받았는데도 '발송 준비 중'으로 떠 있다.",
          },
          { text: "Prices are shown incorrectly.", why: "가격 이야기는 없다." },
          { text: "The return policy is unclear.", why: "반품 규정 이야기는 없다." },
        ],
      },
      {
        id: "q-r7m-email-complaint-4",
        prompt: "What is indicated about the VS-30 headphones?",
        skill: "detail",
        band: 700,
        answer: 3,
        evidence: "I have kept the VS-30 in its original box and have not removed the protective film.",
        choices: [
          { text: "They are defective.", why: "고장 이야기는 없다. 다만 주문한 모델이 아닐 뿐이다." },
          { text: "They cost less than the VS-40.", why: "가격 비교는 나오지 않는다." },
          { text: "They were already returned.", why: "라벨을 받으면 보내겠다고 했다. 아직 갖고 있다." },
          {
            text: "They have not been used.",
            why: "정답. 상자 그대로이고 보호 필름도 떼지 않았다.",
          },
        ],
      },
    ],
  },
  {
    id: "r7m-form-warranty",
    part: 7,
    band: 600,
    docType: "form",
    passage: [
      {
        docType: "form",
        body: `KELVARE APPLIANCES — LIMITED WARRANTY

Coverage period
· Parts and labor: 24 months from date of purchase
· Compressor (refrigerators only): 60 months from date of purchase

What is covered
Defects in materials or workmanship under normal household use.

What is not covered
· Damage from improper installation, including installation by anyone other than a Kelvare-authorized technician
· Cosmetic damage such as scratches or dents
· Products used in commercial settings
· Consumable parts (filters, bulbs, seals)

How to make a claim
Call 1-800-555-0177 with your model number and the original receipt. Claims cannot be processed without proof of purchase; a credit card statement is not sufficient. A technician will be scheduled within three business days.

Note: Registering your product at kelvare.com/register extends parts-and-labor coverage by six months at no cost. Registration must be completed within thirty days of purchase.`,
      },
    ],
    questions: [
      {
        id: "q-r7m-form-warranty-1",
        prompt: "What is NOT covered by the warranty?",
        skill: "detail",
        band: 600,
        answer: 2,
        evidence: "Cosmetic damage such as scratches or dents",
        choices: [
          { text: "A defective compressor after two years", why: "냉장고 압축기는 60개월까지 보장된다." },
          { text: "A faulty part in the first year", why: "부품은 24개월간 보장된다." },
          {
            text: "A scratch on the door",
            why: "정답. 긁힘·찌그러짐 같은 외관 손상은 제외 목록에 있다.",
          },
          { text: "Labor costs in the first year", why: "공임도 24개월간 포함된다." },
        ],
      },
      {
        id: "q-r7m-form-warranty-2",
        prompt: "What is required to make a claim?",
        skill: "detail",
        band: 700,
        answer: 1,
        evidence: "Claims cannot be processed without proof of purchase; a credit card statement is not sufficient.",
        choices: [
          { text: "A credit card statement", why: "카드 명세서로는 안 된다고 못 박았다 — 굳이 적어 둔 문장이 곧 문제가 된다." },
          {
            text: "The original receipt",
            why: "정답. 모델 번호와 원본 영수증이 있어야 한다.",
          },
          { text: "A technician's report", why: "기사는 접수 뒤에 배정된다." },
          { text: "Online registration", why: "등록은 기간을 늘려 줄 뿐 접수 요건이 아니다." },
        ],
      },
      {
        id: "q-r7m-form-warranty-3",
        prompt: "How can a customer extend the coverage period?",
        skill: "detail",
        band: 700,
        answer: 3,
        evidence: "Registering your product … extends parts-and-labor coverage by six months … within thirty days of purchase.",
        choices: [
          { text: "By paying an additional fee", why: "무료라고 밝혔다." },
          { text: "By using an authorized technician", why: "공인 기사는 설치 관련 제외 조항에 나온다." },
          { text: "By purchasing a service plan", why: "별도 상품 이야기는 없다." },
          {
            text: "By registering the product within a month of purchase",
            why: "정답. 30일 안에 등록하면 6개월이 더 붙는다.",
          },
        ],
      },
    ],
  },
  {
    id: "r7m-review-restaurant",
    part: 7,
    band: 800,
    docType: "review",
    passage: [
      {
        docType: "review",
        body: `Posted by M. Tanaka — ★★★☆☆

I have been going to Harbour Table for about four years, usually for lunch, and I have recommended it more times than I can count. So I write this with some reluctance.

The food is as good as it ever was. The braised short rib is still the best thing on the menu, and the bread is still baked in-house. Nothing has slipped there.

What has changed is the pace. Since the dining room expanded in the spring, the kitchen appears to be serving nearly twice the number of tables with, as far as I can tell, the same staff. On my last two visits, the gap between courses ran past thirty minutes. Both times the server apologized without being asked, which tells me the staff know it and are not happy about it either.

I would still send a friend here for dinner, when an unhurried meal is the point. I can no longer send a colleague here on a one-hour lunch break, which is what I used to do most often.

If the owners are reading: the expansion was not the mistake. Not staffing for it was.`,
      },
    ],
    questions: [
      {
        id: "q-r7m-review-restaurant-1",
        prompt: "What is the reviewer's main complaint?",
        skill: "gist",
        band: 800,
        answer: 3,
        evidence: "What has changed is the pace … the gap between courses ran past thirty minutes.",
        choices: [
          { text: "The food quality has declined.", why: "음식은 예전 그대로라고 두 번이나 못 박는다." },
          { text: "The prices have increased.", why: "가격 이야기는 나오지 않는다." },
          { text: "The staff are unfriendly.", why: "오히려 직원이 먼저 사과했다고 좋게 적었다." },
          {
            text: "Service has become too slow.",
            why: "정답. 코스 사이가 30분을 넘었다는 것이 불만의 전부다.",
          },
        ],
      },
      {
        id: "q-r7m-review-restaurant-2",
        prompt: "What does the reviewer suggest caused the problem?",
        skill: "inference",
        band: 800,
        answer: 0,
        evidence: "serving nearly twice the number of tables with … the same staff / Not staffing for it was.",
        choices: [
          {
            text: "The restaurant did not hire more workers after expanding.",
            why: "정답. 마지막 줄에서 '확장이 잘못이 아니라 인원을 안 늘린 것이 잘못'이라고 못 박는다.",
          },
          { text: "The kitchen changed its menu.", why: "메뉴는 그대로다." },
          { text: "The new dining room is too small.", why: "오히려 넓혔다." },
          { text: "The owners rarely visit.", why: "주인이 자주 오는지는 언급되지 않는다." },
        ],
      },
      {
        id: "q-r7m-review-restaurant-3",
        prompt: "For what occasion would the reviewer still recommend the restaurant?",
        skill: "detail",
        band: 800,
        answer: 2,
        evidence: "I would still send a friend here for dinner, when an unhurried meal is the point.",
        choices: [
          { text: "A quick weekday lunch", why: "한 시간짜리 점심에는 더는 못 보내겠다고 했다 — 정확히 반대다." },
          { text: "A large group celebration", why: "단체 이야기는 없다." },
          {
            text: "A leisurely dinner",
            why: "정답. 서두르지 않아도 되는 저녁이라면 여전히 권하겠다고 한다.",
          },
          { text: "A business meeting", why: "동료와의 점심은 이제 어렵다고 했다." },
        ],
      },
      {
        id: "q-r7m-review-restaurant-4",
        prompt: "Why does the reviewer mention the server's apology?",
        skill: "inference",
        band: 900,
        answer: 1,
        evidence: "Both times the server apologized without being asked, which tells me the staff know it",
        choices: [
          { text: "To complain about the server's manner", why: "직원을 탓하는 것이 아니다." },
          {
            text: "To show that the staff are aware of the problem",
            why: "정답. 묻지도 않았는데 사과했다는 것은 직원들도 알고 있다는 뜻이라고 본인이 밝힌다.",
          },
          { text: "To explain why he left a low rating", why: "별점의 이유는 속도 자체다." },
          { text: "To request a refund", why: "환불 이야기는 없다." },
        ],
      },
    ],
  },
  {
    id: "r7m-schedule-workshop",
    part: 7,
    band: 600,
    docType: "schedule",
    passage: [
      {
        docType: "schedule",
        body: `MERIDIAN LIBRARY — FREE DIGITAL SKILLS WORKSHOPS, MARCH

All sessions are held in Meeting Room B unless noted. Registration is required; call 555-0190 or sign up at the front desk.

Tue 4 March, 10:00–11:30 — Getting Started with E-mail
For absolute beginners. Bring your own device or use one of ours.

Thu 6 March, 18:00–20:00 — Online Banking Safely
Covers recognizing fraudulent messages. Held in the Computer Lab.

Sat 8 March, 14:00–16:00 — Video Calls with Family
Held in Meeting Room A due to expected attendance.

Tue 11 March, 10:00–11:30 — Getting Started with E-mail (repeat)

Thu 13 March, 18:00–19:30 — Organizing Photos on Your Phone

Note: The 6 March session has limited seating (12 people) because of lab capacity. If it fills, a second date will be added in April. Participants who attend three or more workshops receive a certificate of completion.`,
      },
    ],
    questions: [
      {
        id: "q-r7m-schedule-workshop-1",
        prompt: "Which session is offered twice?",
        skill: "detail",
        band: 600,
        answer: 0,
        evidence: "Tue 11 March … Getting Started with E-mail (repeat)",
        choices: [
          {
            text: "Getting Started with E-mail",
            why: "정답. 4일과 11일에 같은 강좌가 열린다.",
          },
          { text: "Online Banking Safely", why: "6일 한 번뿐이고, 차면 4월에 추가한다고만 했다." },
          { text: "Video Calls with Family", why: "8일 한 번뿐이다." },
          { text: "Organizing Photos on Your Phone", why: "13일 한 번뿐이다." },
        ],
      },
      {
        id: "q-r7m-schedule-workshop-2",
        prompt: "Why is the 6 March session limited to twelve people?",
        skill: "detail",
        band: 700,
        answer: 2,
        evidence: "limited seating (12 people) because of lab capacity",
        choices: [
          { text: "It is the most popular session.", why: "인기 때문이라는 말은 없다. 인원이 몰릴 것으로 본 것은 8일 강좌다." },
          { text: "It requires personal devices.", why: "기기 이야기는 4일 강좌에 나온다." },
          {
            text: "The room where it is held is small.",
            why: "정답. 컴퓨터실 수용 인원 때문이다.",
          },
          { text: "It lasts longer than the others.", why: "시간이 이유로 언급되지 않는다." },
        ],
      },
      {
        id: "q-r7m-schedule-workshop-3",
        prompt: "How can a participant earn a certificate?",
        skill: "detail",
        band: 700,
        answer: 1,
        evidence: "Participants who attend three or more workshops receive a certificate of completion.",
        choices: [
          { text: "By passing a test", why: "시험 이야기는 없다." },
          {
            text: "By attending at least three workshops",
            why: "정답. 세 번 이상 들으면 수료증이 나온다.",
          },
          { text: "By registering in advance", why: "등록은 모든 강좌의 기본 조건이다." },
          { text: "By volunteering at the library", why: "봉사 이야기는 없다." },
        ],
      },
    ],
  },
  {
    id: "r7m-ad-storage",
    part: 7,
    band: 700,
    docType: "advertisement",
    passage: [
      {
        docType: "advertisement",
        body: `CLEARPATH SELF STORAGE — Now open in Bramley

Unit sizes and monthly rates
· 5 × 5 ft (locker) — £28
· 5 × 10 ft — £46
· 10 × 10 ft — £79
· 10 × 20 ft (vehicle) — £142

Every unit includes 24-hour gated access, individual door alarms, and climate control. There is no charge for the first padlock.

Opening offer: the second month is free on any unit rented before 30 April. This offer cannot be combined with the student discount.

Students: 15% off every month with a valid enrolment card, available year-round.

Businesses storing inventory should ask about our pallet racking service, which is quoted separately.

No deposit is required, but we do ask for one month's notice before you move out. Move out with less notice and the following month is charged in full.

Visit us at 14 Ferrers Road or call 555-0133.`,
      },
    ],
    questions: [
      {
        id: "q-r7m-ad-storage-1",
        prompt: "What is included with every unit?",
        skill: "detail",
        band: 600,
        answer: 3,
        evidence: "Every unit includes 24-hour gated access, individual door alarms, and climate control.",
        choices: [
          { text: "Pallet racking", why: "팰릿 랙은 따로 견적을 받는 별도 서비스다." },
          { text: "A moving van", why: "차량 제공 이야기는 없다." },
          { text: "Insurance", why: "보험 이야기는 나오지 않는다." },
          {
            text: "Temperature control",
            why: "정답. climate control 이 모든 유닛에 들어간다.",
          },
        ],
      },
      {
        id: "q-r7m-ad-storage-2",
        prompt: "What is true about the opening offer?",
        skill: "detail",
        band: 800,
        answer: 1,
        evidence: "This offer cannot be combined with the student discount.",
        choices: [
          { text: "It applies only to the largest units.", why: "'any unit' 이므로 모든 크기에 적용된다." },
          {
            text: "It cannot be used together with the student discount.",
            why: "정답. 굳이 한 줄 적어 둔 조건이 그대로 문제가 됐다.",
          },
          { text: "It requires a one-year contract.", why: "계약 기간 조건은 없다." },
          { text: "It is available all year.", why: "1년 내내인 것은 학생 할인이다. 개업 혜택은 4월 30일까지다." },
        ],
      },
      {
        id: "q-r7m-ad-storage-3",
        prompt: "What happens if a customer leaves without enough notice?",
        skill: "detail",
        band: 700,
        answer: 2,
        evidence: "Move out with less notice and the following month is charged in full.",
        choices: [
          { text: "The deposit is kept.", why: "보증금 자체가 없다." },
          { text: "A cleaning fee is added.", why: "청소비 이야기는 없다." },
          {
            text: "They are billed for another full month.",
            why: "정답. 통보가 늦으면 다음 달치가 그대로 청구된다.",
          },
          { text: "They lose the student discount.", why: "학생 할인과는 무관하다." },
        ],
      },
    ],
  },

  /* ── 이중 지문 ── */
  {
    id: "r7m-double-conference-room",
    part: 7,
    band: 800,
    docType: "email",
    passage: [
      {
        docType: "notice",
        header: [{ label: "Posted", value: "Meeting room booking rules — revised 1 February" }],
        body: `MEETING ROOM BOOKING — HEADQUARTERS

1. Rooms may be booked up to four weeks in advance through the intranet calendar.
2. Bookings of more than three hours require approval from a department head.
3. Rooms held but not used within fifteen minutes of the start time are released automatically.
4. The Atrium Room (capacity 60) is reserved for client-facing events. Internal meetings should use Rooms 3A, 3B, or 4C.
5. Catering must be arranged at least two business days beforehand. Same-day requests cannot be accepted.

Questions: office.services@lindqvist-group.com`,
      },
      {
        docType: "email",
        header: [
          { label: "To", value: "office.services@lindqvist-group.com" },
          { label: "From", value: "b.nakamura@lindqvist-group.com" },
          { label: "Subject", value: "Booking for 19 March" },
          { label: "Date", value: "17 March" },
        ],
        body: `Hello,

I would like to book a room for Thursday 19 March, from 9:00 to 13:00. This is our half-yearly planning session — twenty-two people, all internal.

Two questions. First, I have already secured written approval from our department head, Ms. Halvorsen, and can forward it. Second, we would like sandwiches brought in around noon.

I did try to book the Atrium Room since it is the only one I know of that seats more than twenty, but the calendar would not let me select it.

Thank you,
Bo Nakamura`,
      },
    ],
    questions: [
      {
        id: "q-r7m-double-conference-room-1",
        prompt: "Why was Mr. Nakamura unable to book the Atrium Room?",
        skill: "crossref",
        band: 800,
        answer: 2,
        evidence: "규칙 4번 + 메일의 'all internal' — 두 지문을 함께 봐야 답이 나온다",
        choices: [
          { text: "It was already reserved.", why: "이미 예약됐다는 말은 어디에도 없다." },
          { text: "It is too small for his group.", why: "정원 60명으로 22명에게 충분하다." },
          {
            text: "It is only for meetings with clients.",
            why: "정답. 규칙 4번이 아트리움을 고객 대상 행사 전용으로 정해 두었고, 그의 회의는 전원 내부 인원이다. 규칙만 봐도, 메일만 봐도 풀리지 않는다.",
          },
          { text: "He booked it too late.", why: "예약 시점이 아니라 용도가 문제다." },
        ],
      },
      {
        id: "q-r7m-double-conference-room-2",
        prompt: "What problem will Mr. Nakamura's catering request most likely face?",
        skill: "crossref",
        band: 800,
        answer: 0,
        evidence: "규칙 5번(영업일 2일 전) + 메일 날짜 17일, 행사 19일",
        choices: [
          {
            text: "It was made too late.",
            why: "정답. 17일에 보내면서 19일 점심을 부탁했다. 규칙은 영업일 기준 이틀 전이라 아슬아슬하게 늦다. 날짜 계산을 시키는 이중 지문의 전형이다.",
          },
          { text: "Sandwiches are not offered.", why: "메뉴 제한 이야기는 없다." },
          { text: "Catering requires department approval.", why: "승인이 필요한 것은 3시간 넘는 예약이다." },
          { text: "Noon deliveries are not permitted.", why: "시간대 제한은 없다." },
        ],
      },
      {
        id: "q-r7m-double-conference-room-3",
        prompt: "Why did Mr. Nakamura mention Ms. Halvorsen?",
        skill: "crossref",
        band: 800,
        answer: 1,
        evidence: "규칙 2번(3시간 초과는 부서장 승인) + 9:00–13:00 은 4시간",
        choices: [
          { text: "She will attend the session.", why: "참석 여부는 언급되지 않는다." },
          {
            text: "His booking is longer than three hours.",
            why: "정답. 9시부터 1시까지 네 시간이라 부서장 승인이 필요하고, 그래서 미리 받아 두었다고 밝힌 것이다.",
          },
          { text: "She approved the catering budget.", why: "예산 승인 이야기가 아니다." },
          { text: "She booked the room for him.", why: "예약은 본인이 시도했다." },
        ],
      },
      {
        id: "q-r7m-double-conference-room-4",
        prompt: "Which room would be suitable for Mr. Nakamura's meeting?",
        skill: "inference",
        band: 900,
        answer: 3,
        evidence: "규칙 4번이 내부 회의용으로 3A·3B·4C 를 지정한다",
        choices: [
          { text: "The Atrium Room", why: "고객 대상 행사 전용이다." },
          { text: "No room is available.", why: "내부 회의용 방이 세 개 지정돼 있다." },
          { text: "A room must be booked off-site.", why: "외부 대관 이야기는 없다." },
          {
            text: "Room 3A, 3B, or 4C",
            why: "정답. 규칙이 내부 회의는 이 셋을 쓰라고 정해 두었다. 다만 22명이 들어가는지는 어느 지문에도 없어, 답할 수 있는 것은 '이 셋 중에서'까지다.",
          },
        ],
      },
    ],
  },
  {
    id: "r7m-double-job-posting",
    part: 7,
    band: 800,
    docType: "advertisement",
    passage: [
      {
        docType: "advertisement",
        body: `TIDEWATER PUBLISHING — Production Editor (Cape Town)

Tidewater Publishing seeks a Production Editor to manage the schedule for approximately twenty titles per year, from manuscript hand-off through printer delivery.

Responsibilities
· Build and maintain production schedules
· Coordinate with freelance copyeditors, designers, and proofreaders
· Review proofs at each stage and log corrections
· Track per-title budgets and flag overruns

Requirements
· Three or more years in book or journal production
· Experience with at least one project management system
· Familiarity with print specifications (paper stock, binding, trim size)

Preferred
· Experience with academic or reference titles
· Working knowledge of a second language

Applications close 22 August. Send a CV and a brief cover note to careers@tidewaterpub.co.za. Shortlisted candidates will be asked to complete a short scheduling exercise before the interview.`,
      },
      {
        docType: "email",
        header: [
          { label: "To", value: "careers@tidewaterpub.co.za" },
          { label: "From", value: "l.moyo@quicksend.net" },
          { label: "Subject", value: "Production Editor application" },
          { label: "Date", value: "14 August" },
        ],
        body: `Dear Hiring Team,

Please find my CV attached for the Production Editor position.

For the past five years I have managed production at Kestrel Academic, where I handled between eighteen and twenty-five titles a year — almost all of them reference works with heavy figure and table content. I built our schedules in Farrow, and before that in a spreadsheet system I inherited and eventually replaced.

I work daily with freelancers and have run tenders for two of our regular printers, so paper stock and binding decisions are familiar ground. I read and write Portuguese, which has been useful for our Mozambique co-editions.

I should mention that I am on leave from 25 August to 3 September. If a scheduling exercise is part of the process, I would be glad to complete it before I go.

Kind regards,
Lindiwe Moyo`,
      },
    ],
    questions: [
      {
        id: "q-r7m-double-job-posting-1",
        prompt: "What is a requirement for the position?",
        skill: "detail",
        band: 700,
        answer: 1,
        evidence: "Three or more years in book or journal production",
        choices: [
          { text: "A second language", why: "우대 사항이지 필수가 아니다. 필수와 우대를 뒤섞는 것이 이 형식의 단골이다." },
          {
            text: "At least three years of production experience",
            why: "정답. 요건 목록의 첫 줄이다.",
          },
          { text: "Experience with academic titles", why: "역시 우대 사항이다." },
          { text: "A degree in publishing", why: "학위 요건은 없다." },
        ],
      },
      {
        id: "q-r7m-double-job-posting-2",
        prompt: "What preferred qualification does Ms. Moyo have?",
        skill: "crossref",
        band: 800,
        answer: 3,
        evidence: "공고의 Preferred 두 줄 + 메일의 'reference works' 와 'Portuguese'",
        choices: [
          { text: "Neither of them", why: "둘 다 갖췄다." },
          { text: "Only academic experience", why: "포르투갈어도 읽고 쓴다고 밝혔다." },
          { text: "Only a second language", why: "레퍼런스 도서 경력도 있다." },
          {
            text: "Both of them",
            why: "정답. 우대 두 줄이 각각 '레퍼런스 도서'와 '제2외국어'인데, 메일에 둘 다 나온다. 두 지문을 짝지어야 세어진다.",
          },
        ],
      },
      {
        id: "q-r7m-double-job-posting-3",
        prompt: "Why does Ms. Moyo mention her leave dates?",
        skill: "crossref",
        band: 800,
        answer: 0,
        evidence: "공고의 'Shortlisted candidates will be asked to complete a short scheduling exercise' + 메일의 휴가 기간",
        choices: [
          {
            text: "She wants to take the scheduling exercise early.",
            why: "정답. 공고에 서류 통과자에게 과제를 낸다고 돼 있고, 휴가 전에 미리 하겠다고 제안한 것이다.",
          },
          { text: "She cannot start until September.", why: "입사 시점 이야기가 아니다." },
          { text: "She is asking to postpone the interview.", why: "미루자는 것이 아니라 앞당겨 하겠다는 것이다." },
          { text: "She will be unavailable for the closing date.", why: "마감은 22일이고 이미 14일에 지원했다." },
        ],
      },
      {
        id: "q-r7m-double-job-posting-4",
        prompt: "What does Ms. Moyo indicate about her previous workload?",
        skill: "detail",
        band: 700,
        answer: 2,
        evidence: "I handled between eighteen and twenty-five titles a year",
        choices: [
          { text: "It was much lighter than this position's.", why: "공고는 연 20종 안팎이고 그의 경력도 18~25종이다." },
          { text: "It consisted mainly of fiction.", why: "거의 다 레퍼런스 도서였다고 했다." },
          {
            text: "It was similar in size to this position's.",
            why: "정답. 연 20종 안팎이라는 공고와 겹친다.",
          },
          { text: "It did not involve freelancers.", why: "프리랜서와 매일 일한다고 밝혔다." },
        ],
      },
    ],
  },
  {
    id: "r7m-triple-supplier",
    part: 7,
    band: 900,
    docType: "email",
    passage: [
      {
        docType: "email",
        header: [
          { label: "To", value: "orders@northfell-paper.com" },
          { label: "From", value: "r.castellanos@brightmark.co" },
          { label: "Subject", value: "Quote request — Q3 stock" },
          { label: "Date", value: "2 June" },
        ],
        body: `Hello,

We would like a quote for our third-quarter paper order:

· 120 gsm uncoated, white — 400 reams
· 250 gsm board, white — 90 reams
· 90 gsm recycled — 250 reams

Delivery to our Leeds facility, in three monthly instalments beginning 1 July. Please include lead times.

One note: last year a portion of the recycled stock arrived below the weight we ordered. We would like the delivery documents to state the measured weight this time.

Regards,
Rosa Castellanos`,
      },
      {
        docType: "letter",
        header: [
          { label: "From", value: "Northfell Paper — Sales" },
          { label: "Date", value: "6 June" },
        ],
        body: `Dear Ms. Castellanos,

Thank you for your enquiry. Our quote follows.

· 120 gsm uncoated, white — £4.10 per ream, lead time 5 working days
· 250 gsm board, white — £9.80 per ream, lead time 5 working days
· 90 gsm recycled — £3.60 per ream, lead time 15 working days

Orders above 600 reams in total qualify for a 6% volume discount, applied to the invoice.

Regarding your note: all recycled stock is now weighed at dispatch and the measured value is printed on the delivery docket. This change was made in January.

Please confirm by 20 June so that we can reserve July capacity.

Yours sincerely,
Anders Holm`,
      },
      {
        docType: "email",
        header: [
          { label: "To", value: "a.holm@northfell-paper.com" },
          { label: "From", value: "r.castellanos@brightmark.co" },
          { label: "Subject", value: "RE: Quote request — Q3 stock" },
          { label: "Date", value: "11 June" },
        ],
        body: `Anders,

Confirmed, with one change: please increase the recycled stock to 300 reams. Everything else stands.

Given the lead time on that item, should the first instalment be placed now rather than at the end of June? I would rather not lose the 1 July date.

Rosa`,
      },
    ],
    questions: [
      {
        id: "q-r7m-triple-supplier-1",
        prompt: "Why does Ms. Castellanos ask for measured weights on the delivery documents?",
        skill: "detail",
        band: 800,
        answer: 2,
        evidence: "last year a portion of the recycled stock arrived below the weight we ordered",
        choices: [
          { text: "Her company's records require it.", why: "내부 기록 이야기는 없다." },
          { text: "The paper is priced by weight.", why: "견적은 연(ream) 단위 가격이다." },
          {
            text: "A previous order was underweight.",
            why: "정답. 작년에 재생지 일부가 주문한 무게보다 가볍게 왔기 때문이다.",
          },
          { text: "It is required by law.", why: "법규 이야기는 나오지 않는다." },
        ],
      },
      {
        id: "q-r7m-triple-supplier-2",
        prompt: "Will Brightmark receive the volume discount?",
        skill: "crossref",
        band: 900,
        answer: 0,
        evidence: "1차 메일의 수량 + 3차 메일의 250→300 변경 + 견적서의 600연 기준",
        choices: [
          {
            text: "Yes, because the revised order exceeds 600 reams.",
            why: "정답. 400 + 90 + 300 = 790연이다. 처음 주문(740연)으로도 넘지만, 세 지문의 숫자를 모아야 세어진다.",
          },
          { text: "No, the order is below the threshold.", why: "790연은 600연을 넘는다." },
          { text: "Only on the recycled stock", why: "할인은 총 수량 기준으로 청구서에 적용된다." },
          { text: "It cannot be determined.", why: "세 지문의 숫자로 계산할 수 있다." },
        ],
      },
      {
        id: "q-r7m-triple-supplier-3",
        prompt: "Why is Ms. Castellanos concerned about the timing of the first instalment?",
        skill: "crossref",
        band: 900,
        answer: 1,
        evidence: "견적서의 재생지 lead time 15 working days + 3차 메일의 '1 July date'",
        choices: [
          { text: "The discount expires on 20 June.", why: "20일은 확정 회신 기한이지 할인 기한이 아니다." },
          {
            text: "The recycled paper takes much longer to produce.",
            why: "정답. 재생지만 15영업일이라 6월 말에 주문하면 7월 1일에 못 맞춘다. 견적서를 봐야만 알 수 있는 이유다.",
          },
          { text: "Her facility closes in July.", why: "휴업 이야기는 없다." },
          { text: "Prices will increase in the third quarter.", why: "인상 이야기는 나오지 않는다." },
        ],
      },
      {
        id: "q-r7m-triple-supplier-4",
        prompt: "What had Northfell Paper already changed before receiving the enquiry?",
        skill: "detail",
        band: 800,
        answer: 3,
        evidence: "This change was made in January.",
        choices: [
          { text: "Its prices", why: "가격 변경 이야기는 없다." },
          { text: "Its delivery schedule", why: "배송 일정 변경 이야기는 없다." },
          { text: "Its discount threshold", why: "할인 기준이 바뀌었다는 말은 없다." },
          {
            text: "Its weighing procedure",
            why: "정답. 재생지를 출고 시 계량해 명세서에 찍는 것은 이미 1월부터라고 밝힌다 — 요청받아서 바꾼 것이 아니다.",
          },
        ],
      },
      {
        id: "q-r7m-triple-supplier-5",
        prompt: "What does Ms. Castellanos change in her second e-mail?",
        skill: "crossref",
        band: 900,
        answer: 2,
        evidence: "Confirmed, with one change: please increase the recycled stock to 300 reams. Everything else stands.",
        choices: [
          { text: "The delivery location", why: "리즈 공장 그대로다. 'Everything else stands' 가 그것을 말한다." },
          { text: "The instalment plan", why: "7월 1일부터 세 번에 나눠 받는 것도 그대로다." },
          {
            text: "The quantity of recycled paper",
            why: "정답. 250연에서 300연으로 늘렸고, 본인이 '한 가지만 바꾼다'고 못 박았다.",
          },
          { text: "The paper weights she ordered", why: "평량(gsm)은 처음 요청 그대로다. 바뀐 것은 무게가 아니라 수량이다." },
        ],
      },
    ],
  },
];
