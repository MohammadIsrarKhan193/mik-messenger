// MODULE 1: IDENTITY & AUTHENTICATION
const firebaseConfig = {
  // PASTE YOUR REAL CONFIG FROM THE STEP ABOVE HERE!
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// 1. SPLASH SCREEN LOGIC
window.onload = () => {
    setTimeout(() => {
        const splash = document.getElementById('welcomeScreen');
        if (auth.currentUser) {
            startApp(); // Skip login if already logged in
        } else {
            // Show welcome screen
        }
    }, 2500); // MÎK logo stays for 2.5 seconds
};

// 2. REAL PHONE AUTH
function sendOTP() {
    const phone = document.getElementById('phoneNumber').value;
    // Invisible Recaptcha: WhatsApp doesn't show "I'm not a robot" boxes, neither do we!
    const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
    
    auth.signInWithPhoneNumber(phone, verifier).then(result => {
        window.confirmationResult = result;
        showScreen('otpScreen');
    }).catch(err => {
        console.error("SMS Error:", err.message);
        alert("Make sure you entered the number correctly with +code (e.g. +92300...)");
    });
}

function verifyOTP() {
    const code = document.getElementById('otpCode').value;
    window.confirmationResult.confirm(code).then(result => {
        startApp();
    }).catch(err => alert("Wrong OTP! Check again Jani."));
}

function startApp() {
    showScreen('mainApp');
    // We will build the Profile Engine in Module 2!
}
