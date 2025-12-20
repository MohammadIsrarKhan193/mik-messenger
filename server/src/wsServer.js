const WebSocket = require("ws");

const rooms = {};              // room -> Set(ws)
const users = new Map();       // ws -> username
const history = {};            // room -> [{ user, text }]

function setupWSServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🔌 Client connected");

    ws.on("message", (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }

      // 🔑 JOIN
      if (msg.type === "join") {
        ws.room = msg.room || "global";
        users.set(ws, msg.user);

        if (!rooms[ws.room]) rooms[ws.room] = new Set();
        if (!history[ws.room]) history[ws.room] = [];

        rooms[ws.room].add(ws);

        // 📜 Send old messages
        ws.send(
          JSON.stringify({
            type: "history",
            messages: history[ws.room],
          })
        );

        broadcast(ws.room, {
          type: "system",
          text: `${msg.user} joined ${ws.room}`,
        });
      }

      // 💬 MESSAGE
      if (msg.type === "msg") {
        const message = {
          user: users.get(ws),
          text: msg.message,
        };

        history[ws.room].push(message);

        broadcast(ws.room, {
          type: "msg",
          user: message.user,
          message: message.text,
        });
      }
    });

    ws.on("close", () => {
      const user = users.get(ws);
      const room = ws.room;

      if (room && rooms[room]) rooms[room].delete(ws);
      users.delete(ws);

      if (user) {
        broadcast(room, {
          type: "system",
          text: `${user} left the chat`,
        });
      }
    });
  });
}

function broadcast(room, message) {
  if (!rooms[room]) return;

  const data = JSON.stringify(message);
  rooms[room].forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

module.exports = { setupWSServer };
