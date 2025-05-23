// Alert to confirm server is working (runs once on page load)
function showMessage() {
  alert("Hi Radwa! Your server is working!");
}
showMessage();

// Animate .section elements on scroll using IntersectionObserver
const sectionElements = document.querySelectorAll('.section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Stop observing once visible
    }
  });
}, { threshold: 0.1 });

sectionElements.forEach(section => {
  observer.observe(section);
});

// Quiz data and logic
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

// Create and add restart button dynamically (hidden initially)
const restartBtn = document.createElement('button');
restartBtn.textContent = 'Restart Quiz';
restartBtn.id = 'restart-btn';
restartBtn.style.display = 'none';
restartBtn.addEventListener('click', restartQuiz);
nextBtn.parentNode.appendChild(restartBtn);

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
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', 'false');
    btn.onclick = () => selectAnswer(btn, answer.correct);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(button, correct) {
  const allButtons = answersEl.querySelectorAll('button');
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.setAttribute('aria-pressed', 'false');
  });

  if (correct) {
    button.style.backgroundColor = 'green';
    button.setAttribute('aria-pressed', 'true');
    score++;
  } else {
    button.style.backgroundColor = 'red';
    button.setAttribute('aria-pressed', 'true');
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
  restartBtn.style.display = 'inline-block';
  scoreEl.textContent = "";
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.style.display = 'inline-block';
  restartBtn.style.display = 'none';
  loadQuestion();
}

// Add click event listener for next button
nextBtn.addEventListener('click', nextQuestion);

// Load first question initially
loadQuestion();

// Smooth scrolling on sidebar nav links with dynamic header height
document.querySelectorAll('#sidebar-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 80;
      window.scrollTo({
        top: targetSection.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  });
});

// Debounce helper function for scroll events
function debounce(func, wait = 20, immediate = false) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Active link highlighting on scroll, debounced for performance
const navLinks = document.querySelectorAll('#sidebar-nav a');
const sectionIds = Array.from(navLinks).map(link => document.getElementById(link.getAttribute('href').substring(1)));

window.addEventListener('scroll', debounce(() => {
  const scrollPos = window.scrollY + 100; // slightly below top

  let currentIndex = sectionIds.length - 1;
  for (let i = 0; i < sectionIds.length; i++) {
    if (scrollPos < sectionIds[i].offsetTop) {
      currentIndex = i - 1;
      break;
    }
  }

  navLinks.forEach(link => link.classList.remove('active'));
  if (currentIndex >= 0) {
    navLinks[currentIndex].classList.add('active');
  }
}, 50));

// Accessibility for .osi-layer toggle elements (click + keyboard)
document.querySelectorAll('.osi-layer').forEach(layer => {
  layer.setAttribute('tabindex', '0');
  layer.setAttribute('role', 'button');
  layer.setAttribute('aria-pressed', 'false');

  function toggleLayer() {
    const expanded = layer.classList.toggle('expanded');
    layer.setAttribute('aria-pressed', expanded ? 'true' : 'false');
  }

  layer.addEventListener('click', toggleLayer);

  layer.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLayer();
    }
  });
});
