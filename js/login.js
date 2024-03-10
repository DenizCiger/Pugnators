"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("firebase/app"));
require("firebase/auth");
const auth_1 = require("firebase/auth");
require("firebase/database");
const database_1 = require("firebase/database");
const firebaseConfig = {
    apiKey: "AIzaSyCbcBZfwy0N9luIE9gnONuOLxNkuyV8amI",
    authDomain: "pugnators-1821a.firebaseapp.com",
    databaseURL: "https://pugnators-1821a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pugnators-1821a",
    storageBucket: "pugnators-1821a.appspot.com",
    messagingSenderId: "942522410655",
    appId: "1:942522410655:web:fd58ed131813d85e3ca4aa",
    measurementId: "G-7T45QC64CD"
};
const app = app_1.default.initializeApp(firebaseConfig);
const auth = (0, auth_1.getAuth)(app);
const database = (0, database_1.getDatabase)(app);
console.log(auth, database);
function register() {
    let usernameElement = document.getElementById('username');
    let emailElement = document.getElementById('email');
    let passwordElement = document.getElementById('password');
    let username = usernameElement ? usernameElement.value : '';
    let email = emailElement ? emailElement.value : '';
    let password = passwordElement ? passwordElement.value : '';
    if (!validate_username(username) || !validate_email(email) || !validate_password(password))
        return;
    (0, auth_1.createUserWithEmailAndPassword)(auth, email, password)
        .then((userCredential) => {
        const user = userCredential.user;
        alert(`${user} Signed Up!`);
    })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`${errorMessage} Code: ${errorCode}`);
    });
}
function login() {
    let emailElement = document.getElementById('email');
    let passwordElement = document.getElementById('password');
    let email = emailElement ? emailElement.value : '';
    let password = passwordElement ? passwordElement.value : '';
    if (!validate_email(email) || !validate_password(password))
        return;
    (0, auth_1.signInWithEmailAndPassword)(auth, email, password)
        .then((userCredential) => {
        const user = userCredential.user;
        alert(`${user} Signed In!`);
    })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`${errorMessage} Code: ${errorCode}`);
    });
}
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email)) {
        return true;
    }
    else {
        alert('Invalid email format');
        return false;
    }
}
function validate_password(password) {
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    else {
        return true;
    }
}
function validate_username(username) {
    if (username.length < 3) {
        alert('Username must be at least 3 characters long');
        return false;
    }
    else {
        return true;
    }
}