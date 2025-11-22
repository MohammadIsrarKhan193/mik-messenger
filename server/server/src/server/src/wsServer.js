// server/src/wsServer.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const clients = new Map(); // userId -> ws

function safeParse(msg) {
  try {
    return JSON.parse(msg.toString());
  } catch (e) {
    return null;
  }
}

function setupWSServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', (ws, req) => {
    // Accept userId from query string for simple auth (dev only)
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const userId = url.searchParams.get('userId') || `guest-${uuidv4()}`;
      ws._userId = userId;
      clients.set(userId, ws);
      console.log('connected', userId);

      ws.send(JSON.stringify({ type: 'system', msg: `welcome ${userId}` }));

      ws.on('message', (raw) => {
        const data = safeParse(raw);
        if (!data) return;

        // Relay encrypted message
        if (data.type === 'message') {
          const target = clients.get(data.to);
          if (target && target.readyState === WebSocket.OPEN) {
            target.send(JSON.stringify({
              type: 'message',
              from: ws._userId,
              body: data.body,
              ts: data.ts || Date.now()
            }));
          }
        }

        // WebRTC signaling relay
        if (data.type === 'signal') {
          const target = clients.get(data.to);
          if (target && target.readyState === WebSocket.OPEN) {
            target.send(JSON.stringify({
              type: 'signal',
              from: ws._userId,
              payload: data.payload
            }));
          }
        }

        // simple ping/pong
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
        }
      });

      ws.on('close', () => {
        clients.delete(ws._userId);
        console.log('closed', ws._userId);
      });
    } catch (err) {
      console.error('ws connection error', err);
      ws.close();
    }
  });
}

module.exports = { setupWSServer };
