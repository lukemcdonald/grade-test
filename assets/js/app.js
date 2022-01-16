import { questions } from "./questions.js";

const test = document.getElementById("test");
const submitBtn = document.createElement("button");
submitBtn.textContent = "Submit test";

const MAX_QUESTIONS_PER_SECTION = 10;
const MAILTO_ADDRESS = "thelukemcdonald@gmail.com";
const MAILTO_SUBJECT = "New Science Test Score";
const testQuestions = create2dArray(questions, MAX_QUESTIONS_PER_SECTION);

function createSection(qs, index) {
  const section = document.createElement("section");
  section.classList = "section container";

  const title = document.createElement("h2");
  title.classList = "section-title";
  title.textContent = `Section ${index + 1}`;

  const list = document.createElement("ol");
  list.classList = "section-questions";

  qs.forEach((question, id) => {
    const item = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");

    // input.name = `question-${id}`;
    item.setAttribute("data-id", `question-${id + index * 10}`);
    input.name = `question`;
    input.setAttribute("autocomplete", "off");
    label.textContent = question.q;

    list.appendChild(item).appendChild(label).appendChild(input);
  });

  section.appendChild(title);
  section.appendChild(list);

  test.appendChild(section);
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function create2dArray(arr, max) {
  const newArr = [];
  const randomArr = shuffleArray(arr);
  for (let i = 0; i < randomArr.length; i += max) {
    newArr.push([...randomArr.slice(i, i + max)]);
  }
  return newArr;
}

function createTest(qs) {
  qs.forEach((qs, index) => {
    createSection(qs, index);
  });

  test.appendChild(submitBtn);
}
createTest(testQuestions);

const errors = [];

function gradeTest(event) {
  event.preventDefault();
  const data = new FormData(this) || {};
  const answers = data.getAll("question");
  const answerKey = testQuestions.flat();

  let correct = answers.reduce((total, question, i) => {
    const answer = answerKey[i].a;
    if (answer.toLowerCase() === question.toLowerCase()) {
      total += 1;
    } else {
      console.log(i);
      errors.push(i);
    }
    return total;
  }, 0);

  const percent = Math.round((correct / answerKey.length) * 100);

  if (errors.length) {
    errors.forEach((id, i) => {
      const question = document.querySelector(`[data-id=question-${id}]`);
      question.classList = "steve-is-wrong";
      const input = question.querySelector("input");
      input.setAttribute("disabled", true);
    });
  }

  const message = `You scored ${correct}/${answerKey.length} (${percent}%)`;
  const yourScore = document.querySelector(".score");
  yourScore.classList = "block";
  const yourPercent = document.querySelector(".percent");
  yourPercent.textContent = `${percent}%`;
  alert(message);
  // window.open(
  //   `mailto:${MAILTO_ADDRESS}?subject=${MAILTO_SUBJECT}&body=${message}`
  // );
}

test.addEventListener("submit", gradeTest);
