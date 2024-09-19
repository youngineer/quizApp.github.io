let optionCounter = 3; 
const questionHtml = `<li>
                    <form class="form" id="form-content">
                        <!-- <label for="question-area">Enter the question:</label> -->
                        <input type="text" class="question-area" placeholder="Enter your question here" id="question">
                        
                        <div class="options-container">
                            
                            <ul class="options-list">
                                <li class="option-item">
                                    <input type="text" class="option-input" placeholder="Option 1">
                                    <button type="button" class="delete-option" onclick="deleteOption(this)">Delete</button>
                                </li>
    
                                <li class="option-item">
                                    <input type="text" class="option-input" placeholder="Option 2">
                                    <button type="button" class="delete-option" onclick="deleteOption(this)">Delete</button>
                                </li>
                            </ul>

                            <div class="add-option-delete-question">
                                <button type="button" class="add-option" onclick="addOption(this)">Add Option</button>
                            </div>
                            
                            <div class="answer-container">
                                <label for="answer-input">Select the correct option:</label>
                                <select name="answer-input" id="correct-answer">
                                    <option value="1" class="options" id="option1">1</option>
                                    <option value="2" class="options" id="option2">2</option>
                                </select>
                                <!-- <input type="text" class="answer-input" placeholder="Enter your answer here"> -->
                            </div>
                            
                            <div class="add-option-delete-question">
                                <button type="button" class="delete-question" onclick="deleteQuestion(this)">Delete Question</button>
                            </div>
                        </div>
                        
                    </form>
                </li>`;

const optionHTML = `
    <li class="option-item">
        <input type="text" class="option-input" placeholder="Option ${optionCounter}">
        <button type="button" class="delete-option" onclick="deleteOption(this)">Delete</button>
    </li>
`;

// const answerDropDownHtml = `
//     <option value="${optionCounter}">Option ${optionCounter}</option>
// `;
                

const answerDropDownHtml = `<option value="2" class="options" id="option${optionCounter}">${optionCounter}</option>`;

let adminUserName;

function getAdminName() {
    const queryParam = new URLSearchParams(window.location.search);
    adminUserName = queryParam.get('adminName');
    console.log(adminUserName);
    // document.getElementById('admin-info').innerText = `${adminUserName}`;
}

window.onload = getAdminName();

// let optionCounter = 3;
let questionList = [];

// const optionHTML = `<li class="option-item">
//                         <input type="text" class="option-input" placeholder="Option ${optionCounter}">
//                         <button type="button" class="delete-option" onclick="deleteOption(this)">Delete</button>
//                     </li>`;


function addOption(button) {
    const optionsContainer = button.closest('.options-container');
    const optionsList = optionsContainer.querySelector('.options-list');
    const answerDropDownList = document.getElementById("correct-answer");

    optionCounter = answerDropDownList.childElementCount + 1;  
    console.log("Current optionCounter:", optionCounter);

    if (optionCounter > 4) {
        alert('You can have only 4 options');
    } else {
        console.log("Adding option to dropdown:", optionCounter);
        answerDropDownList.insertAdjacentHTML(
            "beforeend", 
            `<option value="${optionCounter}" class="options" id="option${optionCounter}">${optionCounter}</option>`
        );

        console.log("Adding option to list:", optionCounter);
        optionsList.insertAdjacentHTML(
            'beforeend', 
            `<li class="option-item" data-option-number="${optionCounter}">
                <input type="text" class="option-input" placeholder="Option ${optionCounter}">
                <button type="button" class="delete-option" onclick="deleteOption(this)">Delete</button>
            </li>`
        );

        console.log("New optionCounter after addition:", optionCounter);

        console.log("Current dropdown options:", answerDropDownList.innerHTML);
    }
}


