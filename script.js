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
const restartBtn = document.getElementById('restart-btn');

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

// Add click event listener for restart button
restartBtn.addEventListener('click', restartQuiz);

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

// Pop Quiz functionality
const popQuizData = [
  // Multiple Choice Questions
  {
    type: 'multiple-choice',
    question: "Which layer is responsible for end-to-end communication?",
    answers: [
      { text: "Transport Layer", correct: true, explanation: "The Transport layer ensures reliable end-to-end communication between applications." },
      { text: "Network Layer", correct: false, explanation: "The Network layer handles routing and logical addressing." },
      { text: "Session Layer", correct: false, explanation: "The Session layer manages sessions between applications." },
      { text: "Application Layer", correct: false, explanation: "The Application layer provides services to end-user applications." }
    ]
  },
  {
    type: 'multiple-choice',
    question: "What is the main purpose of the Presentation Layer?",
    answers: [
      { text: "Data format translation and encryption", correct: true, explanation: "The Presentation layer handles data format translation, encryption, and compression." },
      { text: "Physical transmission of data", correct: false, explanation: "Physical transmission is handled by the Physical layer." },
      { text: "Routing packets", correct: false, explanation: "Routing is handled by the Network layer." },
      { text: "Error detection", correct: false, explanation: "Error detection is primarily handled by the Data Link layer." }
    ]
  },
  {
    type: 'multiple-choice',
    question: "Which device operates at the Physical Layer?",
    answers: [
      { text: "Hub", correct: true, explanation: "Hubs operate at the Physical layer, simply repeating electrical signals." },
      { text: "Switch", correct: false, explanation: "Switches operate at the Data Link layer." },
      { text: "Router", correct: false, explanation: "Routers operate at the Network layer." },
      { text: "Firewall", correct: false, explanation: "Firewalls typically operate at multiple layers, but not primarily at the Physical layer." }
    ]
  },
  // True/False Questions
  {
    type: 'true-false',
    question: "The OSI Model was developed by the International Organization for Standardization (ISO).",
    answers: [
      { text: "True", correct: true, explanation: "The OSI Model was indeed developed by ISO to standardize network communications." },
      { text: "False", correct: false, explanation: "The OSI Model was developed by ISO, not by any other organization." }
    ]
  },
  {
    type: 'true-false',
    question: "TCP/IP protocol suite follows the OSI Model exactly.",
    answers: [
      { text: "True", correct: false, explanation: "TCP/IP combines some OSI layers and has a different structure." },
      { text: "False", correct: true, explanation: "TCP/IP has a different structure, combining some OSI layers and having its own unique architecture." }
    ]
  },
  // Matching Questions
  {
    type: 'matching',
    question: "Match the protocols with their correct OSI layers:",
    pairs: [
      { left: "HTTP", right: "Application Layer", correct: true },
      { left: "TCP", right: "Transport Layer", correct: true },
      { left: "IP", right: "Network Layer", correct: true },
      { left: "Ethernet", right: "Data Link Layer", correct: true }
    ],
    explanation: "Each protocol operates at its specific layer in the OSI Model, with HTTP at the top (Application) and Ethernet near the bottom (Data Link)."
  },
  // Fill in the Blank
  {
    type: 'fill-blank',
    question: "The OSI Model has _ layers, with the _ layer being the highest and the _ layer being the lowest.",
    answers: [
      { text: "7", correct: true },
      { text: "Application", correct: true },
      { text: "Physical", correct: true }
    ],
    explanation: "The OSI Model consists of 7 layers, starting with the Application layer (Layer 7) at the top and ending with the Physical layer (Layer 1) at the bottom."
  }
];

let popQuizScore = 0;
let totalPopQuestions = 0;

const modal = document.getElementById('pop-quiz-modal');
const popQuestion = document.getElementById('pop-question');
const popAnswers = document.getElementById('pop-answers');
const popExplanation = document.getElementById('pop-explanation');
const popNextBtn = document.getElementById('pop-next');
const popSkipBtn = document.getElementById('pop-skip');
const closeModalBtn = document.querySelector('.close-modal');

let currentPopQuestionIndex = 0;
let popQuizActive = false;

function createConfetti(element) {
  const colors = ['#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'];
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    element.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => confetti.remove(), 1000);
  }
}

