const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");
const joinBox = document.getElementById("joinBox");
const chatBox = document.getElementById("chatBox");
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");

// Replace this with your actual Render URL
const socket = new WebSocket("wss://mik-messenger-1.onrender.com");

let username = "";

socket.onopen = () => {
    status.innerText = "Online";
    status.style.color = "#00a884";
};

socket.onclose = () => {
    status.innerText = "Offline - Reconnecting...";
    status.style.color = "#ef5350";
};

// JOIN LOGIC
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter a name to join MÎK");
    return;
  }
  joinBox.style.display = "none";
  chatBox.style.display = "flex";

  socket.send(JSON.stringify({
    type: "join",
    user: username,
    room: "global"
  }));
});

// SEND MESSAGE LOGIC
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({
    type: "msg",
    message: text
  }));

  msgInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// RECEIVE MESSAGE LOGIC
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // Handle Chat History from MongoDB
  if (data.type === "history") {
      data.messages.forEach(msg => appendMessage(msg.user, msg.text));
      return;
  }

  // Handle New Messages
  if (data.type === "msg") {
      appendMessage(data.user, data.message);
  }

  // Handle System Messages
  if (data.type === "system") {
      const div = document.createElement("div");
      div.style.textAlign = "center";
      div.style.fontSize = "12px";
      div.style.color = "#8696a0";
      div.style.margin = "10px 0";
      div.innerHTML = `<i>${data.message}</i>`;
      messages.appendChild(div);
  }
};

function appendMessage(user, text) {
  const div = document.createElement("div");
  div.classList.add("msg");
  div.classList.add(user === username ? "you" : "other");
  
  div.innerHTML = `
    <div style="font-size: 11px; font-weight: bold; color: #00a884">${user}</div>
    <div>${text}</div>
    <div style="font-size: 10px; text-align: right; color: #8696a0; margin-top: 4px;">
        ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
