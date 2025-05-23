// Alert to confirm server is working (runs once on page load)
function showMessage() {
  alert("Hi Radwa! Your server is working!");
}
showMessage();

// Animate .section elements on scroll using IntersectionObserver
const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop observing once visible
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});

// Quiz logic below (same as before)

const quizData = [
  {
    question: "Which OSI layer is responsible for data encryption?",
    answers: [
      { text: "Presentation Layer", correct: true },
      { text: "Session Layer", correct: false },
      { text: "Network Layer", correct: false },
      { text: "Transport Layer", correct: false }
    ]
  },
  {
    question: "Which layer handles routing between devices?",
    answers: [
      { text: "Network Layer", correct: true },
      { text: "Data Link Layer", correct: false },
      { text: "Physical Layer", correct: false },
      { text: "Application Layer", correct: false }
    ]
  },
  {
    question: "Which OSI layer is responsible for establishing connections?",
    answers: [
      { text: "Session Layer", correct: true },
      { text: "Transport Layer", correct: false },
      { text: "Network Layer", correct: false },
      { text: "Data Link Layer", correct: false }
    ]
  }
];

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');

function loadQuestion() {
  nextBtn.disabled = true;
  scoreEl.textContent = "";
  const currentQuestion = quizData[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  currentQuestion.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer.text;
    btn.classList.add('answer-btn');
    btn.onclick = () => selectAnswer(btn, answer.correct);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(button, correct) {
  const allButtons = answersEl.querySelectorAll('button');
  allButtons.forEach(btn => btn.disabled = true);

  if (correct) {
    button.style.backgroundColor = 'green';
    score++;
  } else {
    button.style.backgroundColor = 'red';
  }
  nextBtn.disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  questionEl.textContent = `Quiz Completed! Your score: ${score} / ${quizData.length}`;
  answersEl.innerHTML = '';
  nextBtn.style.display = 'none';
}

loadQuestion();

