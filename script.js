const questions = [
    {
        question: "What is the capital of France?",
        type: "single-choice",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris",
        userAnswer: null
    },
    {
        question: "Which of these are programming languages?",
        type: "multi-select",
        options: ["Python", "HTML", "CSS", "JavaScript", "SQL"],
        answer: ["Python", "JavaScript"],
        userAnswer: []
    },
    {
        question: "The largest planet in our solar system is ____.",
        type: "fill-in-the-blank",
        answer: "Jupiter",
        userAnswer: ""
    },
    {
        question: "What is 2 + 2?",
        type: "single-choice",
        options: ["3", "4", "5", "6"],
        answer: "4",
        userAnswer: null
    },
    {
        question: "Which of these are fruits?",
        type: "multi-select",
        options: ["Carrot", "Apple", "Banana", "Potato", "Orange"],
        answer: ["Apple", "Banana", "Orange"],
        userAnswer: []
    }
];

const landingScreen = document.getElementById('landing-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');

const startQuizBtn = document.getElementById('start-quiz-btn');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const fillInBlankInput = document.getElementById('fill-in-blank-input');
const nextBtn = document.getElementById('next-btn');
const submitQuizBtn = document.getElementById('submit-quiz-btn');
const progressBar = document.getElementById('progress-bar');
const questionTracker = document.getElementById('question-tracker');
const timerDisplay = document.getElementById('timer');
const feedbackMessage = document.getElementById('feedback-message');

const totalQuestionsSpan = document.getElementById('total-questions-span');
const correctAnswersSpan = document.getElementById('correct-answers-span');
const scoreSpan = document.getElementById('score-span');
const reviewAnswersBtn = document.getElementById('review-answers-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const reviewContainer = document.getElementById('review-container');
const backToResultsBtn = document.getElementById('back-to-results-btn');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
let quizStarted = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeQuiz() {
    shuffleArray(questions);
    questions.forEach(q => {
        if (q.type === "single-choice") {
            q.userAnswer = null;
            shuffleArray(q.options);
        } else if (q.type === "multi-select") {
            q.userAnswer = [];
            shuffleArray(q.options);
        } else if (q.type === "fill-in-the-blank") {
            q.userAnswer = "";
        }
    });
    currentQuestionIndex = 0;
    score = 0;
    quizStarted = false;
    showScreen(landingScreen);
}

function showScreen(screenToShow) {
    const screens = [landingScreen, quizScreen, resultsScreen, reviewScreen];
    screens.forEach(screen => {
        if (screen === screenToShow) {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    timerDisplay.textContent = formatTime(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            moveToNextQuestion();
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionTracker.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
}

function renderQuestion() {
    updateProgressBar();
    startTimer();
    const currentQuestion = questions[currentQuestionIndex];
    questionTitle.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    fillInBlankInput.style.display = 'none';
    fillInBlankInput.value = '';

    nextBtn.style.display = 'block';
    submitQuizBtn.style.display = 'none';
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitQuizBtn.style.display = 'block';
    }

    if (currentQuestion.type === "single-choice") {
        optionsContainer.classList.add('options-grid');
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = option;
            button.addEventListener('click', () => selectSingleChoice(option, button));
            optionsContainer.appendChild(button);
            if (currentQuestion.userAnswer === option) {
                button.classList.add('selected');
            }
        });
    } else if (currentQuestion.type === "multi-select") {
        optionsContainer.classList.add('options-grid');
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.classList.add('option-checkbox-label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.addEventListener('change', () => selectMultiChoice(option, label, checkbox.checked));
            const span = document.createElement('span');
            span.textContent = option;
            label.appendChild(checkbox);
            label.appendChild(span);
            optionsContainer.appendChild(label);

            if (currentQuestion.userAnswer.includes(option)) {
                checkbox.checked = true;
                label.classList.add('selected');
            }
        });
    } else if (currentQuestion.type === "fill-in-the-blank") {
        optionsContainer.classList.remove('options-grid');
        fillInBlankInput.style.display = 'block';
        fillInBlankInput.value = currentQuestion.userAnswer;
        fillInBlankInput.addEventListener('input', (e) => {
            currentQuestion.userAnswer = e.target.value;
        });
    }
}

function selectSingleChoice(selectedOption, clickedButton) {
    const currentQuestion = questions[currentQuestionIndex];
    currentQuestion.userAnswer = selectedOption;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    clickedButton.classList.add('selected');
}

function selectMultiChoice(selectedOption, clickedLabel, isChecked) {
    const currentQuestion = questions[currentQuestionIndex];
    if (isChecked) {
        if (!currentQuestion.userAnswer.includes(selectedOption)) {
            currentQuestion.userAnswer.push(selectedOption);
        }
        clickedLabel.classList.add('selected');
    } else {
        currentQuestion.userAnswer = currentQuestion.userAnswer.filter(ans => ans !== selectedOption);
        clickedLabel.classList.remove('selected');
    }
}

function validateAnswer(question) {
    let isCorrect = false;
    if (question.type === "single-choice") {
        isCorrect = question.userAnswer === question.answer;
    } else if (question.type === "multi-select") {
        if (question.userAnswer.length !== question.answer.length) {
            isCorrect = false;
        } else {
            isCorrect = question.userAnswer.every(ans => question.answer.includes(ans));
        }
    } else if (question.type === "fill-in-the-blank") {
        isCorrect = question.userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    }
    return isCorrect;
}

function showFeedback(isCorrect) {
    feedbackMessage.textContent = isCorrect ? "Correct!" : "Incorrect!";
    feedbackMessage.classList.add('show');
    setTimeout(() => {
        feedbackMessage.classList.remove('show');
    }, 1500);
}

function applyFeedbackStyling() {
    const currentQuestion = questions[currentQuestionIndex];
    const isQuestionCorrect = validateAnswer(currentQuestion);
    showFeedback(isQuestionCorrect);

    if (currentQuestion.type === "single-choice") {
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.textContent === currentQuestion.answer) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected')) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        });
    } else if (currentQuestion.type === "multi-select") {
        document.querySelectorAll('.option-checkbox-label').forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            const optionText = checkbox.value;

            if (currentQuestion.answer.includes(optionText)) {
                label.classList.add('correct');
            }
            if (currentQuestion.userAnswer.includes(optionText) && !currentQuestion.answer.includes(optionText)) {
                label.classList.add('incorrect');
            }
            checkbox.disabled = true;
        });
    } else if (currentQuestion.type === "fill-in-the-blank") {
        if (isQuestionCorrect) {
            fillInBlankInput.classList.add('correct');
        } else {
            fillInBlankInput.classList.add('incorrect');
        }
        fillInBlankInput.disabled = true;
    }
}

