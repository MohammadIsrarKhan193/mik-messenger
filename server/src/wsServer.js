const WebSocket = require("ws");

const rooms = {};
const users = new Map();

function setupWSServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }

      // JOIN
      if (msg.type === "join") {
        ws.room = msg.room || "global";
        users.set(ws, msg.username);

        if (!rooms[ws.room]) rooms[ws.room] = new Set();
        rooms[ws.room].add(ws);

        broadcast(ws.room, {
          type: "system",
          text: `${msg.username} joined ${ws.room}`,
        });
      }

      // MESSAGE
      if (msg.type === "message") {
        broadcast(ws.room, {
          type: "message",
          user: users.get(ws),
          text: msg.text,
        });
      }
    });

    ws.on("close", () => {
      const username = users.get(ws);
      const room = ws.room;

      if (room && rooms[room]) rooms[room].delete(ws);
      users.delete(ws);

      if (username) {
        broadcast(room, {
          type: "system",
          text: `${username} left the chat`,
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
