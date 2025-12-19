// server/src/index.js

require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 10000;
const server = http.createServer();

const wss = new WebSocket.Server({ server });

// username => ws
const users = new Map();

wss.on('connection', (ws) => {
  let currentUser = null;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      // USER JOIN
      if (msg.type === 'join') {
        currentUser = msg.username;
        users.set(currentUser, ws);

        console.log(`${currentUser} connected`);
        return;
      }

      // PRIVATE MESSAGE
      if (msg.type === 'dm') {
        const targetSocket = users.get(msg.to);

        if (targetSocket) {
          targetSocket.send(JSON.stringify({
            type: 'dm',
            from: currentUser,
            text: msg.text
          }));
        }
      }

    } catch (err) {
      console.error('Invalid message', err);
    }
  });

  ws.on('close', () => {
    if (currentUser) {
      users.delete(currentUser);
      console.log(`${currentUser} disconnected`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ MÎK WS server running on port ${PORT}`);
});
