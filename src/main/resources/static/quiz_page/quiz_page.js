// // const correctAnswer = ["A", "A", "A", "A", "A"];
// const form = document.querySelector(".quiz-form");
// const result = document.querySelector(".result");
// const question = document.querySelectorAll(".question");

// function reloadPage() {
//     window.location.reload();
// }

// function startTimer() {
//     const duration = 60; 
//     const display = document.querySelector('.timer p');
//     let timer = duration;

//     const interval = setInterval(function () {
//         const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
//         const seconds = String(timer % 60).padStart(2, '0');

//         display.textContent = `${minutes} : ${seconds}`;

//         if (--timer < 0) {
//             clearInterval(interval);
//             document.querySelector('.submit input').click(); 
//         }
//     }, 1000);
// }

// function startQuiz() {
//     const blurTag = document.querySelector("main");
//     const startButton = document.querySelector(".startup");
    
//     blurTag.classList.remove("blur");
//     startButton.classList.add("hide");

//     startTimer(); 
// }


// async function evaluate(userAnswers) {
//     const url = "http://localhost:8080/api/evaluate";
//     // console.log(userAnswers);
//     try {
//         const response = await fetch(url, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userAnswers)
//         });
            
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }
  
//         const evaluationResult = await response.json();
//         // console.log("Server evaluation:", evaluationResult);

//         return evaluationResult;

//     } catch (error) {
//         console.error("Error:", error.message);
//         throw error;
//     }
// }

// form.addEventListener("submit", async (event) => {
//     event.preventDefault();
    
//     const userAnswers = [form.q1.value, form.q2.value, form.q3.value, form.q4.value, form.q5.value];
//     console.log(form.q3.value);
//     console.log(JSON.stringify(userAnswers));
//     // console.log(userAnswers);
    
//     try {
//         const serverEvaluation = await evaluate(userAnswers);
        
//         let score = 0;
//         serverEvaluation.forEach((isCorrect, index) => {
//             if (isCorrect) {
//                 score += 1;
//                 question[index].classList.add("correct");
//             } else {
//                 question[index].classList.add("wrong");
//             }
//         });

//         console.log("Score:", score);

//         result.classList.remove("hide");
//         result.querySelector("p").textContent = `You scored ${score}/5`;

//     } catch (error) {
//         console.error("Failed to evaluate quiz:", error);
//         result.classList.remove("hide");
//         result.querySelector("p").textContent = "Not working";
//     }
// });



// const correctAnswer = ["A", "A", "A", "A", "A"];
// const form = document.querySelector(".quiz-form");
// const result = document.querySelector(".result");
// const question = document.querySelectorAll(".question");
// // const start = document.querySelector()

// form.addEventListener("submit", event => {
//     event.preventDefault();
    
//     let score = 0;
//     const userAnswers = [form.q1.value, form.q2.value, form.q3.value, form.q4.value, form.q5.value];
    
//     userAnswers.forEach((answer, index) => {
//         if(answer === correctAnswer[index]){
//             score += 1;
//             question[index].classList.add("correct");
//         } else {
//             question[index].classList.add("wrong");
//         }
//     });
//     console.log(score);

//     result.classList.remove("hide");
//     result.querySelector("p").textContent = `You scored ${score}/5`;
// });

// function reloadPage() {
//     window.location.reload();
// }

let username;
let quizId;
let time;
let timerInterval;
const form = document.querySelector('form');
const dashboardBtn = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logout");
const result = document.getElementById("result");
const title = document.getElementById("quiz-title");
const loginBar = document.getElementById("login-bar");
const blurredContent = document.getElementById("blurred-content");
const submitButton = document.getElementById("submit-button");
let requestData;

function reloadPage() {
    window.location.reload();
}

function handleLogoutClick(event) {
    event.preventDefault();
    const loginRedirect = "/login_page/login.html";
    window.location.replace(loginRedirect);
}

function handleDashboardClick(event) {
    event.preventDefault();
    const dashboardRedirect = `/user_page/user_page.html?userName=${encodeURIComponent(username)}`;
    window.location.replace(dashboardRedirect);
}

function getQueryParams() {
    const urlParameters = new URLSearchParams(window.location.search);
    username = urlParameters.get("username");
    quizId = urlParameters.get("quizId");
    console.log(username, quizId);
}

