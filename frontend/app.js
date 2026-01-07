import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

// YOUR FIREBASE CONFIG
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
const storage = getStorage(app);

// 1. GLOBAL NAVIGATION
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

// 2. SPLASH & LOGIN CHECK
window.addEventListener('load', () => {
    setTimeout(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const snapshot = await get(ref(db, 'users/' + user.uid));
                if (snapshot.exists()) {
                    document.getElementById('myName').innerText = snapshot.val().displayName;
                    document.getElementById('myAvatar').src = snapshot.val().photoURL || 'https://via.placeholder.com/40';
                    showScreen('mainApp');
                } else {
                    showScreen('profileSetupScreen');
                }
            } else {
                showScreen('authScreen');
            }
            document.getElementById('splashScreen').style.display = 'none';
        });
    }, 2500);
});

// 3. SMS OTP LOGIC
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });

document.getElementById('sendOtpBtn').onclick = () => {
    const phone = document.getElementById('phoneNumber').value;
    if(!phone.startsWith('+')) return alert("Enter number with +code (e.g. +92)");

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
        .then((result) => {
            window.confirmationResult = result;
            document.getElementById('otpInputArea').style.display = 'block';
            alert("OTP Sent, Jani! Check your phone.");
        }).catch((err) => alert("Error: " + err.message));
};

document.getElementById('verifyOtpBtn').onclick = () => {
    const code = document.getElementById('otpCode').value;
    window.confirmationResult.confirm(code).catch((err) => alert("Wrong OTP!"));
};

// 4. PROFILE SAVING LOGIC
document.getElementById('profilePicInput').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => document.getElementById('setupPreview').src = reader.result;
    reader.readAsDataURL(e.target.files[0]);
};

document.getElementById('saveProfileBtn').onclick = async () => {
    const name = document.getElementById('userNameInput').value;
    const file = document.getElementById('profilePicInput').files[0];
    const user = auth.currentUser;

    if(!name) return alert("Please enter your name!");

    let photoURL = "https://via.placeholder.com/120";
    if(file) {
        const storageRef = sRef(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
    }

    await set(ref(db, 'users/' + user.uid), {
        displayName: name,
        photoURL: photoURL,
        phone: user.phoneNumber,
        status: "I am using MÎK Messenger",
        lastSeen: Date.now()
    });
    
    location.reload(); 
};
