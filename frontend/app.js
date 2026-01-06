const socket = new WebSocket("wss://mik-messenger-1.onrender.com");
let myData = { name: "", phone: "", dp: "" };
let activeChat = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'flex';
}

// SIMULATED OTP LOGIC
function sendOTP() {
  const phone = document.getElementById('phoneNumber').value;
  if(!phone) return alert("Enter Phone");
  myData.phone = phone;
  alert("Simulated OTP: 1234"); // You will replace this with real API call
  showScreen('otpScreen');
}

function verifyOTP() {
  // Simple check for POC
  showScreen('profileScreen');
}

// DP PREVIEW
document.getElementById('dpInput').onchange = (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    myData.dp = reader.result;
    document.getElementById('dpPreview').innerHTML = `<img src="${reader.result}">`;
  };
  reader.readAsDataURL(e.target.files[0]);
};

function finishSetup() {
  myData.name = document.getElementById('fullName').value;
  socket.send(JSON.stringify({ type: 'join', user: myData.name, dp: myData.dp }));
  showScreen('mainInterface');
  renderChatList();
}

function renderChatList() {
  const list = document.getElementById('chatList');
  // Example Global Group + empty state for 1-on-1
  list.innerHTML = `
    <div class="chat-item" onclick="openPrivateChat('MÎK Global','https://i.imgur.com/1X6R9xF.png')">
      <img src="https://i.imgur.com/1X6R9xF.png">
      <div class="chat-details"><strong>MÎK Global Group</strong><p>Tap to chat</p></div>
    </div>
  `;
}

function openPrivateChat(name, avatar) {
  activeChat = name;
  document.getElementById('chatTitle').innerText = name;
  document.getElementById('chatAvatar').src = avatar;
  showScreen('conversationScreen');
}

function toggleDrawer() {
  const d = document.getElementById('attachDrawer');
  d.style.display = d.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('sendBtn').onclick = () => {
  const txt = document.getElementById('msgInput').value;
  if(!txt) return;
  socket.send(JSON.stringify({
    type: "msg",
    to: activeChat,
    message: txt,
    from: myData.name
  }));
  document.getElementById('msgInput').value = "";
};

socket.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if(data.type === "msg") {
    const div = document.createElement('div');
    div.className = `msg ${data.from === myData.name ? 'you' : 'other'}`;
    div.innerHTML = `<div>${data.message}</div>`;
    document.getElementById('messages').appendChild(div);
  }
};
