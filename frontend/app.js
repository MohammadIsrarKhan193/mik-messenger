import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue, push } from "firebase/database";

// PASTE YOUR DATA HERE (Already customized for MÎK Messenger App)
const firebaseConfig = {
  apiKey: "AIzaSyAP4ksDAnqqxKBkHpWpqnUxQ1Ge3gNdHo4",
  authDomain: "mik-messenger-app.firebaseapp.com",
  projectId: "mik-messenger-app",
  storageBucket: "mik-messenger-app.firebasestorage.app",
  messagingSenderId: "331128310376",
  appId: "1:331128310376:web:9cdbee2bf21bf84d8149dd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 1. SPLASH SCREEN FLOW
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        checkLoginState();
    }, 2500);
});

function checkLoginState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('mainApp').style.display = 'block';
            loadUserDashboard(user);
        } else {
            document.getElementById('authScreen').style.display = 'flex';
        }
    });
}

// 2. PHONE AUTHENTICATION
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });

document.getElementById('sendOtpBtn').onclick = () => {
    const phoneNumber = document.getElementById('phoneNumber').value;
    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            document.getElementById('otpInputArea').style.display = 'block';
            alert("OTP Sent, Jani! Check your SMS.");
        }).catch((error) => alert("Error: " + error.message));
};

document.getElementById('verifyOtpBtn').onclick = () => {
    const code = document.getElementById('otpCode').value;
    window.confirmationResult.confirm(code).then((result) => {
        const user = result.user;
        // Save user to Realtime Database
        set(ref(db, 'users/' + user.uid), {
            phone: user.phoneNumber,
            lastSeen: Date.now()
        });
    }).catch((error) => alert("Wrong OTP! Try again."));
};

function loadUserDashboard(user) {
    // We will build the Profile and Chat loading in the next step!
    console.log("Logged in as:", user.phoneNumber);
}
