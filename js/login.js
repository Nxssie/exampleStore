//I hate global variables as a normal developer should do. I promise.
const registerForm = document.getElementById("register-form");


export function loginInitialize() {
    buttonsListeners();
}

let buttonsListeners = () => {
    let initialButton = document.getElementById("register-button");
    let cancelBtn = document.getElementById("cancel-button");
    let closeBtn = document.getElementById("close-button");
    let registerSubmit = document.getElementById("register-submit");

    initialButton.addEventListener("click", () => {
        document.getElementById('id01').style.display='block'
    });

    cancelBtn.addEventListener("click", () => {
        document.getElementById('id01').style.display='none'
    });

    closeBtn.addEventListener("click", () => {
        document.getElementById('id01').style.display='none'
    });

    registerSubmit.addEventListener("submit", register);
}

function register (event) {
    event.preventDefault();
    let email = event.target.email.value;
    let password = event.target.psw.value;

    console.log(email);
    console.log(password);
    
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    console.log("Signed Up");
}

let login = () => {
  console.log("Logged in")  ;
};