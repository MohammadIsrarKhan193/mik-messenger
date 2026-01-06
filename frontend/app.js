// PASTE YOUR REAL CONFIG HERE FROM FIREBASE SETTINGS
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcde"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let myPhone = "";
let activeChatId = null;

// TYPING INDICATOR LOGIC
function setTyping(isTyping) {
    if (!activeChatId) return;
    db.ref(`typing/${activeChatId}/${myPhone.replace('+','')}`).set(isTyping);
}

// Listen for typing
function listenForTyping(chatId) {
    db.ref(`typing/${chatId}`).on('value', snapshot => {
        const data = snapshot.val();
        let someoneTyping = false;
        if (data) {
            Object.keys(data).forEach(user => {
                if (user !== myPhone.replace('+','') && data[user] === true) {
                    someoneTyping = true;
                }
            });
        }
        document.getElementById('chatStatus').innerText = someoneTyping ? "typing..." : "online";
    });
}

// Update the message input to trigger typing
document.getElementById('msgInput').addEventListener('input', () => {
    setTyping(true);
    // Stop typing after 2 seconds of no input
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => setTyping(false), 2000);
});

// Update openChat to include the listener
function openChat(targetPhone) {
    activeChatId = [myPhone.replace('+',''), targetPhone.replace('+','')].sort().join("_");
    showScreen('chatScreen');
    document.getElementById('activeChatName').innerText = targetPhone;
    listenForTyping(activeChatId);
    // ... (rest of your existing openChat message loading logic)
}
