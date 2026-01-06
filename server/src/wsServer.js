const WebSocket = require("ws");
const Message = require("./models/Message");

// Track connected users: { "username": ws_socket }
const connectedUsers = {};

function setupWSServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    let currentUser = "";

    ws.on("message", async (data) => {
      let msg;
      try { msg = JSON.parse(data.toString()); } catch { return; }

      if (msg.type === "join") {
        currentUser = msg.user;
        connectedUsers[currentUser] = ws; // Map username to socket
        console.log(`${currentUser} is online`);
        
        // Broadcast that user is online
        broadcast({ type: "system", message: `${currentUser} joined MÎK` });
      }

      if (msg.type === "private_msg") {
        const messageData = {
          from: currentUser,
          to: msg.to,
          text: msg.text,
          timestamp: Date.now()
        };

        // Save to MongoDB
        await Message.create({
          room: [currentUser, msg.to].sort().join("-"), // Unique room for 2 people
          user: currentUser,
          text: msg.text
        });

        // Send to recipient if online
        if (connectedUsers[msg.to]) {
          connectedUsers[msg.to].send(JSON.stringify({
            type: "msg",
            ...messageData
          }));
        }
        
        // Send back to sender for confirmation
        ws.send(JSON.stringify({ type: "msg", ...messageData }));
      }
    });

    ws.on("close", () => {
      if (currentUser) delete connectedUsers[currentUser];
      broadcast({ type: "system", message: `${currentUser} went offline` });
    });
  });
}

function broadcast(message) {
  const data = JSON.stringify(message);
  Object.values(connectedUsers).forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
}

module.exports = { setupWSServer };
