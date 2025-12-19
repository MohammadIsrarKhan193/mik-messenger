
let ws;
let user;

function join() {
  user = document.getElementById("username").value;
  if (!user) return alert("Enter username");

  ws = new WebSocket("wss://mik-messenger.onrender.com");

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", user }));
    document.getElementById("chat").style.display = "block";
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    const box = document.getElementById("messages");
    box.innerHTML += `<div><b>${msg.user}:</b> ${msg.text}</div>`;
    box.scrollTop = box.scrollHeight;
  };
}

function send() {
  const input = document.getElementById("msg");
  ws.send(JSON.stringify({ type: "msg", text: input.value }));
  input.value = "";
}
