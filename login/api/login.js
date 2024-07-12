// Firebase Authentication setup
const auth = firebase.auth();
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFktKLtxFR85ZZLSL5QAWfZ4zvyCywdd4",
    authDomain: "fitnow-43200.firebaseapp.com",
    projectId: "fitnow-43200",
    storageBucket: "fitnow-43200.appspot.com",
    messagingSenderId: "473748995732",
    appId: "1:473748995732:web:687f0e5aebeac2a6b1be81"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Sign Up
const signUpButton = document.getElementById('signUpButton');
signUpButton.addEventListener('click', e => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Signed up successfully
            const user = userCredential.user;
            console.log(user);
        })
        .catch(error => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
});

// Sign In
const signInButton = document.getElementById('signInButton');
signInButton.addEventListener('click', e => {
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Signed in successfully
            const user = userCredential.user;
            console.log(user);
        })
        .catch(error => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
});

// Google Sign-In
const googleSignIn = document.getElementById('googleSignIn');
googleSignIn.addEventListener('click', e => {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
        .then(result => {
            // Google sign-in successful
            const user = result.user;
            console.log(user);
        })
        .catch(error => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
        });
});

// UI Switching between Sign Up and Sign In
const signIn = document.getElementById('signIn');
const signUp = document.getElementById('signUp');
const container = document.getElementById('container');

signIn.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

signUp.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Function to send ID token to server for verification
function sendTokenToServer(idToken) {
    fetch('http://localhost:3000/verifyToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// Example: Sign in with Google
function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            var user = result.user;
            return user.getIdToken().then((idToken) => {
                sendTokenToServer(idToken); // Send ID token to server for verification
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
}