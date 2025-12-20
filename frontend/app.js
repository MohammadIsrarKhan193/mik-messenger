const joinBtn = document.getElementById("joinBtn");
const usernameInput = document.getElementById("username");

const joinBox = document.getElementById("joinBox");
const chatBox = document.getElementById("chatBox");
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// ✅ CORRECT WebSocket URL (VERY IMPORTANT)
const socket = new WebSocket("wss://mik-messenger-1.onrender.com");

let username = "";

// JOIN
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();

  if (!username) {
    alert("Enter your name");
    return;
  }

  joinBox.style.display = "none";
  chatBox.style.display = "flex";

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "join",
        username: username,
        room: "global"
      })
    );
  };
});

// SEND MESSAGE
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  socket.send(
    JSON.stringify({
      type: "message",
      text: text
    })
  );

  msgInput.value = "";
}

// RECEIVE MESSAGE
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const div = document.createElement("div");
  div.classList.add("msg");

  if (data.user === username) {
    div.classList.add("you");
  } else {
    div.classList.add("other");
  }

  if (data.type === "system") {
    div.innerHTML = `<i>${data.text}</i>`;
  } else {
    div.innerHTML = `<b>${data.user}</b><br>${data.text}`;
  }

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
};
