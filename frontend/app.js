import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

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

// AUTH & NAVIGATION
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        onAuthStateChanged(auth, (user) => {
            if (user) {
                get(ref(db, 'users/' + user.uid)).then((snapshot) => {
                    if (snapshot.exists()) {
                        showScreen('mainApp');
                        document.getElementById('myName').innerText = snapshot.val().displayName;
                    } else { showScreen('profileSetupScreen'); }
                });
            } else { showScreen('authScreen'); }
        });
    }, 2500);
});

// SMS OTP LOGIC
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
document.getElementById('sendOtpBtn').onclick = () => {
    const phone = document.getElementById('phoneNumber').value;
    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
        .then((result) => { window.confirmationResult = result; document.getElementById('otpInputArea').style.display = 'block'; })
        .catch((err) => alert(err.message));
};

document.getElementById('verifyOtpBtn').onclick = () => {
    const code = document.getElementById('otpCode').value;
    window.confirmationResult.confirm(code).catch((err) => alert("Wrong OTP!"));
};

// PROFILE SAVING
document.getElementById('saveProfileBtn').onclick = () => {
    const name = document.getElementById('userNameInput').value;
    if(!name) return alert("Enter name!");
    set(ref(db, 'users/' + auth.currentUser.uid), {
        displayName: name,
        phone: auth.currentUser.phoneNumber,
        lastSeen: Date.now()
    }).then(() => showScreen('mainApp'));
};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}
