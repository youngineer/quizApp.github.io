const urlSearchParams = new URLSearchParams(window.location.search);
const username = urlSearchParams.get('userName');

const logoutBtn = document.getElementById("logout");
const loginRedirect = "/login_page/login.html";
const QUIZZES_PER_PAGE = 3;  
let currentPage = 0; 

logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.replace(loginRedirect);
});

async function getAllQuizzes(page) {
    console.log(`Entered getAllQuiz`);
    const usernameArea = document.getElementById("username");
    usernameArea.innerText = `Welcome, ${username}`;

    const quizEndpoint = `http://localhost:8080/quiz/getAll?username=${encodeURIComponent(username)}&page=${page}&size=${QUIZZES_PER_PAGE}`;
    
    try {
        const response = await fetch(quizEndpoint);
        
        if (response.ok) {
            const quizData = await response.json();
            console.log(quizData);
            loadQuizToButtons(quizData.quizzes);
            setupPagination(quizData.totalItems, quizData.totalPages);
            currentPage = quizData.currentPage;  
        } else {
            console.error("Failed to fetch quizzes:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching quizzes:", error);
    }

    console.log(`Exited getAllQuiz`);
}

function loadQuizToButtons(quizList) {
    const container = document.getElementById("container");
    container.innerHTML = `
        <div id="quizzes-container"></div>
        <div id="pagination-container"></div>
    `;
    
    const quizzesContainer = document.getElementById("quizzes-container");
    
    quizList.forEach((quiz, index) => {
        const quizId = quiz.quizId;     
        const quizCreator = quiz.creator; 
        const quizScore = quiz.userScore;
        let quizButtonHtml;

        if(quizScore === -1) {
            quizButtonHtml = `
                <a href="/quiz_page/quiz_page.html?username=${username}&quizId=${quizId}" class="quiz-link">
                    <button class="box" id="box${index + 1}">
                        Quiz ID: ${quizId}<br />Created By: ${quizCreator}
                    </button>
                </a>
            `;
        } else {
            quizButtonHtml = `
                <button class="box" id="box${index + 1}">
                    Quiz ID: ${quizId}<br />Created By: ${quizCreator}<br />Your score: ${quizScore}
                </button>
            `;
        }

        quizzesContainer.insertAdjacentHTML("beforeend", quizButtonHtml);
    });
}

function setupPagination(totalItems, totalPages) {
    console.log(`Entered setupPagination`);
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = '';
    paginationContainer.className = 'pagination';

    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i + 1;
        pageButton.classList.add('pagination-btn');

        if (i === currentPage) pageButton.classList.add('active');
        pageButton.addEventListener('click', () => {
            currentPage = i;
            getAllQuizzes(currentPage);
        });

        paginationContainer.appendChild(pageButton);
    }

    console.log(`Exited setupPagination`);
}

window.onload = () => getAllQuizzes(currentPage);