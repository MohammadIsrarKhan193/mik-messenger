// server/src/index.js
require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const { setupWSServer } = require("./wsserver");

const PORT = process.env.PORT || 10000;

// ─── Express App ───
const app = express();

// Serve frontend files
app.use(express.static(path.join(__dirname, "../../frontend")));

// All routes → index.html (for single page app)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

// ─── HTTP Server (Express + WebSocket together) ───
const server = http.createServer(app);

// ─── MongoDB ───
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ─── WebSocket Server ───
setupWSServer(server);

server.listen(PORT, () => {
  console.log(`🚀 MÎK Server running on port ${PORT}`);
});
