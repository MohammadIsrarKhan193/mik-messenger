
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
  console.log("RAW FROM SERVER:", e.data);
  const msg = JSON.parse(e.data);
  console.log("PARSED:", msg);
    const box = document.getElementById("messages");
    box.innerHTML += `<div><b>${msg.user}:</b> ${msg.message}</div>`;
    box.scrollTop = box.scrollHeight;
  };
}

function send() {
  const input = document.getElementById("msg");
  ws.send(JSON.stringify({ type: "msg", message: input.value }));
  input.value = "";
}
