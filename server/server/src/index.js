// server/src/index.js
require('dotenv').config();
const http = require('http');
const { setupWSServer } = require('./wsServer');

const PORT = process.env.PORT || 8080;
const server = http.createServer();

setupWSServer(server);

server.listen(PORT, () => {
  console.log(`MÎK WS server listening on :${PORT}`);
});
