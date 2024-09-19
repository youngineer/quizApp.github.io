function isFilled(username, password) {
    return username !== "" && password !== "";
}

function displayMessage(message, type) {
    let messageTag;
    if (type === 'login') {
        messageTag = document.getElementById("login-message");

    } else if (type === 'signup') {
        messageTag = document.getElementById("signup-message");
    }

    // if (messageTag) { 
        // switch (message) {
        //     case 'success':
        //         messageTag.innerText = opSuccess;
        //         break;

        //     case 'passwordMismatch':
        //         messageTag.innerText = incorrectPassword;
        //         break;

        //     case 'userNotFound':
        //         messageTag.innerText = noSuchUser;
        //         break;

        //     default:
        //         messageTag.innerText = 'Unknown error';
        //         break;
        // }
    if(messageTag){
        messageTag.innerText = message;
        messageTag.classList.remove("hide");
    }
    else {
        console.error("TypeError:", type);
    }
}

var role;
var responseText;
const loginBtns = document.querySelectorAll(".login-btn");
const registerBtns = document.querySelectorAll(".register-btn");

loginBtns.forEach(btn => {
    btn.addEventListener("click", async event => {
        role = event.target.id.includes("admin") ? "admin" : "user";
        const userid = document.getElementById("login-username").value;
        const userPassword = document.getElementById("login-password").value;

        if (!isFilled(userid, userPassword)) {
            displayMessage('Please enter the details', 'login');

        } else {
            // Proceed with login validation
            const success = await validateLogin(userid, userPassword, role);
            if (success) {
                displayMessage(responseText, 'login');

            } else {
                displayMessage(responseText, 'login');
            }
        }
    });
});

registerBtns.forEach(btn => {
    btn.addEventListener("click", async event => {
        regRole = event.target.id.includes("admin") ? "admin" : "user";
        const userid = document.getElementById("signup-username").value;
        const userPassword = document.getElementById("signup-password").value;
        const retypePassword = document.getElementById("retype-password").value;

        if (!isFilled(userid, userPassword) || !isFilled(userid, retypePassword)) {
            displayMessage('userNotFound', 'signup');

        } else if (userPassword !== retypePassword) {
            displayMessage('passwordMismatch', 'signup');

        } else {
            // Proceed with registration
            const success = await registerUser(userid, userPassword, regRole);
            if (success) {
                displayMessage('success', 'signup');

            } else {
                displayMessage('userNotFound', 'signup');
            }
        }

        console.log("Registration attempted with Username:", userid, "Password:", userPassword, "Retype Password:", retypePassword);
    });
});


const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

async function validateLogin(username, password, role) {
    const loginEndPoint = "http://localhost:8080/user/signin";
    const loginRequest = new Request(loginEndPoint, {
        method: "POST",
        body: JSON.stringify({username, password, role}),
        headers: myHeaders,
    });

    try {
        const response = await fetch(loginRequest);
        
        if (response.ok) {
            responseText = await response.text();
            
            console.log("Response from backend:", responseText);
            console.log(typeof(responseText));
            displayMessage(responseText, 'login');

            if(responseText == "Credentials verified!"){
                console.log(role);
                if (role === 'admin') {
                    window.location.replace(`/admin_page/admin_page.html?adminName=${encodeURIComponent(username)}`);
                } else {
                    window.location.replace(`/user_page/user_page.html?userName=${encodeURIComponent(username)}`);
                }
            return true;
        }

        } else {
            console.error("Login failed with status:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
}


async function registerUser(username, password, role) {
    const registerEndPoint = "http://localhost:8080/user/signup";
    const signupRequest = new Request(registerEndPoint, {
        method: "POST",
        body: JSON.stringify({username, password, role}),
        headers: myHeaders,
    });

    try {
        const response = await fetch(signupRequest);
        console.log(response);
        console.log(`Json: ${response.json}`);
        console.log(`StatusText: ${response.statusText}`);
        console.log(`Body: ${response.body}`);

        // if(response.ok)
        //     window.location.replace("http://127.0.0.1:5500/user_login/user_login.html");
        
        return response.ok;


    } catch (error) {
        console.error("Registration failed:", error);
        return false;
    }
}

