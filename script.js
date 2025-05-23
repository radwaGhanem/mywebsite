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
    question: "Which protocol operates at the Application Layer?",
    answers: [
      { text: "HTTP", correct: true, explanation: "HTTP is an Application layer protocol used for web communications." },
      { text: "IP", correct: false, explanation: "IP operates at the Network layer, responsible for routing." },
      { text: "Ethernet", correct: false, explanation: "Ethernet is a Data Link layer protocol, handling framing and MAC addressing." },
      { text: "TCP", correct: false, explanation: "TCP is a Transport layer protocol, providing reliable connection-oriented communication." }
    ]
  },
  {
    question: "Which device primarily operates at the Data Link layer?",
    answers: [
      { text: "Switch", correct: true, explanation: "Switches operate at the Data Link layer to forward frames based on MAC addresses." },
      { text: "Router", correct: false, explanation: "Routers operate at the Network layer to route packets between networks." },
      { text: "Hub", correct: false, explanation: "Hubs operate at the Physical layer, simply repeating signals." },
      { text: "Firewall", correct: false, explanation: "Firewalls can operate on multiple layers, but primarily on Network and Transport layers." }
    ]
  },
  {
    question: "What is the primary function of the Transport Layer?",
    answers: [
      { text: "Segmentation and flow control", correct: true, explanation: "The Transport layer manages segmentation, flow control, and ensures reliable transmission." },
      { text: "Physical signal transmission", correct: false, explanation: "Physical layer deals with the transmission of raw bits over a physical medium." },
      { text: "Data encryption", correct: false, explanation: "Data encryption mainly occurs at the Presentation layer." },
      { text: "Routing packets", correct: false, explanation: "Routing is the responsibility of the Network layer." }
    ]
  },
  {
    question: "Scenario: A device cannot resolve IP addresses to MAC addresses. At which OSI layer is the problem?",
    answers: [
      { text: "Data Link Layer", correct: true, explanation: "Address resolution (e.g., ARP) occurs at the Data Link layer." },
      { text: "Network Layer", correct: false, explanation: "The Network layer handles IP addressing and routing." },
      { text: "Transport Layer", correct: false, explanation: "Transport layer manages end-to-end connections and data delivery." },
      { text: "Session Layer", correct: false, explanation: "Session layer manages sessions and dialogs between applications." }
    ]
  }
];

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const explanationEl = document.getElementById('explanation');

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
  explanationEl.textContent = "";
  explanationEl.classList.remove('visible');
  const currentQuestion = quizData[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  // Update progress bar
  const progress = ((currentQuestionIndex) / quizData.length) * 100;
  document.getElementById('progress').style.width = `${progress}%`;

  currentQuestion.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer.text;
    btn.classList.add('answer-btn');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', 'false');
    btn.onclick = () => selectAnswer(btn, answer.correct, answer.explanation);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(button, correct, explanation) {
  const allButtons = answersEl.querySelectorAll('button');
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.setAttribute('aria-pressed', 'false');
  });

  if (correct) {
    button.classList.add('correct');
    button.setAttribute('aria-pressed', 'true');
    score++;
  } else {
    button.classList.add('incorrect');
    button.setAttribute('aria-pressed', 'true');
  }

  explanationEl.textContent = explanation;
  explanationEl.classList.add('visible');
  nextBtn.disabled = false;
  nextBtn.focus();
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
  explanationEl.textContent = '';
  explanationEl.classList.remove('visible');
  nextBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';
  scoreEl.textContent = `You got ${score} out of ${quizData.length} questions correct!`;
  
  // Update progress bar to 100%
  document.getElementById('progress').style.width = '100%';
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

// Accessibility and toggle for .osi-layer elements with detailed info
document.querySelectorAll('.osi-layer').forEach(layer => {
  layer.setAttribute('tabindex', '0');
  layer.setAttribute('role', 'button');
  layer.setAttribute('aria-pressed', 'false');

  function toggleLayer() {
    const expanded = layer.classList.toggle('expanded');
    layer.setAttribute('aria-pressed', expanded ? 'true' : 'false');

    // Toggle detailed info visibility
    const info = layer.querySelector('.layer-info');
    if(info) info.classList.toggle('visible');
  }

  layer.addEventListener('click', toggleLayer);

  layer.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLayer();
    }
  });
});

// Theme toggling
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
  (prefersDarkScheme.matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Data packet animation
const packet = document.querySelector('.packet');
const layers = document.querySelectorAll('.osi-layer');

function animatePacket() {
  packet.style.animation = 'none';
  packet.offsetHeight; // Trigger reflow
  packet.style.animation = 'movePacket 7s linear infinite';
}

// Start animation when section is visible
const packetObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animatePacket();
    }
  });
}, { threshold: 0.5 });

packetObserver.observe(document.querySelector('.osi-diagram'));

// Layer interaction enhancement
layers.forEach(layer => {
  layer.addEventListener('mouseenter', () => {
    const layerNumber = layer.getAttribute('data-layer');
    packet.style.animationPlayState = 'paused';
    packet.style.top = `${(layerNumber - 1) * 100}px`;
  });

  layer.addEventListener('mouseleave', () => {
    packet.style.animationPlayState = 'running';
  });
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Create searchable content
const searchableContent = [
  ...Array.from(document.querySelectorAll('.osi-layer')).map(layer => ({
    title: layer.querySelector('h3').textContent,
    content: layer.querySelector('.layer-info').textContent,
    extraInfo: layer.querySelector('.extra-info').textContent,
    element: layer
  })),
  {
    title: 'OSI Model Overview',
    content: document.querySelector('#what-is-osi + p').textContent,
    element: document.querySelector('#what-is-osi').parentElement
  }
];

function highlightText(text, searchTerm) {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function performSearch(searchTerm) {
  if (!searchTerm.trim()) {
    searchResults.classList.remove('visible');
    return;
  }

  const results = searchableContent.filter(item => {
    const searchableText = `${item.title} ${item.content} ${item.extraInfo || ''}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  if (results.length > 0) {
    searchResults.innerHTML = results.map(item => `
      <div class="search-result-item" data-target="${item.element.id || ''}">
        <strong>${highlightText(item.title, searchTerm)}</strong>
        <p>${highlightText(item.content, searchTerm)}</p>
      </div>
    `).join('');
    searchResults.classList.add('visible');

    // Add click handlers to results
    searchResults.querySelectorAll('.search-result-item').forEach(result => {
      result.addEventListener('click', () => {
        const targetId = result.dataset.target;
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.classList.add('highlight-section');
            setTimeout(() => targetElement.classList.remove('highlight-section'), 2000);
          }
        }
        searchResults.classList.remove('visible');
        searchInput.value = '';
      });
    });
  } else {
    searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    searchResults.classList.add('visible');
  }
}

// Debounce search input
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.remove('visible');
  }
});

// Add keyboard navigation for search results
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchResults.classList.remove('visible');
  }
});
