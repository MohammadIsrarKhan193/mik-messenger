/* ═══════════════════════════════════════
   MÎK MESSENGER v2 — app.js
   Real WebSocket Chat + Full Features
═══════════════════════════════════════ */

// ─── CONFIG ───
// Your Render WebSocket server URL
const WS_URL = 'wss://mik-messenger-ws.onrender.com';

// ─── STATE ───
let myUsername = '';
let currentChat = '';
let ws = null;
let chats = {};       // { username: { messages:[], unread:0, online:false } }
let reconnectTimer = null;

// ─── COUNTRIES ───
const COUNTRIES = [
  {name:"Afghanistan",flag:"🇦🇫",code:"+93"},
  {name:"Albania",flag:"🇦🇱",code:"+355"},
  {name:"Algeria",flag:"🇩🇿",code:"+213"},
  {name:"Argentina",flag:"🇦🇷",code:"+54"},
  {name:"Australia",flag:"🇦🇺",code:"+61"},
  {name:"Austria",flag:"🇦🇹",code:"+43"},
  {name:"Azerbaijan",flag:"🇦🇿",code:"+994"},
  {name:"Bahrain",flag:"🇧🇭",code:"+973"},
  {name:"Bangladesh",flag:"🇧🇩",code:"+880"},
  {name:"Belgium",flag:"🇧🇪",code:"+32"},
  {name:"Brazil",flag:"🇧🇷",code:"+55"},
  {name:"Canada",flag:"🇨🇦",code:"+1"},
  {name:"China",flag:"🇨🇳",code:"+86"},
  {name:"Egypt",flag:"🇪🇬",code:"+20"},
  {name:"Ethiopia",flag:"🇪🇹",code:"+251"},
  {name:"France",flag:"🇫🇷",code:"+33"},
  {name:"Germany",flag:"🇩🇪",code:"+49"},
  {name:"Ghana",flag:"🇬🇭",code:"+233"},
  {name:"India",flag:"🇮🇳",code:"+91"},
  {name:"Indonesia",flag:"🇮🇩",code:"+62"},
  {name:"Iran",flag:"🇮🇷",code:"+98"},
  {name:"Iraq",flag:"🇮🇶",code:"+964"},
  {name:"Ireland",flag:"🇮🇪",code:"+353"},
  {name:"Italy",flag:"🇮🇹",code:"+39"},
  {name:"Japan",flag:"🇯🇵",code:"+81"},
  {name:"Jordan",flag:"🇯🇴",code:"+962"},
  {name:"Kazakhstan",flag:"🇰🇿",code:"+7"},
  {name:"Kenya",flag:"🇰🇪",code:"+254"},
  {name:"Kuwait",flag:"🇰🇼",code:"+965"},
  {name:"Lebanon",flag:"🇱🇧",code:"+961"},
  {name:"Malaysia",flag:"🇲🇾",code:"+60"},
  {name:"Mexico",flag:"🇲🇽",code:"+52"},
  {name:"Morocco",flag:"🇲🇦",code:"+212"},
  {name:"Nepal",flag:"🇳🇵",code:"+977"},
  {name:"Netherlands",flag:"🇳🇱",code:"+31"},
  {name:"Nigeria",flag:"🇳🇬",code:"+234"},
  {name:"Norway",flag:"🇳🇴",code:"+47"},
  {name:"Oman",flag:"🇴🇲",code:"+968"},
  {name:"Pakistan",flag:"🇵🇰",code:"+92"},
  {name:"Palestine",flag:"🇵🇸",code:"+970"},
  {name:"Philippines",flag:"🇵🇭",code:"+63"},
  {name:"Poland",flag:"🇵🇱",code:"+48"},
  {name:"Portugal",flag:"🇵🇹",code:"+351"},
  {name:"Qatar",flag:"🇶🇦",code:"+974"},
  {name:"Russia",flag:"🇷🇺",code:"+7"},
  {name:"Saudi Arabia",flag:"🇸🇦",code:"+966"},
  {name:"Singapore",flag:"🇸🇬",code:"+65"},
  {name:"Somalia",flag:"🇸🇴",code:"+252"},
  {name:"South Africa",flag:"🇿🇦",code:"+27"},
  {name:"South Korea",flag:"🇰🇷",code:"+82"},
  {name:"Spain",flag:"🇪🇸",code:"+34"},
  {name:"Sri Lanka",flag:"🇱🇰",code:"+94"},
  {name:"Sudan",flag:"🇸🇩",code:"+249"},
  {name:"Sweden",flag:"🇸🇪",code:"+46"},
  {name:"Switzerland",flag:"🇨🇭",code:"+41"},
  {name:"Syria",flag:"🇸🇾",code:"+963"},
  {name:"Taiwan",flag:"🇹🇼",code:"+886"},
  {name:"Tajikistan",flag:"🇹🇯",code:"+992"},
  {name:"Tanzania",flag:"🇹🇿",code:"+255"},
  {name:"Thailand",flag:"🇹🇭",code:"+66"},
  {name:"Tunisia",flag:"🇹🇳",code:"+216"},
  {name:"Turkey",flag:"🇹🇷",code:"+90"},
  {name:"Uganda",flag:"🇺🇬",code:"+256"},
  {name:"Ukraine",flag:"🇺🇦",code:"+380"},
  {name:"United Arab Emirates",flag:"🇦🇪",code:"+971"},
  {name:"United Kingdom",flag:"🇬🇧",code:"+44"},
  {name:"United States",flag:"🇺🇸",code:"+1"},
  {name:"Uzbekistan",flag:"🇺🇿",code:"+998"},
  {name:"Vietnam",flag:"🇻🇳",code:"+84"},
  {name:"Yemen",flag:"🇾🇪",code:"+967"},
];

