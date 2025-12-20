const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");

const joinBox = document.getElementById("joinBox");
const chatBox = document.getElementById("chatBox");
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// CHANGE THIS TO YOUR BACKEND URL
const socket = new WebSocket("https://mik-messenger-1.onrender.com");

let username = "";

joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();

  if (!username) {
    alert("Enter your name");
    return;
  }

  joinBox.style.display = "none";
  chatBox.style.display = "flex";

  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: "join",
      username
    }));
  };
});

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  socket.send(JSON.stringify({
    type: "message",
    username,
    text
  }));

  msgInput.value = "";
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const div = document.createElement("div");
  div.textContent = `${data.username}: ${data.text}`;
  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;
};
