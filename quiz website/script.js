const appContainer = document.getElementById('app-container');
const navHome = document.getElementById('nav-home');
const navCreateQuiz = document.getElementById('nav-create-quiz');
const navTakeQuiz = document.getElementById('nav-take-quiz');

// --- Data Store (Frontend only, not persistent) ---
let quizzes = [
    {
        id: 'quiz1',
        title: 'Basic JavaScript Quiz',
        description: 'Test your fundamental JavaScript knowledge!',
        questions: [
            {
                text: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High-level Text Management Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
                correctAnswer: 'Hyper Text Markup Language'
            },
            {
                text: 'Which CSS property is used for changing the font of an element?',
                options: ['font-style', 'text-style', 'font-family', 'text-font'],
                correctAnswer: 'font-family'
            },
            {
                text: 'Which keyword is used to declare a constant in JavaScript?',
                options: ['var', 'let', 'const', 'static'],
                correctAnswer: 'const'
            }
        ]
    },
    {
        id: 'quiz2',
        title: 'General Knowledge Quiz',
        description: 'A mix of various topics to challenge your brain!',
        questions: [
            {
                text: 'What is the capital of France?',
                options: ['Berlin', 'Madrid', 'Rome', 'Paris'],
                correctAnswer: 'Paris'
            },
            {
                text: 'Who painted the Mona Lisa?',
                options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
                correctAnswer: 'Leonardo da Vinci'
            },
            {
                text: 'What is the largest ocean on Earth?',
                options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
                correctAnswer: 'Pacific Ocean'
            }
        ]
    }
];

let currentQuizBeingTaken = null;
let currentQuestionIndex = 0;
let userAnswers = []; // Stores objects like { questionIndex, selectedOption }

// --- Routing/Page Rendering Functions ---
function renderHomePage() {
    appContainer.innerHTML = `
        <div class="home-page">
            <h2>Welcome to QuizMaster!</h2>
            <p>Your platform for creating and challenging minds.</p>
            <div class="actions">
                <button id="home-create-quiz-btn">Create a Quiz</button>
                <button id="home-take-quiz-btn">Take a Quiz</button>
            </div>
        </div>
    `;
    document.getElementById('home-create-quiz-btn').addEventListener('click', renderQuizCreationPage);
    document.getElementById('home-take-quiz-btn').addEventListener('click', renderQuizListingPage);
}

function renderQuizCreationPage() {
    let questionCount = 1;
    appContainer.innerHTML = `
        <h2>Create New Quiz</h2>
        <form id="create-quiz-form">
            <div class="form-group">
                <label for="quiz-title">Quiz Title</label>
                <input type="text" id="quiz-title" required>
            </div>
            <div class="form-group">
                <label for="quiz-description">Quiz Description</label>
                <textarea id="quiz-description"></textarea>
            </div>

            <div id="questions-container">
                </div>

            <button type="button" class="primary-btn" id="add-question-btn">Add Question</button>
            <button type="submit" class="success-btn">Save Quiz (Frontend Only)</button>
        </form>
    `;

    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const createQuizForm = document.getElementById('create-quiz-form');

    function addQuestionForm() {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-form-item');
        questionDiv.dataset.questionId = questionCount; // Unique ID for removal

        questionDiv.innerHTML = `
            <h3>Question ${questionCount}</h3>
            <div class="form-group">
                <label for="q${questionCount}-text">Question Text</label>
                <input type="text" id="q${questionCount}-text" required>
            </div>
            <div class="form-group">
                <label>Options:</label>
                <div class="option-group">
                    <label>A)</label><input type="text" id="q${questionCount}-option-A" required>
                    <input type="radio" name="q${questionCount}-correct" value="A" required> Correct
                </div>
                <div class="option-group">
                    <label>B)</label><input type="text" id="q${questionCount}-option-B" required>
                    <input type="radio" name="q${questionCount}-correct" value="B"> Correct
                </div>
                <div class="option-group">
                    <label>C)</label><input type="text" id="q${questionCount}-option-C" required>
                    <input type="radio" name="q${questionCount}-correct" value="C"> Correct
                </div>
                <div class="option-group">
                    <label>D)</label><input type="text" id="q${questionCount}-option-D" required>
                    <input type="radio" name="q${questionCount}-correct" value="D"> Correct
                </div>
            </div>
            <button type="button" class="remove-question-btn" data-question-id="${questionCount}">Remove</button>
        `;
        questionsContainer.appendChild(questionDiv);
        questionCount++;
        // Add event listener for the new remove button
        questionDiv.querySelector('.remove-question-btn').addEventListener('click', (e) => {
            const idToRemove = e.target.dataset.questionId;
            document.querySelector(`.question-form-item[data-question-id="${idToRemove}"]`).remove();
            // Re-label questions if needed, but for simplicity, we'll skip for now
        });
    }

    // Add initial question forms
    addQuestionForm();
    addQuestionForm();

    addQuestionBtn.addEventListener('click', addQuestionForm);

    createQuizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Quiz data collected! In a real app, this would now be sent to a backend API to save to a database.');
        // For a real app, you'd extract all form data here and send it.
        // Example:
        // const newQuiz = {
        //     title: document.getElementById('quiz-title').value,
        //     description: document.getElementById('quiz-description').value,
        //     questions: []
        // };
        // // Loop through questionsContainer children to get each question's data
        // // Then push to newQuiz.questions
        // console.log(newQuiz);
        renderHomePage(); // Go back to home after "saving"
    });
}

