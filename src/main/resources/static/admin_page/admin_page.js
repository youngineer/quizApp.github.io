const urlParams = new URLSearchParams(window.location.search);
const adminName = urlParams.get('adminName');

console.log(adminName);

const QUIZZES_PER_PAGE = 3;
let currentPage = 1;
let totalQuizzes = 0;
let totalPages = 0;

function handleCreateQuizClick(event) {
    event.preventDefault();
    
    if (adminName) {
        const redirectURL = `/question_form/question.html?adminName=${encodeURIComponent(adminName)}`;
        window.location.replace(redirectURL);
    } else {
        console.error("Admin name not found in URL");
    }
}

function handleLogoutClick(event) {
    event.preventDefault();
    const loginRedirect = "/login_page/login.html";
    window.location.replace(loginRedirect);
}

function loadQuizToButtons(quizList) {
    const container = document.getElementById("container");
    container.innerHTML = ''; // Clear existing quizzes

    quizList.forEach((quiz, index) => {
        const quizId = quiz[0];
        const creator = quiz[1];
        const time = quiz[2];
        const innerHtml = `
            <a href="/quiz_details/quiz_details.html?adminName=${encodeURIComponent(adminName)}&quizId=${quizId}" class="quiz-link">
                <button class="box" id="box${index + 1}">
                    Quiz ID: ${quizId}<br>
                    Creator: ${creator}<br>
                    Time: ${time}
                </button>
            </a>
        `;
        container.insertAdjacentHTML("beforeend", innerHtml);
    });
}

function createPaginationButtons() {
    console.log("Start pagination");

    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';  

    if (totalPages <= 0) {
        console.log("No pages to display");
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = i;

        button.addEventListener('click', function (e) {
            e.preventDefault(); 
            console.log(`Clicked page: ${i}`);
            changePage(i);  
        });

        if (i === currentPage) {
            button.classList.add('active');  
        }

        li.appendChild(button);
        paginationContainer.appendChild(li);
    }

    console.log("Finished pagination");
}


async function changePage(newPage) {
    console.log(`Changing to page: ${newPage}`);
    currentPage = newPage;
    await getQuizzes(currentPage);
    createPaginationButtons();  
}

async function getQuizzes(page) {
    const offset = (page - 1);
    const getAllQuizEndPoint = `http://localhost:8080/quiz/getAdminQuizzes?username=${adminName}&page=${offset}&size=${QUIZZES_PER_PAGE}`;
    const getAllQuizRequest = new Request(getAllQuizEndPoint, {
        method: "GET",
        headers: new Headers({ "Content-Type": "application/json" }),
    });

    try {
        const response = await fetch(getAllQuizRequest);
        if (response.ok) {
            const responseData = await response.json();
            console.log("spring response:", responseData);
            loadQuizToButtons(responseData.quizzes);
            totalQuizzes = responseData.totalItems;
            totalPages = responseData.totalPages;
            currentPage = responseData.currentPage + 1; 
            createPaginationButtons();
        } else {
            console.error("Failed to fetch quizzes:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching quizzes:", error);
    }
}

function initializeEventListeners() {
    const createQuizBtn = document.getElementById("create-quiz");
    const logoutBtn = document.getElementById("logout");

    createQuizBtn.addEventListener("click", handleCreateQuizClick);
    logoutBtn.addEventListener("click", handleLogoutClick);
}

window.onload = function () {
    console.log("Pagination container:", document.getElementById("pagination"));
    initializeEventListeners();
    getQuizzes(1);
};