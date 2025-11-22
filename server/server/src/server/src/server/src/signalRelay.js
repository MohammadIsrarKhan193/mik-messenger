// server/src/signalRelay.js
// Simple in-memory store for Signal-style key bundles (dev POC).
// For production use a DB and authentication.

const bundles = new Map(); // userId -> bundle JSON

function saveBundle(userId, bundle) {
  bundles.set(userId, bundle);
}

function getBundle(userId) {
  return bundles.get(userId) || null;
}

module.exports = { saveBundle, getBundle };