let selectedCountry = COUNTRIES[0];

// ─── EMOJIS ───
const EMOJIS = ['😀','😂','🥰','😍','🤩','😎','🥺','😢','😭','😡','🤔','🤗','👋','🙌','👍','❤️','🔥','💯','✨','🎉','🙏','💪','🚀','⭐','🌙','☀️','🌍','🎵','🎮','📱','💻','🏆','🌹','🍕','☕','🤲','💕','🥳','😴','🤭','👀','💀','🫡','🫢','🫣','🤌','🫶','🩷','🧡','💛','💚','💙','💜','🖤','🤍','🫀','⚡','🌈','🦋','🐼','🦊','🐯','🐺','🦁','🐸'];

// ─── SPLASH → LOGIN ───
setTimeout(() => {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  buildCountryList(COUNTRIES);
  setCountry(selectedCountry);
  buildEmojiPicker();
}, 2800);

// ─── COUNTRY SELECTOR ───
function buildCountryList(list) {
  const container = document.getElementById('countryList');
  container.innerHTML = '';
  list.forEach(c => {
    const div = document.createElement('div');
    div.className = 'country-option';
    div.innerHTML = `<span class="flag">${c.flag}</span><span class="name">${c.name}</span><span class="code">${c.code}</span>`;
    div.onclick = () => { setCountry(c); closeCountryDropdown(); };
    container.appendChild(div);
  });
}
function setCountry(c) {
  selectedCountry = c;
  document.getElementById('selectedFlag').textContent = c.flag;
  document.getElementById('selectedCode').textContent = c.code;
}
function toggleCountryDropdown() {
  const dd = document.getElementById('countryDropdown');
  dd.classList.toggle('hidden');
  if (!dd.classList.contains('hidden')) document.getElementById('countrySearch').focus();
}
function closeCountryDropdown() {
  document.getElementById('countryDropdown').classList.add('hidden');
}
function filterCountries(q) {
  buildCountryList(COUNTRIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.code.includes(q)));
}
document.addEventListener('click', e => {
  const sel = document.getElementById('countrySelector');
  const dd = document.getElementById('countryDropdown');
  if (sel && dd && !sel.contains(e.target) && !dd.contains(e.target)) closeCountryDropdown();
});

// ─── TOAST ───
function showToast(msg, color) {
  const ex = document.querySelector('.toast');
  if (ex) ex.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.background = color || '#6c63ff';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t && t.remove(), 3200);
}

// ─── LOGIN ───
function doLogin() {
  const username = document.getElementById('usernameInput').value.trim();
  if (!username || username.length < 2) {
    showToast('⚠️ Min 2 characters!', '#ff6584'); return;
  }
  myUsername = username;
  enterApp();
}

function googleLogin() {
  showToast('⚙️ Google login — add your Client ID in app.js', '#e65100');
}
function appleLogin() {
  showToast('🍎 Apple login — configure in Apple Developer portal', '#555');
}

// ─── ENTER APP ───
function enterApp() {
  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  // Set my avatar
  const initial = myUsername[0].toUpperCase();
  document.getElementById('myAvatarSmall').textContent = initial;

  // Add my story
  const storyRow = document.getElementById('storyRow');
  const myStory = document.createElement('div');
  myStory.className = 'story-item';
  myStory.innerHTML = `
    <div class="story-ring"><div class="story-inner" style="background:linear-gradient(135deg,#6c63ff,#ff6584)">${initial}</div></div>
    <span class="story-name">You</span>`;
  storyRow.appendChild(myStory);

  connectWebSocket();
}