function renderQuizListingPage() {
    appContainer.innerHTML = `
        <div class="quiz-list">
            <h2>Available Quizzes</h2>
            <div id="quiz-cards-container">
                </div>
        </div>
    `;
    const quizCardsContainer = document.getElementById('quiz-cards-container');

    if (quizzes.length === 0) {
        quizCardsContainer.innerHTML = '<p>No quizzes available yet. Why not create one?</p>';
        return;
    }

    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.classList.add('quiz-card');
        quizCard.innerHTML = `
            <div>
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <p>Questions: ${quiz.questions.length}</p>
            </div>
            <button class="take-quiz-btn" data-quiz-id="${quiz.id}">Take Quiz</button>
        `;
        quizCardsContainer.appendChild(quizCard);
    });

    // Add event listeners for "Take Quiz" buttons
    quizCardsContainer.querySelectorAll('.take-quiz-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const quizId = e.target.dataset.quizId;
            startQuiz(quizId);
        });
    });
}

function startQuiz(quizId) {
    currentQuizBeingTaken = quizzes.find(q => q.id === quizId);
    currentQuestionIndex = 0;
    userAnswers = []; // Reset answers for a new quiz
    if (currentQuizBeingTaken) {
        renderQuizQuestion();
    } else {
        alert('Quiz not found!');
        renderQuizListingPage();
    }
}

function renderQuizQuestion() {
    if (!currentQuizBeingTaken || currentQuestionIndex >= currentQuizBeingTaken.questions.length) {
        renderQuizResults();
        return;
    }

    const question = currentQuizBeingTaken.questions[currentQuestionIndex];
    const isLastQuestion = (currentQuestionIndex === currentQuizBeingTaken.questions.length - 1);

    appContainer.innerHTML = `
        <div class="quiz-taking">
            <h2>${currentQuizBeingTaken.title}</h2>
            <div class="question-display">
                <p>Question ${currentQuestionIndex + 1} of ${currentQuizBeingTaken.questions.length}</p>
                <p>${question.text}</p>
                <div class="options-list">
                    ${question.options.map((option, index) => `
                        <label>
                            <input type="radio" name="current-question-option" value="${option}">
                            ${String.fromCharCode(65 + index)}) ${option}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="navigation-buttons">
                <button class="primary-btn" id="next-question-btn">${isLastQuestion ? 'Submit Quiz' : 'Next Question'}</button>
            </div>
        </div>
    `;

    // Pre-select user's previous answer if available (for navigation back/forth - not implemented here, but good for future)
    const existingAnswer = userAnswers.find(ans => ans.questionIndex === currentQuestionIndex);
    if (existingAnswer) {
        document.querySelector(`input[name="current-question-option"][value="${existingAnswer.selectedOption}"]`).checked = true;
    }

    document.getElementById('next-question-btn').addEventListener('click', () => {
        const selectedOptionInput = document.querySelector('input[name="current-question-option"]:checked');
        if (!selectedOptionInput) {
            alert('Please select an option!');
            return;
        }

        userAnswers[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedOption: selectedOptionInput.value,
            questionText: question.text,
            correctAnswer: question.correctAnswer
        };

        currentQuestionIndex++;
        renderQuizQuestion(); // Renders next question or results
    });
}

function renderQuizResults() {
    let score = 0;
    currentQuizBeingTaken.questions.forEach((question, index) => {
        const userAnswerObj = userAnswers.find(ans => ans.questionIndex === index);
        if (userAnswerObj && userAnswerObj.selectedOption === question.correctAnswer) {
            score++;
        }
    });

    appContainer.innerHTML = `
        <div class="quiz-results">
            <h2>Quiz Completed!</h2>
            <p>You scored ${score} out of ${currentQuizBeingTaken.questions.length}!</p>
            <div class="navigation-buttons">
                <button class="primary-btn" onclick="renderQuizListingPage()">Take Another Quiz</button>
                <button class="success-btn" onclick="renderHomePage()">Go to Home</button>
            </div>

            <div class="review-answers">
                <h3>Review Your Answers</h3>
                ${currentQuizBeingTaken.questions.map((question, index) => {
                    const userAnswerObj = userAnswers.find(ans => ans.questionIndex === index);
                    const userAnswer = userAnswerObj ? userAnswerObj.selectedOption : 'No answer';
                    const isCorrect = userAnswer === question.correctAnswer;
                    const answerClass = isCorrect ? 'correct-answer' : 'incorrect-answer';
                    const answerStatus = isCorrect ? 'Correct' : 'Incorrect';

                    return `
                        <div class="review-item">
                            <p><strong>Question ${index + 1}:</strong> ${question.text}</p>
                            <p>Your Answer: <span class="user-answer">${userAnswer}</span> (${answerStatus})</p>
                            ${!isCorrect ? `<p>Correct Answer: <span class="correct-answer">${question.correctAnswer}</span></p>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    // Optionally, if users were logged in, send score to backend to update user's profile
}

// --- Event Listeners for Navigation ---
navHome.addEventListener('click', renderHomePage);
navCreateQuiz.addEventListener('click', renderQuizCreationPage);
navTakeQuiz.addEventListener('click', renderQuizListingPage);

// --- Initialize the app on page load ---
document.addEventListener('DOMContentLoaded', renderHomePage);