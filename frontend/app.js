const socket = new WebSocket("wss://mik-messenger-1.onrender.com");
let username = "";
let currentRecipient = "MÎK Global Group";

function joinChat() {
    username = document.getElementById("username").value.trim();
    if (!username) return alert("Enter Name");
    document.getElementById("joinBox").style.display = "none";
    document.getElementById("mainInterface").style.display = "block";
    
    socket.send(JSON.stringify({ type: "join", user: username }));
    loadChatList();
}

function loadChatList() {
    const list = document.getElementById("chatList");
    list.innerHTML = `
        <div class="chat-item" onclick="openChat('MÎK Global Group')">
            <img src="https://i.imgur.com/1X6R9xF.png">
            <div><strong>MÎK Global Group</strong><br><small>Welcome to MÎK!</small></div>
        </div>
    `;
}

function openChat(name) {
    currentRecipient = name;
    document.getElementById("mainInterface").style.display = "none";
    document.getElementById("conversationScreen").style.display = "block";
    document.getElementById("chatWith").innerText = name;
}

function backToMain() {
    document.getElementById("conversationScreen").style.display = "none";
    document.getElementById("mainInterface").style.display = "block";
}

document.getElementById("joinBtn").onclick = joinChat;

document.getElementById("sendBtn").onclick = () => {
    const text = document.getElementById("msgInput").value;
    if (!text) return;
    
    socket.send(JSON.stringify({
        type: "private_msg",
        to: currentRecipient,
        text: text
    }));
    document.getElementById("msgInput").value = "";
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "msg") {
        const div = document.createElement("div");
        div.classList.add("msg", data.from === username ? "you" : "other");
        div.innerHTML = `<div>${data.text}</div><small style="font-size:10px; opacity:0.6">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>`;
        document.getElementById("messages").appendChild(div);
        document.getElementById("messages").scrollTop = 100000;
    }
};