function createSparkles(element) {
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
    element.appendChild(sparkle);
    
    // Remove sparkle after animation
    setTimeout(() => sparkle.remove(), 1000);
  }
}

function showPopQuiz() {
  if (popQuizActive) return;
  
  currentPopQuestionIndex = Math.floor(Math.random() * popQuizData.length);
  const question = popQuizData[currentPopQuestionIndex];
  
  popQuestion.textContent = question.question;
  popAnswers.innerHTML = '';
  popExplanation.textContent = '';
  popExplanation.classList.remove('visible');
  popNextBtn.style.display = 'none';
  
  if (question.type === 'multiple-choice' || question.type === 'true-false') {
    question.answers.forEach(answer => {
      const btn = document.createElement('button');
      btn.textContent = answer.text;
      btn.onclick = () => selectPopAnswer(btn, answer.correct, answer.explanation);
      popAnswers.appendChild(btn);
    });
  } else if (question.type === 'matching') {
    const matchingContainer = document.createElement('div');
    matchingContainer.className = 'matching-container';
    
    question.pairs.forEach(pair => {
      const pairContainer = document.createElement('div');
      pairContainer.className = 'matching-pair';
      
      const leftSelect = document.createElement('select');
      const rightSelect = document.createElement('select');
      
      // Add options
      question.pairs.forEach(p => {
        const leftOption = document.createElement('option');
        leftOption.value = p.left;
        leftOption.textContent = p.left;
        leftSelect.appendChild(leftOption);
        
        const rightOption = document.createElement('option');
        rightOption.value = p.right;
        rightOption.textContent = p.right;
        rightSelect.appendChild(rightOption);
      });
      
      pairContainer.appendChild(leftSelect);
      pairContainer.appendChild(rightSelect);
      matchingContainer.appendChild(pairContainer);
    });
    
    popAnswers.appendChild(matchingContainer);
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Check Answers';
    checkButton.onclick = () => checkMatchingAnswers(question);
    popAnswers.appendChild(checkButton);
  } else if (question.type === 'fill-blank') {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'fill-blank-container';
    
    const questionParts = question.question.split('_');
    questionParts.forEach((part, index) => {
      inputContainer.appendChild(document.createTextNode(part));
      if (index < questionParts.length - 1) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-blank-input';
        inputContainer.appendChild(input);
      }
    });
    
    popAnswers.appendChild(inputContainer);
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Check Answer';
    checkButton.onclick = () => checkFillBlankAnswers(question);
    popAnswers.appendChild(checkButton);
  }
  
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  popQuizActive = true;
  totalPopQuestions++;
}

function checkMatchingAnswers(question) {
  const pairs = popAnswers.querySelectorAll('.matching-pair');
  let allCorrect = true;
  
  pairs.forEach((pair, index) => {
    const leftSelect = pair.querySelector('select:first-child');
    const rightSelect = pair.querySelector('select:last-child');
    const correctPair = question.pairs[index];
    
    if (leftSelect.value === correctPair.left && rightSelect.value === correctPair.right) {
      pair.classList.add('correct');
      pair.classList.remove('incorrect');
      createSparkles(pair);
    } else {
      pair.classList.add('incorrect');
      pair.classList.remove('correct');
      allCorrect = false;
    }
  });
  
  if (allCorrect) {
    popQuizScore++;
    createConfetti(popAnswers);
  }
  
  popExplanation.textContent = question.explanation;
  popExplanation.classList.add('visible');
  popNextBtn.style.display = 'inline-block';
}

function checkFillBlankAnswers(question) {
  const inputs = popAnswers.querySelectorAll('.fill-blank-input');
  let allCorrect = true;
  
  inputs.forEach((input, index) => {
    if (input.value.toLowerCase() === question.answers[index].text.toLowerCase()) {
      input.classList.add('correct');
      input.classList.remove('incorrect');
      createSparkles(input);
    } else {
      input.classList.add('incorrect');
      input.classList.remove('correct');
      allCorrect = false;
    }
  });
  
  if (allCorrect) {
    popQuizScore++;
    createConfetti(popAnswers);
  }
  
  popExplanation.textContent = question.explanation;
  popExplanation.classList.add('visible');
  popNextBtn.style.display = 'inline-block';
}

