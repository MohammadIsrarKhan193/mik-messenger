let ws;
let user;
let room = "global";

function join() {
  user = document.getElementById("username").value.trim();
  if (!user) return alert("Enter username");

  ws = new WebSocket("wss://mik-messenger.onrender.com");

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: "join",
        user: user,
        room: room,
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
      box.innerHTML += `<div style="color:gray"><i>${msg.message}</i></div>`;
    }

    box.scrollTop = box.scrollHeight;
  };
}

function sendMsg() {
  const input = document.getElementById("msg");
  if (!input.value) return;

  ws.send(
    JSON.stringify({
      type: "msg",
      message: input.value,
    })
  );

  input.value = "";
}
