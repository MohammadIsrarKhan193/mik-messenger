const WebSocket = require("ws");
const Message = require("./models/Message");

const rooms = {};
const users = new Map();

function setupWSServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("🔌 Client connected");

    ws.on("message", async (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }

      // JOIN ROOM
      if (msg.type === "join") {
        ws.room = msg.room || "global";
        users.set(ws, msg.user);

        if (!rooms[ws.room]) rooms[ws.room] = new Set();
        rooms[ws.room].add(ws);

        // Send chat history
        const history = await Message.find({ room: ws.room })
          .sort({ createdAt: 1 })
          .limit(50);

        ws.send(
          JSON.stringify({
            type: "history",
            messages: history.map((m) => ({
              user: m.user,
              text: m.text,
            })),
          })
        );

        broadcast(ws.room, {
          type: "system",
          message: `${msg.user} joined ${ws.room}`,
        });
      }

      // NEW MESSAGE
      if (msg.type === "msg") {
        const saved = await Message.create({
          room: ws.room,
          user: users.get(ws),
          text: msg.message,
        });

        broadcast(ws.room, {
          type: "msg",
          user: saved.user,
          message: saved.text,
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
          message: `${user} left the chat`,
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
