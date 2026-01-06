// REPLACE THIS WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const socket = new WebSocket("wss://mik-messenger-1.onrender.com");

let confirmationResult;
let currentUser = null;
let activeRecipient = null;

// 1. PHONE AUTH LOGIC
window.onSignInSubmit = function() {
  const number = document.getElementById('phoneNumber').value;
  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  
  auth.signInWithPhoneNumber(number, recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('otpScreen').style.display = 'block';
    }).catch(err => alert(err.message));
}

window.verifyCode = function() {
  const code = document.getElementById('verificationCode').value;
  confirmationResult.confirm(code).then((result) => {
    currentUser = result.user;
    startApp();
  }).catch(err => alert("Wrong Code!"));
}

// 2. CHAT LOGIC
function startApp() {
  document.getElementById('authContainer').style.display = 'none';
  document.getElementById('appInterface').style.display = 'block';
  
  socket.send(JSON.stringify({
    type: "join",
    userId: currentUser.phoneNumber
  }));
}

function openChat(targetPhone) {
  activeRecipient = targetPhone;
  document.getElementById('chatListScreen').style.display = 'none';
  document.getElementById('chatScreen').style.display = 'flex';
  document.getElementById('activeName').innerText = targetPhone;
}

function sendPrivateMsg() {
  const text = document.getElementById('msgInput').value;
  if(!text) return;

  socket.send(JSON.stringify({
    type: "private_msg",
    to: activeRecipient,
    from: currentUser.phoneNumber,
    message: text
  }));
  
  appendMessage(text, "you");
  document.getElementById('msgInput').value = "";
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if(data.type === "private_msg" && data.from === activeRecipient) {
    appendMessage(data.message, "other");
  }
};

function appendMessage(text, side) {
  const div = document.createElement('div');
  div.className = `msg ${side}`;
  div.innerHTML = `<div>${text}</div>`;
  document.getElementById('messageArea').appendChild(div);
}
