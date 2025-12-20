let ws;
let username;
let room = "global";

function join() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter username");

  ws = new WebSocket("wss://mik-messenger.onrender.com");

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "join",
        username,
        room,
      })
    );

    document.getElementById("joinBox").style.display = "none";
    document.getElementById("chat").style.display = "block";
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    const box = document.getElementById("messages");

    if (msg.type === "message") {
      box.innerHTML += `<div><b>${msg.user}:</b> ${msg.text}</div>`;
    }

    if (msg.type === "system") {
      box.innerHTML += `<div style="color:gray"><i>${msg.text}</i></div>`;
    }

    box.scrollTop = box.scrollHeight;
  };
}

function sendMsg() {
  const input = document.getElementById("msg");
  if (!input.value) return;

  ws.send(
    JSON.stringify({
      type: "message",
      text: input.value,
    })
  );

  input.value = "";
}
