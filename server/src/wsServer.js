// server/src/wsServer.js

const WebSocket = require('ws');

function setupWSServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('✅ Client connected');

    ws.on('message', (message) => {
      console.log('📩 Received:', message.toString());

      // broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on('close', () => {
      console.log('❌ Client disconnected');
    });
  });
}

module.exports = { setupWSServer };