function selectPopAnswer(button, correct, explanation) {
  const allButtons = popAnswers.querySelectorAll('button');
  allButtons.forEach(btn => btn.disabled = true);
  
  if (correct) {
    button.classList.add('correct');
    popQuizScore++;
    createConfetti(button);
    createSparkles(button);
  } else {
    button.classList.add('incorrect');
  }
  
  popExplanation.textContent = explanation;
  popExplanation.classList.add('visible');
  popNextBtn.style.display = 'inline-block';
}

function closePopQuiz() {
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  popQuizActive = false;
  
  // Show final score if at least one question was answered
  if (totalPopQuestions > 0) {
    const scorePercentage = Math.round((popQuizScore / totalPopQuestions) * 100);
    const scoreMessage = `You answered ${popQuizScore} out of ${totalPopQuestions} questions correctly (${scorePercentage}%)!`;
    
    // Create and show a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = scoreMessage;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }
}

// Event listeners
closeModalBtn.addEventListener('click', closePopQuiz);
popNextBtn.addEventListener('click', nextPopQuestion);
popSkipBtn.addEventListener('click', closePopQuiz);

// Show pop quiz randomly while scrolling
let lastScrollTime = Date.now();
let scrollCount = 0;

window.addEventListener('scroll', () => {
  const currentTime = Date.now();
  if (currentTime - lastScrollTime > 1000) { // Check every second
    scrollCount++;
    if (scrollCount >= 3 && !popQuizActive) { // Show quiz after 3 scroll events
      showPopQuiz();
      scrollCount = 0;
    }
    lastScrollTime = currentTime;
  }
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closePopQuiz();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popQuizActive) {
    closePopQuiz();
  }
});

// Flashcards Feature
const flashcardData = [
  {
    front: "Application Layer (Layer 7)",
    back: "Provides network services to applications. Protocols: HTTP, FTP, SMTP, DNS"
  },
  {
    front: "Presentation Layer (Layer 6)",
    back: "Translates data formats, handles encryption. Protocols: SSL/TLS, JPEG, GIF"
  },
  {
    front: "Session Layer (Layer 5)",
    back: "Manages sessions between applications. Protocols: NetBIOS, RPC"
  },
  {
    front: "Transport Layer (Layer 4)",
    back: "Ensures reliable data transfer. Protocols: TCP, UDP"
  },
  {
    front: "Network Layer (Layer 3)",
    back: "Handles routing and logical addressing. Protocols: IP, ICMP, OSPF"
  },
  {
    front: "Data Link Layer (Layer 2)",
    back: "Provides node-to-node data transfer. Protocols: Ethernet, PPP, MAC"
  },
  {
    front: "Physical Layer (Layer 1)",
    back: "Transmits raw bits over physical medium. Examples: Cables, Hubs, Repeaters"
  }
];

let currentFlashcardIndex = 0;
const flashcardContainer = document.getElementById('flashcard-container');
const nextFlashcardBtn = document.getElementById('next-flashcard-btn');

function createFlashcard(data) {
  const flashcard = document.createElement('div');
  flashcard.className = 'flashcard';
  
  const front = document.createElement('div');
  front.className = 'flashcard-front';
  front.innerHTML = `<h3>${data.front}</h3>`;
  
  const back = document.createElement('div');
  back.className = 'flashcard-back';
  back.innerHTML = `<p>${data.back}</p>`;
  
  flashcard.appendChild(front);
  flashcard.appendChild(back);
  
  // Add click event to flip card
  flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
  });
  
  return flashcard;
}

function showFlashcard(index) {
  // Clear existing flashcards
  flashcardContainer.innerHTML = '';
  
  // Create and show new flashcard
  const flashcard = createFlashcard(flashcardData[index]);
  flashcardContainer.appendChild(flashcard);
  
  // Add entrance animation
  flashcard.style.animation = 'fadeInScale 0.5s ease-out';
}

function nextFlashcard() {
  currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardData.length;
  showFlashcard(currentFlashcardIndex);
}

// Initialize first flashcard
showFlashcard(currentFlashcardIndex);

// Add click event to next button
nextFlashcardBtn.addEventListener('click', nextFlashcard);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    nextFlashcard();
  }
});


