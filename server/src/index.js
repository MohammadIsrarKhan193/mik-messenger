// server/src/index.js

require('dotenv').config();
const http = require('http');
const { setupWSServer } = require('./wsServer');

const PORT = process.env.PORT || 3000;

// simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MÎK Messenger WebSocket Server Running');
});

// WebSocket setup
setupWSServer(server);

// start server
server.listen(PORT, () => {
  console.log(`✅ MÎK WS server listening on port ${PORT}`);
});