function startTimer(timeLimit) {
    const duration = timeLimit * 60; 
    const display = document.getElementById('time');
    let timer = duration;

    timerInterval = setInterval(function () {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');

        display.textContent = `${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            submitButton.click(); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function startQuiz() {
    blurredContent.classList.remove("blur");
    document.querySelector(".startup").classList.add("hide");
    submitButton.classList.remove("blur");
    document.getElementById("timer").classList.remove("hide");

    startTimer(time);
}

function displayQuestions(data) {
    title.innerText = `Quiz ${quizId}`;
    console.log(data);
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = '';

    if (!data.questions || !Array.isArray(data.questions)) {
        console.error("Unexpected data structure:", data);
        return;
    }

    time = Number(data.timeLimit);

    data.questions.forEach((questionQ, index) => {
        let currentQuestion = document.createElement('div');
        currentQuestion.className = 'question';
        currentQuestion.innerHTML = `<p>${index + 1}. ${questionQ.question}</p>`;
        
        [questionQ.option1, questionQ.option2, questionQ.option3, questionQ.option4].forEach((option, i) => {
            if (option) {
                let divElement = document.createElement('div');
                divElement.className = 'option';

                let inputElement = document.createElement('input');
                inputElement.type = 'radio';
                inputElement.name = `q${index + 1}`;
                inputElement.value = option;
                inputElement.id = `q${index + 1}_option${i + 1}`;

                let labelElement = document.createElement('label');
                labelElement.htmlFor = inputElement.id;
                labelElement.innerText = option;

                divElement.appendChild(inputElement);
                divElement.appendChild(labelElement);
                currentQuestion.appendChild(divElement);
            }
        });

        quizContainer.appendChild(currentQuestion);
    });
}

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
    }
}

async function evaluate(userAnswers) { 
    const evaluationEndPoint = `http://localhost:8080/quiz/submit?id=${quizId}&username=${encodeURIComponent(username)}`; 
    
    const evaluateRequest = new Request(evaluationEndPoint, { 
        method: "POST", 
        body: JSON.stringify(userAnswers), 
        headers: {
            'Content-Type': 'application/json'
        }, 
    }); 
 
    try { 
        const response = await fetch(evaluateRequest); 
        if (response.ok) {
            const score = await response.json(); 
            return Number(score);
        } else {
            throw new Error('Server responded with an error');
        }
    } catch (error) {
        console.error("Error during evaluation:", error);
        return null;
    }
}
 
form.addEventListener("submit", async (event) => { 
    event.preventDefault(); 
    stopTimer();
     
    const userAnswers = [];
    const questionElements = document.querySelectorAll(".question"); 
 
    questionElements.forEach((question, index) => { 
        const selectedOption = question.querySelector('input[type="radio"]:checked'); 
        
        if (selectedOption) { 
            const optionNumber = selectedOption.id.split('_option')[1];  
            userAnswers.push(optionNumber);  
        } else { 
            userAnswers.push(""); 
        } 
    });
    
    try { 
        const score = await evaluate(userAnswers); 
         
        if (score === null) {
            console.error("Failed to evaluate quiz");
            result.classList.remove("hide"); 
            result.querySelector("p").textContent = "Evaluation failed"; 
        } else { 
            console.log("Score:", score); 
 
            questionElements.forEach((question, index) => {
                if (index < score) {
                    question.classList.add("correct");
                } else {
                    question.classList.add("wrong");
                }
            });
 
            result.classList.remove("hide"); 
            result.querySelector("p").textContent = `You scored ${score}/${userAnswers.length}`; 
        } 

        loginBar.classList.remove("hide");
        document.getElementById("username").textContent = `Thank you, ${username}`;
        document.body.classList.add("login-bar-visible");

    } catch (error) { 
        console.error("Failed to evaluate quiz:", error); 
        result.classList.remove("hide"); 
        result.querySelector("p").textContent = "Evaluation failed"; 
    } 
});

window.onload = function () {
    getQueryParams();
    getQuiz(quizId);
    logoutBtn.addEventListener("click", handleLogoutClick);
    dashboardBtn.addEventListener("click", handleDashboardClick);
}