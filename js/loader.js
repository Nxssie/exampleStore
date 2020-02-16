window.onload = initialize;

import {storeInitialize} from "./store.js";
import {loginInitialize} from "./login.js";


function initialize() {
    initializeFirebase();
    loginInitialize();
    storeInitialize();

}

// This is the most boring part of the code, just close your eyes, please
function initializeFirebase() {
    let firebaseConfig = {
        apiKey: "AIzaSyAmDr6GpyPE4utgKJTLAZzjUbIwXJ767Ls",
        authDomain: "examplestore-1b638.firebaseapp.com",
        databaseURL: "https://examplestore-1b638.firebaseio.com",
        projectId: "examplestore-1b638",
        storageBucket: "examplestore-1b638.appspot.com",
        messagingSenderId: "821111168891",
        appId: "1:821111168891:web:8a0aa658ed6acd5871e7de"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("firebase initializated");
}