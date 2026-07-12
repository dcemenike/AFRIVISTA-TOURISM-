import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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
const user = auth.currentUser;

onAuthStateChanged(auth, (user) => {
    if (user) {

        if (user !== null) {
            user.providerData.forEach((profile) => {
                console.log("Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
                const email = user.email
                console.log(user, email);
                document.getElementById('show').innerHTML = `${user.displayName  }`
                
            });
        }

    } else {
        // User is signed out
        // ...
    }
});