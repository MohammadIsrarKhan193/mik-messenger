const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "YOUR_DATABASE_URL", // Found in Realtime Database tab
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let confirmResult;
let myPhone = "";
let activeChatId = null;

// --- AUTH LOGIC ---
function sendOTP() {
  const phone = document.getElementById('phoneNumber').value;
  const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
  
  auth.signInWithPhoneNumber(phone, verifier).then(result => {
    confirmResult = result;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('otpScreen').style.display = 'block';
  }).catch(err => alert(err.message));
}

function verifyOTP() {
  const code = document.getElementById('otpCode').value;
  confirmResult.confirm(code).then(result => {
    myPhone = result.user.phoneNumber;
    // Save user to DB
    db.ref('users/' + myPhone.replace('+', '')).set({ phone: myPhone, lastSeen: Date.now() });
    startApp();
  }).catch(err => alert("Invalid Code"));
}

// --- CHAT LOGIC ---
function startApp() {
  document.getElementById('authFlow').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  loadMyChats();
}

function showSearchPrompt() {
  const target = prompt("Enter phone number to chat (with +code):");
  if(target) openChat(target);
}

function openChat(targetPhone) {
  activeChatId = [myPhone.replace('+',''), targetPhone.replace('+','')].sort().join("_");
  document.getElementById('listScreen').style.display = 'none';
  document.getElementById('chatScreen').style.display = 'flex';
  document.getElementById('activeChatName').innerText = targetPhone;
  
  // Listen for real-time messages
  db.ref('messages/' + activeChatId).on('value', snapshot => {
    const data = snapshot.val();
    const area = document.getElementById('messageArea');
    area.innerHTML = "";
    if(data) {
      Object.values(data).forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg ${msg.sender === myPhone ? 'you' : 'other'}`;
        div.innerHTML = `<div>${msg.text}</div>`;
        area.appendChild(div);
      });
      area.scrollTop = area.scrollHeight;
    }
  });
}

function sendMessage() {
  const text = document.getElementById('msgInput').value;
  if(!text) return;

  db.ref('messages/' + activeChatId).push({
    sender: myPhone,
    text: text,
    time: Date.now()
  });
  document.getElementById('msgInput').value = "";
}

function backToList() {
  document.getElementById('chatScreen').style.display = 'none';
  document.getElementById('listScreen').style.display = 'block';
}
