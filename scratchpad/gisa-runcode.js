// 코드 문항의 "정답"을 사람 눈이 아니라 컴파일러에게 물어본다.
//
// 코드를 읽고 결과를 맞히는 문항은 내가 머릿속으로 돌려 본 값을 정답으로
// 적은 것이다. 그 계산이 틀리면 앱이 정답이라고 우기는 오답이 된다.
// 실제로 돌려서 견준다.
const fs = require("fs");
const { execSync } = require("child_process");
const jiti = require("jiti")("/home/user/k-history/gisa", { alias: { "@": "/home/user/k-history/gisa/src" } });
const { QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/questions.ts");
const { PRACTICAL_QUESTIONS } = jiti("/home/user/k-history/gisa/src/data/practical.ts");
const DIR = "/tmp/codecheck";

function detect(code) {
  if (/#include|printf|int main\s*\(/.test(code)) return "c";
  if (/public class|System\.out/.test(code)) return "java";
  if (/^\s*(def |print\(|import )/m.test(code) && !/;\s*$/m.test(code.trim())) return "python";
  return null;
}

function run(code, lang) {
  try {
    if (lang === "c") {
      fs.writeFileSync(`${DIR}/a.c`, code);
      execSync(`gcc -w -o ${DIR}/a ${DIR}/a.c 2>/dev/null`);
      return execSync(`${DIR}/a`, { encoding: "utf8", timeout: 5000 });
    }
    if (lang === "java") {
      const m = code.match(/public\s+class\s+(\w+)/);
      const name = m ? m[1] : "Main";
      fs.writeFileSync(`${DIR}/${name}.java`, code);
      execSync(`cd ${DIR} && javac ${name}.java 2>/dev/null`, { stdio: "pipe" });
      return execSync(`cd ${DIR} && java ${name} 2>/dev/null`, { encoding: "utf8", timeout: 8000 });
    }
    if (lang === "python") {
      fs.writeFileSync(`${DIR}/a.py`, code);
      return execSync(`python3 ${DIR}/a.py`, { encoding: "utf8", timeout: 5000 });
    }
  } catch (e) {
    return { err: String(e.message || e).split("\n")[0].slice(0, 90) };
  }
  return null;
}

const tidy = (s) => String(s).replace(/\r\n/g, "\n").replace(/\s+$/, "").trim();
let checked = 0, bad = 0, skipped = 0;

console.log("### 필기 — 코드를 읽고 결과를 고르는 문항\n");
for (const q of QUESTIONS) {
  if (!q.passage) continue;
  const lang = detect(q.passage);
  if (!lang) continue;
  const out = run(q.passage, lang);
  if (!out || out.err) { skipped++; console.log(`  · ${q.id} 돌리지 못함 ${out?.err ?? ""}`); continue; }
  checked++;
  const want = tidy(q.options[q.answerIndex]);
  const got = tidy(out);
  // 선지가 "첫 줄 ... 둘째 줄 ..." 처럼 풀어 쓴 것은 숫자만 견준다
  const nums = (x) => (x.match(/-?\d+/g) || []).join(",");
  const same = got === want || nums(got) === nums(want);
  if (!same) { bad++; console.log(`  ✗ ${q.id}\n      실제 출력 : ${JSON.stringify(got)}\n      정답 선지 : ${JSON.stringify(want)}`); }
}

console.log("\n### 실기 — 출력을 적는 문항\n");
for (const q of PRACTICAL_QUESTIONS) {
  if (q.kind !== "code" || !q.passage) continue;
  const lang = q.lang ?? detect(q.passage);
  const out = run(q.passage, lang);
  if (!out || out.err) { skipped++; console.log(`  · ${q.id} 돌리지 못함 ${out?.err ?? ""}`); continue; }
  checked++;
  const got = tidy(out);
  if (!q.answers.some((a) => tidy(a) === got)) {
    bad++; console.log(`  ✗ ${q.id}\n      실제 출력 : ${JSON.stringify(got)}\n      적어 둔 답 : ${q.answers.map((a) => JSON.stringify(tidy(a))).join(" / ")}`);
  }
}

console.log(`\n돌려 본 것 ${checked}개 · 어긋난 것 ${bad}개 · 돌리지 못한 것 ${skipped}개`);
process.exit(bad ? 1 : 0);
