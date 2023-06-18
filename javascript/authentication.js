import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
     apiKey: "AIzaSyAubbk47k7Zd9KDMJWCxe3X8MaNfblrS4o",
     authDomain: "fetin-teste.firebaseapp.com",
     databaseURL: "https://fetin-teste-default-rtdb.firebaseio.com",
     projectId: "fetin-teste",
     storageBucket: "fetin-teste.appspot.com",
     messagingSenderId: "88230584865",
     appId: "1:88230584865:web:46ee3be503d24f603bb960"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");

// Get references to the error message elements
const loginError = document.querySelector("#loginError");
const signupError = document.querySelector("#signupError");

// Get references to the login/logout buttons
const googleLoginButton = document.querySelector("#googleLogin");
const logoutButton = document.querySelector("#logoutButton");

// Get references to the switch buttons
const switchToSignupButton = document.querySelector("#switchToSignup");
const switchToLoginButton = document.querySelector("#switchToLogin");

switchToLoginButton.addEventListener("click", () => {
  signupContainer.style.display = "none";
  loginContainer.style.display = "block";
});

switchToSignupButton.addEventListener("click", () => {
  loginContainer.style.display = "none";
  signupContainer.style.display = "block";
});

// Add login event listener
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Clear form fields
      loginForm.reset();
      // Hide login error message
      loginError.textContent = "";
      window.location.href = "../html/index.html";
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

// Add signup event listener
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.signupEmail.value;
  const password = signupForm.signupPassword.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Clear form fields
      signupForm.reset();
      // Hide signup error message
      signupError.textContent = "";
    })
    .catch((error) => {
      signupError.textContent = error.message;
    });
});

// Add Google login event listener
googleLoginButton.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Clear form fields
      loginForm.reset();
      // Hide login error message
      loginError.textContent = "";
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

// Add logout event listener
logoutButton.addEventListener("click", () => {
  signOut(auth);
});

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    logoutButton.style.display = "block";
    loginForm.style.display = "none";
    signupForm.style.display = "none";
  } else {
    // User is signed out
    logoutButton.style.display = "none";
    loginForm.style.display = "block";
    signupForm.style.display = "block";
  }
});