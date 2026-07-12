//1. To prevent the reload button, idenitfy the id assigned to the form in the HTML file.
//In javascript, assign a variable to the id.
//add a method that listens for submit, then prevent the submit event with the 'event.preventDefault()

//2. To disable button to prevent doubleclick,
// assign a variable to the id of the button, and create an event listener that listens to when the button is clicked.
//when the button is cicked, the button should be disabled (eg. btn.disabled = true).
//The BUTTON sends a request to firebase to check if the user already has an account and provides a response.
//Once the response is received, the next line of code should be to activate the button again. (btn.disabled = false)

//3. Call Firebase
//Not sure what this means. I guess firebase finds the particular email using the .find() method. This provides the first email that exactly matches the user's inputed email.

//4. firebase checks if user email is exactly equal to database email AND user password is exactly equal to database password. then it shows a susccessful sign in. Else show a message saying INVALID CREDENTIALS.


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2yk67GsHakRcoPY9JWI6XlgFntCsQomQ",
    authDomain: "afrivista-tourism.firebaseapp.com",
    projectId: "afrivista-tourism",
    storageBucket: "afrivista-tourism.firebasestorage.app",
    messagingSenderId: "1042806811109",
    appId: "1:1042806811109:web:4e5ad306fb3dc429c3270c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const signinForm = document.getElementById('signin-form');
const btn = document.getElementById('submitBtn');

document.getElementById('toggleIcon').addEventListener('click', () => {
    const icon = document.getElementById('toggleIcon');
    const userPassword = document.getElementById('password');

    if (userPassword.type === 'password') {
        icon.className = 'fa-solid fa-eye-slash';
        userPassword.type = 'text';
    } else {
        icon.className = 'fa-solid fa-eye';
        userPassword.type = 'password';
    }
});

signinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorbox = document.getElementById('errorBox').textContent
    // console.log(email,password);

    if (email.trim() === '' || password.trim() === '') {
        alert('Fill in all inputs')
    } else {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = `
        <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        `

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('signed in', user);
                window.location.href = 'dashboard.html'
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.innerHTML = `
                <span>Access Account</span>
                    <i class="fa-solid fa-key"></i>
                `
                if (errorCode === 'auth/invalid-credential') {
                    document.getElementById('errorBox').textContent = '  Invalid Credentials'
                }else{
                    document.getElementById('errorBox').textContent = 'An error occurred. Please try again.';
                }
            });
    }
});