function moveToNextQuestion() {
    clearInterval(timerInterval);
    const currentQuestion = questions[currentQuestionIndex];
    if (validateAnswer(currentQuestion)) {
        score++;
    }

    applyFeedbackStyling();

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
            resetFeedbackStyling();
        } else {
            showResults();
        }
    }, 1700);
}

function resetFeedbackStyling() {
    document.querySelectorAll('.option-btn, .option-checkbox-label').forEach(el => {
        el.classList.remove('selected', 'correct', 'incorrect');
        if (el.tagName === 'BUTTON') {
            el.disabled = false;
        } else if (el.tagName === 'LABEL') {
            el.querySelector('input[type="checkbox"]').disabled = false;
            el.querySelector('input[type="checkbox"]').checked = false;
        }
    });
    fillInBlankInput.classList.remove('correct', 'incorrect');
    fillInBlankInput.disabled = false;
}

function showResults() {
    clearInterval(timerInterval);
    showScreen(resultsScreen);
    totalQuestionsSpan.textContent = questions.length;
    correctAnswersSpan.textContent = score;
    scoreSpan.textContent = `${Math.round((score / questions.length) * 100)}%`;
    progressBar.style.width = '100%';
    questionTracker.textContent = `Quiz Completed!`;
}

function renderReview() {
    reviewContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        if (!validateAnswer(q)) {
            reviewItem.classList.add('incorrect');
        }

        const questionHeading = document.createElement('h3');
        questionHeading.textContent = `Question ${index + 1}: ${q.question}`;
        reviewItem.appendChild(questionHeading);

        const userAnswerPara = document.createElement('p');
        userAnswerPara.innerHTML = `Your Answer: <span class="user-answer">${Array.isArray(q.userAnswer) ? (q.userAnswer.length > 0 ? q.userAnswer.join(', ') : 'No answer') : (q.userAnswer || 'No answer')}</span>`;
        reviewItem.appendChild(userAnswerPara);

        const correctAnswerPara = document.createElement('p');
        correctAnswerPara.innerHTML = `Correct Answer: <span class="correct-answer">${Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</span>`;
        reviewItem.appendChild(correctAnswerPara);

        reviewContainer.appendChild(reviewItem);
    });
}

startQuizBtn.addEventListener('click', () => {
    showScreen(quizScreen);
    quizStarted = true;
    renderQuestion();
});

nextBtn.addEventListener('click', moveToNextQuestion);

submitQuizBtn.addEventListener('click', () => {
    moveToNextQuestion();
});

reviewAnswersBtn.addEventListener('click', () => {
    showScreen(reviewScreen);
    renderReview();
});

backToResultsBtn.addEventListener('click', () => {
    showScreen(resultsScreen);
});

playAgainBtn.addEventListener('click', () => {
    initializeQuiz();
});

window.onload = initializeQuiz;
