import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

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

// NAV & LOGIN CHECK
window.addEventListener('load', () => {
    setTimeout(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const snapshot = await get(ref(db, 'users/' + user.uid));
                if (snapshot.exists()) {
                    document.getElementById('myName').innerText = snapshot.val().displayName;
                    document.getElementById('myAvatar').src = snapshot.val().photoURL;
                    showScreen('mainApp');
                } else { showScreen('profileSetupScreen'); }
            } else { showScreen('authScreen'); }
            document.getElementById('splashScreen').style.display = 'none';
        });
    }, 2000);
});

// STEP 3: SEARCH LOGIC
document.getElementById('openSearchBtn').onclick = () => document.getElementById('searchOverlay').style.display = 'flex';
document.getElementById('closeSearch').onclick = () => document.getElementById('searchOverlay').style.display = 'none';

document.getElementById('searchUserBtn').onclick = async () => {
    const phone = document.getElementById('searchPhone').value;
    const usersRef = ref(db, 'users');
    const q = query(usersRef, orderByChild('phone'), equalTo(phone));
    const snapshot = await get(q);

    const resultDiv = document.getElementById('searchResult');
    if (snapshot.exists()) {
        const userData = Object.values(snapshot.val())[0];
        resultDiv.innerHTML = `
            <div class="user-card">
                <img src="${userData.photoURL}" class="avatar-small">
                <span>${userData.displayName}</span>
                <button onclick="alert('Chat starting soon!')">Message</button>
            </div>`;
    } else {
        resultDiv.innerHTML = "<p>User not found on MÎK</p>";
    }
};

// ... (KEEP YOUR PREVIOUS SMS AND PROFILE SAVE FUNCTIONS HERE)
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}