// ─── WEBSOCKET ───
function connectWebSocket() {
  setConnStatus('connecting');

  try {
    ws = new WebSocket(WS_URL);
  } catch(e) {
    setConnStatus('disconnected');
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    setConnStatus('connected');
    clearTimeout(reconnectTimer);
    // Join the server with my username
    wsSend({ type: 'join', user: myUsername });
    showToast(`✅ Connected as ${myUsername}`, '#43e97b');
  };

  ws.onmessage = (event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }
    handleIncoming(msg);
  };

  ws.onclose = () => {
    setConnStatus('disconnected');
    scheduleReconnect();
  };

  ws.onerror = () => {
    setConnStatus('disconnected');
  };
}

function wsSend(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function scheduleReconnect() {
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    if (myUsername) connectWebSocket();
  }, 4000);
}

function setConnStatus(status) {
  const el = document.getElementById('connStatus');
  el.className = 'conn-status ' + status;
  el.textContent = status === 'connected' ? `✅ Connected as ${myUsername}`
    : status === 'connecting' ? '⏳ Connecting...'
    : '🔴 Disconnected — retrying...';
}

// ─── HANDLE INCOMING MESSAGES ───
function handleIncoming(msg) {
  if (msg.type === 'system') {
    // Someone joined/left — show in current chat if open
    appendSysMsg(msg.message);
    return;
  }

  if (msg.type === 'msg') {
    const other = msg.from === myUsername ? msg.to : msg.from;
    const isMine = msg.from === myUsername;

    // Init chat if new
    if (!chats[other]) initChat(other);

    // Store message
    chats[other].messages.push({
      from: msg.from,
      text: msg.text,
      time: msg.timestamp || Date.now(),
      mine: isMine
    });

    // Update preview
    chats[other].lastMsg = msg.text;
    chats[other].lastTime = msg.timestamp || Date.now();

    // Unread count
    if (currentChat !== other && !isMine) {
      chats[other].unread = (chats[other].unread || 0) + 1;
    }

    // Render in chat if open
    if (currentChat === other) {
      renderMessage({ from: msg.from, text: msg.text, time: msg.timestamp || Date.now(), mine: isMine });
      scrollToBottom();
      // Remove typing indicator
      removeTyping();
    }

    // Refresh chat list
    refreshChatList();
  }
}

function initChat(username) {
  if (chats[username]) return;
  chats[username] = { messages: [], unread: 0, online: false, lastMsg: '', lastTime: Date.now() };
}

// ─── NEW CHAT ───
function showNewChat() {
  document.getElementById('newChatModal').classList.remove('hidden');
  document.getElementById('findUserInput').focus();
}
function hideNewChat() {
  document.getElementById('newChatModal').classList.add('hidden');
  document.getElementById('findUserInput').value = '';
}
function startChat() {
  const target = document.getElementById('findUserInput').value.trim();
  if (!target) { showToast('⚠️ Enter a username', '#ff6584'); return; }
  if (target === myUsername) { showToast('⚠️ That\'s you!', '#ff6584'); return; }
  hideNewChat();
  openChat(target);
}

// ─── OPEN CHAT ───
function openChat(username) {
  currentChat = username;
  initChat(username);
  chats[username].unread = 0;

  // Update topbar
  document.getElementById('chatName').textContent = username;
  document.getElementById('chatStatus').textContent = chats[username].online ? '● Online' : '⏺ Last seen recently';
  const color = avatarColor(username);
  document.getElementById('topbarAvatar').textContent = username[0].toUpperCase();
  document.getElementById('topbarAvatar').style.background = color;

  // Show chat area
  document.getElementById('chatArea').classList.remove('hidden');
  document.getElementById('noChatSelected').style.display = 'none';
  document.getElementById('app').classList.add('chat-open');

  // Highlight in sidebar
  document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
  const item = document.getElementById('ci-' + username);
  if (item) item.classList.add('active');

  // Render messages
  const wrap = document.getElementById('messages');
  wrap.innerHTML = '<div class="date-divider">Today</div>';

  if (chats[username].messages.length === 0) {
    wrap.innerHTML += `<div class="welcome-msg"><div class="welcome-bubble">👋 Say hi to ${username}!</div></div>`;
  } else {
    chats[username].messages.forEach(m => renderMessage(m));
  }

  scrollToBottom();
  refreshChatList();
  document.getElementById('msgInput').focus();
}

