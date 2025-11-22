// client/src/messageHandler.js
// Minimal message persistence using AsyncStorage (dev POC)
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'mik_msgs_';

export async function saveMessage(chatId, msg) {
  const key = PREFIX + chatId;
  const raw = await AsyncStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  arr.push(msg);
  await AsyncStorage.setItem(key, JSON.stringify(arr));
}

export async function loadMessages(chatId) {
  const key = PREFIX + chatId;
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}
