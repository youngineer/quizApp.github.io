let questionList;
let adminName;
let quizId;

function getAdminParams() {
    const urlParams = new URLSearchParams(window.location.search);
    adminName = urlParams.get("adminName");
    quizId = urlParams.get("quizId");
    console.log(adminName, quizId);
}

function postAdminNameAndQuizId() {
    const targetTag = document.getElementById("username");
    targetTag.innerText = `Welcome, ${adminName}`;

    const headingTag = document.getElementById("heading");
    headingTag.innerText = `Quiz ${quizId}`;
}

function displayQuestions(data) {
    console.log("Data received:", data);
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    if (!data.questions || !Array.isArray(data.questions)) {
        console.error("Unexpected data structure:", data);
        return;
    }

    const timeLimitElement = document.createElement('div');
    timeLimitElement.className = 'time-limit';
    timeLimitElement.innerHTML = `<h3>Time Limit: ${data.timeLimit} minutes</h3>`;
    quizContainer.appendChild(timeLimitElement);

    data.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';

        let optionsHTML = '';
        [question.option1, question.option2, question.option3, question.option4].forEach((option, i) => {
            if (option) {
                optionsHTML += `<li class="option">Option ${i + 1}: ${option}</li>`;
            }
        });

        questionElement.innerHTML = `
            <h3>Question ${index + 1}: ${question.question}</h3>
            <ul class="options">
                ${optionsHTML}
            </ul>
            <p><strong>Correct Answer: Option ${question.correctOption}</strong></p>
        `;

        quizContainer.appendChild(questionElement);
    });
}

document.getElementById('dashboardBtn').addEventListener('click', () => {
    window.location.href = `/admin_page/admin_page.html?adminName=${encodeURIComponent(adminName)}`;
});

document.getElementById('logout').addEventListener('click', () => {
    window.location.href = '/login_page/login.html';
});

async function getQuiz(quizId) {
    try {
        const response = await fetch(`http://localhost:8080/questions/getQuestions?quizId=${quizId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const questions = await response.json();
        console.log(typeof(questions));
        displayQuestions(questions);

    } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to load questions. Please try again.');
    }
}

window.onload = () => {
    getAdminParams();
    postAdminNameAndQuizId();
    getQuiz(quizId);
};