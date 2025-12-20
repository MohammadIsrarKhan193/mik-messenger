// server/src/index.js
require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const { setupWSServer } = require("./wsserver");

const PORT = process.env.PORT || 10000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

const server = http.createServer();

setupWSServer(server);

server.listen(PORT, () => {
  console.log(`🚀 MÎK WS Server running on port ${PORT}`);
});
