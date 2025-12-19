// server/src/index.js

require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 10000;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// username => ws
const users = new Map();

function broadcastUsers() {
  const userList = Array.from(users.keys());

  const message = JSON.stringify({
    type: 'users',
    users: userList
  });

  users.forEach(ws => ws.send(message));
}

wss.on('connection', (ws) => {
  let currentUser = null;

  ws.on('message', (data) => {
    const msg = JSON.parse(data);

    // JOIN
    if (msg.type === 'join') {
      currentUser = msg.username;
      users.set(currentUser, ws);
      broadcastUsers();
      return;
    }

    // PRIVATE MESSAGE
    if (msg.type === 'dm') {
      const target = users.get(msg.to);
      if (target) {
        target.send(JSON.stringify({
          type: 'dm',
          from: currentUser,
          text: msg.text
        }));
      }
    }
  });

  ws.on('close', () => {
    if (currentUser) {
      users.delete(currentUser);
      broadcastUsers();
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ MÎK WS server running on port ${PORT}`);
});