// ─── RENDER MESSAGE ───
function renderMessage(m) {
  const wrap = document.getElementById('messages');
  // Remove welcome msg
  const welcome = wrap.querySelector('.welcome-msg');
  if (welcome) welcome.remove();

  const time = new Date(m.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  const color = avatarColor(m.from);
  const initial = m.from[0].toUpperCase();

  const div = document.createElement('div');
  div.className = 'msg ' + (m.mine ? 'sent' : 'received');
  div.innerHTML = `
    <div class="msg-avatar-sm" style="background:${color}">${initial}</div>
    <div>
      <div class="msg-bubble">${escHtml(m.text)}</div>
      <div class="msg-time">${time}${m.mine ? ' <span class="tick delivered">✓✓</span>' : ''}</div>
    </div>`;
  wrap.appendChild(div);
}

// ─── SEND MESSAGE ───
function sendMsg() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text || !currentChat) return;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    showToast('⚠️ Not connected! Reconnecting...', '#ff6584');
    connectWebSocket(); return;
  }

  wsSend({ type: 'private_msg', to: currentChat, text });
  input.value = '';
  input.style.height = 'auto';
  hideEmoji();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

// ─── REFRESH CHAT LIST ───
function refreshChatList() {
  const list = document.getElementById('chatList');
  const sorted = Object.entries(chats).sort((a,b) => (b[1].lastTime||0) - (a[1].lastTime||0));

  if (sorted.length === 0) {
    list.innerHTML = `<div class="empty-chats"><div style="font-size:48px;margin-bottom:12px">💬</div><p>No conversations yet</p><p style="font-size:12px;margin-top:4px">Tap ✏️ to start chatting!</p></div>`;
    return;
  }

  list.innerHTML = '';
  sorted.forEach(([username, data]) => {
    const color = avatarColor(username);
    const initial = username[0].toUpperCase();
    const time = data.lastTime ? timeAgo(data.lastTime) : '';
    const isActive = currentChat === username;

    const item = document.createElement('div');
    item.className = 'chat-item' + (isActive ? ' active' : '') + (data.unread ? ' unread' : '');
    item.id = 'ci-' + username;
    item.onclick = () => openChat(username);
    item.innerHTML = `
      <div class="chat-avatar${data.online ? ' online' : ''}" style="background:${color}">${initial}</div>
      <div class="chat-info">
        <div class="chat-name">${escHtml(username)}</div>
        <div class="chat-preview">${escHtml(data.lastMsg || 'Start chatting!')}</div>
      </div>
      <div class="chat-meta">
        <span class="chat-time">${time}</span>
        ${data.unread ? `<span class="badge">${data.unread}</span>` : ''}
      </div>`;
    list.appendChild(item);
  });
}

// ─── SYSTEM MESSAGE ───
function appendSysMsg(text) {
  if (!currentChat) return;
  const wrap = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'sys-msg';
  div.textContent = text;
  wrap.appendChild(div);
  scrollToBottom();
}

// ─── TYPING INDICATOR ───
let typingTimeout = null;
function removeTyping() {
  const t = document.getElementById('messages').querySelector('.typing-indicator');
  if (t) t.remove();
}

// ─── EMOJI PICKER ───
function buildEmojiPicker() {
  const grid = document.getElementById('emojiGrid');
  EMOJIS.forEach(e => {
    const span = document.createElement('span');
    span.textContent = e;
    span.onclick = () => {
      const input = document.getElementById('msgInput');
      input.value += e;
      input.focus();
    };
    grid.appendChild(span);
  });
}
function toggleEmoji() {
  document.getElementById('emojiPicker').classList.toggle('hidden');
}
function hideEmoji() {
  document.getElementById('emojiPicker').classList.add('hidden');
}
document.addEventListener('click', e => {
  const picker = document.getElementById('emojiPicker');
  const btn = document.querySelector('.emoji-btn');
  if (picker && btn && !picker.contains(e.target) && !btn.contains(e.target)) hideEmoji();
});

// ─── TABS ───
let currentTab = 'all';
function switchTab(el, tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentTab = tab;
}

// ─── SEARCH ───
function filterChats(q) {
  document.querySelectorAll('.chat-item').forEach(item => {
    const name = item.querySelector('.chat-name')?.textContent.toLowerCase() || '';
    item.style.display = name.includes(q.toLowerCase()) ? '' : 'none';
  });
}

// ─── NAV ───
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

// ─── BACK ───
function backToList() {
  document.getElementById('app').classList.remove('chat-open');
  currentChat = '';
}

// ─── UTILS ───
function avatarColor(username) {
  const colors = ['#6c63ff','#ff6584','#43e97b','#f7971e','#0072ff','#ee0979','#11998e','#8e2de2'];
  let hash = 0;
  for (let c of username) hash = c.charCodeAt(0) + ((hash<<5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'now';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm';
  if (diff < 86400000) return Math.floor(diff/3600000) + 'h';
  return Math.floor(diff/86400000) + 'd';
}

function scrollToBottom() {
  const wrap = document.getElementById('messages');
  setTimeout(() => wrap.scrollTop = wrap.scrollHeight, 50);
}

function escHtml(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
   
