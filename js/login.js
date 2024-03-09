import { initializeApp, getAnalytics } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbcBZfwy0N9luIE9gnONuOLxNkuyV8amI",
    authDomain: "pugnators-1821a.firebaseapp.com",
    projectId: "pugnators-1821a",
    storageBucket: "pugnators-1821a.appspot.com",
    messagingSenderId: "942522410655",
    appId: "1:942522410655:web:fd58ed131813d85e3ca4aa",
    measurementId: "G-7T45QC64CD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
        // Email is good
        return true;
    } else {
        // Email is not good
        return false;
    }
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
        return false;
    } else {
        return true;
    }
}

function validate_field(field) {
    if (field == null) {
        return false;
    }
    if (field.length <= 0) {
        return false;
    } else {
        return true;
    }
}