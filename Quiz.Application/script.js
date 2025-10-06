let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const timeEl = document.getElementById("time");
const nextBtn = document.getElementById("next-btn");
const scoreBox = document.getElementById("score-box");
const scoreEl = document.getElementById("score");

async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
  const data = await res.json();
  questions = data.results.map(q => ({
    question: decodeHTML(q.question),
    options: shuffle([...q.incorrect_answers, q.correct_answer].map(decodeHTML)),
    answer: decodeHTML(q.correct_answer)
  }));
  loadQuestion();
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  timeEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      showFeedback("Time's up!", false);
    }
  }, 1000);

  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";

  q.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => checkAnswer(option);
    optionsEl.appendChild(li);
  });
}

function checkAnswer(selected) {
  clearInterval(timer);
  const correct = questions[currentQuestion].answer;
  if (selected === correct) {
    score++;
    showFeedback("Correct!", true);
  } else {
    showFeedback(`Wrong! Correct answer: ${correct}`, false);
  }
}

function showFeedback(message, isCorrect) {
  feedbackEl.textContent = message;
  feedbackEl.style.color = isCorrect ? "green" : "red";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showScore();
  }
};

function showScore() {
  document.getElementById("question-box").classList.add("hidden");
  scoreBox.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${questions.length}`;
}

fetchQuestions();