function deleteOption(button) {
    const optionItem = button.closest('.option-item');
    const optionNumber = optionItem.getAttribute('data-option-number');

    // Remove the option item from the list
    optionItem.remove();

    // Remove the corresponding dropdown option
    const answerDropDownList = document.getElementById("correct-answer");
    const optionToRemove = answerDropDownList.querySelector(`option[value="${optionNumber}"]`);
    
    if (optionToRemove) {
        optionToRemove.remove();
    }

    console.log(`Option ${optionNumber} removed`);

    // Now renumber all remaining options
    const optionsList = document.querySelector('.options-list');
    const remainingOptions = optionsList.querySelectorAll('.option-item');

    answerDropDownList.innerHTML = '';  // Clear dropdown to rebuild it

    // Renumber remaining options and rebuild the dropdown
    remainingOptions.forEach((item, index) => {
        const newNumber = index + 1;  // Start renumbering from 1
        item.setAttribute('data-option-number', newNumber);
        item.querySelector('.option-input').placeholder = `Option ${newNumber}`;

        // Add updated option to dropdown
        answerDropDownList.insertAdjacentHTML(
            "beforeend", 
            `<option value="${newNumber}" class="options" id="option${newNumber}">${newNumber}</option>`
        );
    });

    // Update the optionCounter based on the remaining options
    optionCounter = remainingOptions.length + 1;
    console.log("New optionCounter after deletion and renumbering:", optionCounter);
}




function addQuestion() {
    const questionList = document.querySelector('.question-list');
    questionList.insertAdjacentHTML('beforeend', questionHtml);
}

function deleteQuestion(button) {
    const questionItem = button.parentNode.parentNode.parentNode;
    questionItem.parentNode.removeChild(questionItem);
}

document.querySelector(".add-question").addEventListener("click", function(event) {
    event.preventDefault();
    addQuestion();
});



function getQuestions() {
    let questionList = [];
    let messageTag = document.getElementById("error-message");

    const questionForms = document.querySelectorAll('.form');

    questionForms.forEach((form) => {
        const questionInput = form.querySelector('.question-area');
        const question = questionInput ? questionInput.value.trim() : null;

        if (!question) {
            alert("Question cannot be empty");
            console.error("Question cannot be empty!");
            return;
        }

        const optionInputs = form.querySelectorAll('.option-input');
        const options = Array.from(optionInputs).map(input => {
            const optionValue = input.value.trim();
            return optionValue === "" ? null : optionValue;
        });

        const correctAnswerSelect = form.querySelector("#correct-answer");
        const selectedValue = correctAnswerSelect.value; 
        console.log("Selected Answer:", selectedValue);

        if (!selectedValue) {
            alert("Correct answer cannot be empty");
            console.error("Correct answer cannot be empty!");
            return;
        }

        let questionObj = {
            questionText: question,
            option1: options[0] || null,
            option2: options[1] || null,
            option3: options[2] || null,
            option4: options[3] || null,
            correctOption: selectedValue,
        };

        questionList.push(questionObj);
    });

    return questionList;
}



const adminPageHeader = new Headers();
adminPageHeader.append("Content-Type", "application/json");

async function postQuiz(time, questions) {
    const postQuizEndPoint = "http://localhost:8080/quiz/postQuiz";
    const postRequest = new Request(postQuizEndPoint, {
        method: "POST",
        body: JSON.stringify({
            timeLimit: time,
            username: adminUserName,
            questionList: questions
        }),
        headers: adminPageHeader,
    });

    try {
        const response = await fetch(postRequest);
        console.log(response.text);
        if (response.ok) {
            console.log(response.text);
            window.location.replace(`http://127.0.0.1:5500/admin_page/admin_page.html?adminName=${encodeURIComponent(adminUserName)}`);
                }
        return response.ok;
    } catch (error) {
        console.error("Questions not posted; Error: ", error);
        return false;
    }
}


document.querySelector("#submit-quiz").addEventListener('click', async () => {
    // const time = prompt('Please enter the time limit: ');
    const timeTag = document.getElementById("time-limit");
    const time = timeTag.value;
    console.log(time);
    const questionList = getQuestions();
    console.log(questionList);

    if (questionList.length > 0) {
        const response = await postQuiz(time, questionList);
        alert("Quiz successfully posted!");
        console.log(response);
        window.location.replace(`http://127.0.0.1:5500/admin_page/admin_page.html?adminName=${encodeURIComponent(adminUserName)}`);
        

    } else {
        alert("Please add at least one question before submitting.");
    }
});

// const logoutBtn = document.getElementById("logout");
// logoutBtn.addEventListener("click", (event) => {
//     event.preventDefault();
//     window.location.replace("http://127.0.0.1:5500/login_page/login.html");
// });
                    