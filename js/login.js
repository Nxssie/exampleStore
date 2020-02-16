//I hate global variables as a normal developer should do. I promise.



export function loginInitialize() {
    buttonsListeners();

    register();
    login();
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

let register = () => {
    let email = document.getElementById("registerForm").email.value;
    let password = document.getElementById("registerForm").psw.value;
    let validated = 0;

    if (validated == 0) {
        //Future validation?
        validated = 1;
    }
    
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    console.log("Signed Up");

};

let login = () => {
  console.log("Logged in")  ;
};