import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, validatePassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2yk67GsHakRcoPY9JWI6XlgFntCsQomQ",
    authDomain: "afrivista-tourism.firebaseapp.com",
    projectId: "afrivista-tourism",
    storageBucket: "afrivista-tourism.firebasestorage.app",
    messagingSenderId: "1042806811109",
    appId: "1:1042806811109:web:4e5ad306fb3dc429c3270c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const btn = document.getElementById('submit-btn');


function toastify() {
    Toastify({

        text: "Account created successfully!",
        duration: 3000,
        position: "center",
        style: {
            background: "linear-gradient(to right, #042c09, #203005)",
        },
    }).showToast();
}

document.getElementById('toggleIcon').addEventListener('click', () => {
    const icon = document.getElementById('toggleIcon');
    const userPassword = document.getElementById('pass');

    if (userPassword.type === 'password') {
        icon.className = 'fa-solid fa-eye-slash';
        userPassword.type = 'text';
    } else {
        if (userPassword.type === 'text') {
            icon.className = 'fa-solid fa-eye';
            userPassword.type = 'password';
        }
    }
})


document.getElementById('submit-btn').addEventListener('click', async () => {
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const email = document.getElementById('mail').value;
    const password = document.getElementById('pass').value;
    // console.log(firstName, lastName, mail, password);
    try {
        const status = await validatePassword(auth, password);

        if (!status.isValid) {
            const passwordError = [];
            const errMsg = document.getElementById('error-box');
            const needsLowerCase = status.containsLowercaseLetter !== true;
            const needsMinPassword = status.meetsMinPasswordLength !== true;
            const needsUpperCase = status.containsUppercaseLetter !== true;
            const needsNumericCharacter = status.containsNumericCharacter !== true;
            const needsSpecialCharacter = status.containsNonAlphanumericCharacter !== true;
            console.log(status);

            if (needsLowerCase) {
                passwordError.push('Password must contain a lowercase letter')
                errMsg.textContent = passwordError;
            }
            if (needsUpperCase) {
                passwordError.push('Password must contain an uppercase letter')
                errMsg.textContent = passwordError;
            }
            if (needsMinPassword) {
                passwordError.push('Password must contain at least 8 characters')
                errMsg.textContent = passwordError;
            }
            if (needsNumericCharacter) {
                passwordError.push('Password must contain a numeric character')
                errMsg.textContent = passwordError;
            }
            if (needsSpecialCharacter) {
                passwordError.push('Password must contain a special character (!,@, #, $...)')
                errMsg.textContent = passwordError;
            }


        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            btn.disabled = true;
            btn.style.opacity = "0.7";
            btn.innerHTML = `
                <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>
                            `
            await updateProfile(auth.currentUser, {
                displayName: `${firstName}`
            })
            console.log('signed in successfully!', user);
            toastify()
            document.getElementById('firstname').value = '';
            document.getElementById('lastname').value = '';
            document.getElementById('mail').value = '';
            document.getElementById('pass').value = '';
            window.location.href = 'signin.html'
        }

    }
    catch (error) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerHTML = `
                <span>Initialize Profile</span>
                    <i class="fa-solid fa-arrow-right-long"></i>
                `
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    };

})

//SIGN UP WITH GOOGLE

document.getElementById('continueWithGoogle').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode);
            console.log(errorMessage);
            console.log(email);

        });


})