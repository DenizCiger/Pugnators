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
// Initialize Variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
    // Get all our input fields
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    username = document.getElementById('username').value;
    // Validate input fields
    if (validate_email(email) == false) {
        alert('Your email is invalid!');
        return;
        // Don't continue running the code
    }
    if (validate_password(password) == false) {
        alert('Your password is invalid! It must be at least 6 characters long!');
        return;
        // Don't continue running the code
    }
    if (validate_field(full_name) == false || validate_field(username) == false) {
        alert('One or More Fields is Outta Line!!');
        return;
    }
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function() {
            // Declare user variable
            var user = auth.currentUser;
            // Add this user to Firebase Database
            var database_ref = database.ref();
            // Create User Data
            var user_data = {
                email: email,
                username: username,
                last_login: Date.now()
            };
            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data);
            alert('User Created!!');
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code;
            var error_message = error.message;
            alert(error_message);
        });
}

// Set up our login function
function login() {
    // Get all our input fields
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    // Validate input fields
    if (validate_email(email) == false) {
        alert('Your email is invalid!');
        return;
        // Don't continue running the code
    }
    if (validate_password(password) == false) {
        alert('Your password is invalid! It must be at least 6 characters long!');
        return;
        // Don't continue running the code
    }
    auth.signInWithEmailAndPassword(email, password)
        .then(function() {
            // Declare user variable
            var user = auth.currentUser;
            // Add this user to Firebase Database
            var database_ref = database.ref();
            // Create User Data
            var user_data = {
                last_login: Date.now()
            };
            // Push to Firebase Database
            database_ref.child('users/' + user.uid).update(user_data);
            alert('User Logged In!');
        })
        .catch(function(error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code;
            var error_message = error.message;
            alert(error_message);
        });
}

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