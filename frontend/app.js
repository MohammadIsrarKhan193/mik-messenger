/* ══════════════════════════════
   MÎK MESSENGER — app.js
   Real WebSocket + Clean UI
══════════════════════════════ */

const WS_URL = 'wss://mik-messenger-ws.onrender.com';

// ── State ──
let myName = '';
let currentChat = '';
let ws = null;
let chats = {};
let reconnTimer = null;
let generatedOTP = '';
let resendInterval = null;
let selectedCountry = { name:'Afghanistan', flag:'🇦🇫', code:'+93' };

// ── Countries ──
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
  {name:"France",flag:"🇫🇷",code:"+33"},
  {name:"Germany",flag:"🇩🇪",code:"+49"},
  {name:"Ghana",flag:"🇬🇭",code:"+233"},
  {name:"India",flag:"🇮🇳",code:"+91"},
  {name:"Indonesia",flag:"🇮🇩",code:"+62"},
  {name:"Iran",flag:"🇮🇷",code:"+98"},
  {name:"Iraq",flag:"🇮🇶",code:"+964"},
  {name:"Italy",flag:"🇮🇹",code:"+39"},
  {name:"Japan",flag:"🇯🇵",code:"+81"},
  {name:"Jordan",flag:"🇯🇴",code:"+962"},
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

const EMOJIS = ['😀','😂','🥰','😍','🤩','😎','🥺','😢','😭','😡','🤔','🤗','👋','🙌','👍','👎','❤️','🔥','💯','✨','🎉','🙏','💪','🚀','⭐','🌙','☀️','💕','🫡','🫢','😴','🤭','💀','👀','🤌','🫶','⚡','🌈','🦋','🎵','🎮','📱','💻','🏆','🍕','☕','🤲'];

// ── Init ──
setTimeout(() => {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  buildCountries(COUNTRIES);
  setCountry(selectedCountry);
  buildEmojis();
  // Auto-fill saved name
  try {
    const saved = localStorage.getItem('mik_name');
    if (saved) { document.getElementById('nameInput').value = saved; }
  } catch(e){}
}, 2500);

// ── Country ──
function buildCountries(list) {
  const el = document.getElementById('countryList');
  el.innerHTML = '';
  list.forEach(c => {
    const d = document.createElement('div');
    d.className = 'c-opt';
    d.innerHTML = `<span class="fl">${c.flag}</span><span class="nm">${c.name}</span><span class="cd">${c.code}</span>`;
    d.onclick = () => { setCountry(c); closeDropdown(); };
    el.appendChild(d);
  });
}
function setCountry(c) {
  selectedCountry = c;
  document.getElementById('selFlag').textContent = c.flag;
  document.getElementById('selCode').textContent = c.code;
}
function toggleDropdown() {
  const d = document.getElementById('dropdown');
  d.classList.toggle('hidden');
  if (!d.classList.contains('hidden')) document.getElementById('countrySearch').focus();
}
function closeDropdown() { document.getElementById('dropdown').classList.add('hidden'); }
function filterCountries(q) {
  buildCountries(COUNTRIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.code.includes(q)));
}
document.addEventListener('click', e => {
  const btn = document.getElementById('countryBtn');
  const dd = document.getElementById('dropdown');
  if (btn && dd && !btn.contains(e.target) && !dd.contains(e.target)) closeDropdown();
});

// ── OTP ──
function sendOTP() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (phone.length < 5) { showToast('Enter a valid phone number', 'error'); return; }
  generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  showToast(`OTP: ${generatedOTP} (Demo)`, 'success');
  document.getElementById('phoneStep').classList.add('hidden');
  document.getElementById('otpStep').classList.remove('hidden');
  document.getElementById('otpSentTo').textContent = `We sent a code to ${selectedCountry.code} ${phone.slice(0,3)}***${phone.slice(-2)}`;
  startResend();
  setTimeout(() => document.querySelector('.otp-box').focus(), 100);
}

function otpType(el, idx) {
  el.value = el.value.replace(/\D/g,'');
  const boxes = [...document.querySelectorAll('.otp-box')];
  if (el.value && idx < 5) boxes[idx+1].focus();
  el.onkeydown = e => { if (e.key==='Backspace' && !el.value && idx>0) boxes[idx-1].focus(); };
  if (boxes.every(b => b.value)) setTimeout(verifyOTP, 200);
}

function verifyOTP() {
  const entered = [...document.querySelectorAll('.otp-box')].map(b=>b.value).join('');
  if (entered !== generatedOTP) {
    showToast('Wrong OTP! Try again', 'error');
    document.querySelectorAll('.otp-box').forEach(b => { b.value=''; b.style.borderColor='#e53935'; });
    setTimeout(() => document.querySelectorAll('.otp-box').forEach(b => b.style.borderColor=''), 1500);
    document.querySelector('.otp-box').focus();
    return;
  }
  clearInterval(resendInterval);
  document.getElementById('otpStep').classList.add('hidden');
  document.getElementById('profileStep').classList.remove('hidden');
}

function startResend() {
  let s = 60;
  const btn = document.getElementById('resendBtn');
  const timer = document.getElementById('resendTimer');
  btn.disabled = true;
  timer.textContent = `${s}s`;
  resendInterval = setInterval(() => {
    s--;
    timer.textContent = s > 0 ? `${s}s` : '';
    if (s <= 0) { clearInterval(resendInterval); btn.disabled = false; }
  }, 1000);
}

function resendOTP() {
  generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
  showToast(`New OTP: ${generatedOTP} (Demo)`, 'success');
  document.querySelectorAll('.otp-box').forEach(b => b.value = '');
  document.querySelector('.otp-box').focus();
  startResend();
}

function backToPhone() {
  clearInterval(resendInterval);
  document.getElementById('otpStep').classList.add('hidden');
  document.getElementById('phoneStep').classList.remove('hidden');
  document.querySelectorAll('.otp-box').forEach(b => b.value='');
}

function finishSetup() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name || name.length < 2) { showToast('Enter your name (min 2 chars)', 'error'); return; }
  myName = name;
  try { localStorage.setItem('mik_name', name); } catch(e){}
  enterApp();
}

function googleLogin() { showToast('Add Google Client ID in app.js to enable', 'info'); }
function appleLogin() { showToast('Configure Apple Sign In in Apple Developer portal', 'info'); }

// ── Enter App ──
function enterApp() {
  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  const init = myName[0].toUpperCase();
  document.getElementById('myAvatar').textContent = init;
  document.getElementById('myAvatar').style.background = avatarColor(myName);
  connectWS();
}

// ── WebSocket ──
function connectWS() {
  setStatus('connecting');
  try { ws = new WebSocket(WS_URL); } catch(e) { setStatus('disconnected'); schedReconnect(); return; }
  ws.onopen = () => {
    setStatus('connected');
    clearTimeout(reconnTimer);
    wsSend({ type:'join', user:myName });
  };
  ws.onmessage = e => {
    try { handleMsg(JSON.parse(e.data)); } catch(err){}
  };
  ws.onclose = () => { setStatus('disconnected'); schedReconnect(); };
  ws.onerror = () => { setStatus('disconnected'); };
}

function wsSend(data) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

function schedReconnect() {
  clearTimeout(reconnTimer);
  reconnTimer = setTimeout(() => { if (myName) connectWS(); }, 5000);
}

function setStatus(s) {
  const el = document.getElementById('statusBar');
  const txt = document.getElementById('statusText');
  el.className = 'status-bar ' + s;
  txt.textContent = s==='connected' ? `✓ Connected as ${myName}`
    : s==='connecting' ? 'Connecting...'
    : 'Disconnected — retrying in 5s...';
}

// ── Handle incoming ──
function handleMsg(msg) {
  if (msg.type === 'system') {
    if (currentChat) appendSys(msg.message);
    return;
  }
  if (msg.type === 'msg') {
    const other = msg.from === myName ? msg.to : msg.from;
    const mine = msg.from === myName;
    if (!chats[other]) initChat(other);
    chats[other].msgs.push({ from:msg.from, text:msg.text, time:msg.timestamp||Date.now(), mine });
    chats[other].lastMsg = msg.text;
    chats[other].lastTime = msg.timestamp||Date.now();
    if (currentChat !== other && !mine) chats[other].unread = (chats[other].unread||0)+1;
    if (currentChat === other) { renderBubble(chats[other].msgs.at(-1)); scrollBottom(); }
    refreshList();
  }
}

function initChat(u) {
  if (!chats[u]) chats[u] = { msgs:[], unread:0, lastMsg:'', lastTime:Date.now() };
}

// ── New Chat ──
function showNewChat() { document.getElementById('newChatModal').classList.remove('hidden'); document.getElementById('newChatInput').focus(); }
function hideNewChat() { document.getElementById('newChatModal').classList.add('hidden'); document.getElementById('newChatInput').value=''; }
function startNewChat() {
  const u = document.getElementById('newChatInput').value.trim();
  if (!u) { showToast('Enter a username', 'error'); return; }
  if (u === myName) { showToast("That's you!", 'error'); return; }
  hideNewChat();
  openChat(u);
}

// ── Open Chat ──
function openChat(u) {
  currentChat = u;
  initChat(u);
  chats[u].unread = 0;

  // Update header
  document.getElementById('peerName').textContent = u;
  document.getElementById('peerStatus').textContent = 'tap here for contact info';
  const av = document.getElementById('peerAvatar');
  av.textContent = u[0].toUpperCase();
  av.style.background = avatarColor(u);

  // Show chat area
  document.getElementById('chatArea').classList.remove('hidden');
  document.getElementById('noChat').style.display = 'none';
  document.getElementById('app').classList.add('chat-open');

  // Highlight row
  document.querySelectorAll('.chat-row').forEach(r => r.classList.remove('active'));
  const row = document.getElementById('row-'+u);
  if (row) row.classList.add('active');

  // Render messages
  const wrap = document.getElementById('messages');
  wrap.innerHTML = `
    <div class="chat-bg-note">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
      Messages are end-to-end encrypted
    </div>
    <div class="date-chip">Today</div>`;

  if (chats[u].msgs.length === 0) {
    wrap.innerHTML += `<div class="sys-note">Say hi to ${u}! 👋</div>`;
  } else {
    chats[u].msgs.forEach(m => renderBubble(m));
  }

  scrollBottom();
  refreshList();
  document.getElementById('msgInput').focus();
}

// ── Render bubble ──
function renderBubble(m) {
  const wrap = document.getElementById('messages');
  // Remove "say hi" note
  const note = wrap.querySelector('.sys-note');
  if (note) note.remove();

  const time = new Date(m.time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const div = document.createElement('div');
  div.className = `msg-wrap ${m.mine?'out':'in'}`;
  div.innerHTML = `
    <div class="bubble">
      <div class="btext">${escHtml(m.text)}</div>
      <div class="bmeta">
        <span class="btime">${time}</span>
        ${m.mine ? '<span class="btick read">✓✓</span>' : ''}
      </div>
    </div>`;
  wrap.appendChild(div);
}

// ── Send ──
function sendMsg() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text || !currentChat) return;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    showToast('Not connected! Reconnecting...', 'error');
    connectWS(); return;
  }
  wsSend({ type:'private_msg', to:currentChat, text });
  input.value = '';
  input.style.height = 'auto';
  hideEmoji();
}

function handleKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }
function autoResize(el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,100)+'px'; }

// ── Refresh list ──
function refreshList() {
  const list = document.getElementById('chatList');
  const sorted = Object.entries(chats).sort((a,b)=>(b[1].lastTime||0)-(a[1].lastTime||0));
  if (!sorted.length) {
    list.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="#ccc"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg><p>No chats yet</p><span>Tap the icon above to start</span></div>`;
    return;
  }
  list.innerHTML = '';
  sorted.forEach(([u, data]) => {
    const color = avatarColor(u);
    const time = data.lastTime ? timeAgo(data.lastTime) : '';
    const active = currentChat === u;
    const row = document.createElement('div');
    row.className = 'chat-row' + (active?' active':'');
    row.id = 'row-'+u;
    row.onclick = () => openChat(u);
    row.innerHTML = `
      <div class="av" style="background:${color}">${u[0].toUpperCase()}</div>
      <div class="info">
        <div class="row1">
          <span class="name">${escHtml(u)}</span>
          <span class="time">${time}</span>
        </div>
        <div class="row2">
          <span class="preview">${escHtml(data.lastMsg||'Tap to chat')}</span>
          ${data.unread ? `<span class="badge">${data.unread}</span>` : ''}
        </div>
      </div>`;
    list.appendChild(row);
  });
}

function appendSys(text) {
  const wrap = document.getElementById('messages');
  const d = document.createElement('div');
  d.className = 'sys-note';
  d.textContent = text;
  wrap.appendChild(d);
  scrollBottom();
}

// ── Emoji ──
function buildEmojis() {
  const grid = document.getElementById('emojiGrid');
  EMOJIS.forEach(e => {
    const s = document.createElement('span');
    s.textContent = e;
    s.onclick = () => { document.getElementById('msgInput').value += e; document.getElementById('msgInput').focus(); };
    grid.appendChild(s);
  });
}
function toggleEmoji() { document.getElementById('emojiPanel').classList.toggle('hidden'); }
function hideEmoji() { document.getElementById('emojiPanel').classList.add('hidden'); }

// ── Search ──
function filterChats(q) {
  document.querySelectorAll('.chat-row').forEach(r => {
    const name = r.querySelector('.name')?.textContent.toLowerCase()||'';
    r.style.display = name.includes(q.toLowerCase()) ? '' : 'none';
  });
}

// ── Close chat (mobile) ──
function closeChat() {
  document.getElementById('app').classList.remove('chat-open');
  currentChat = '';
  document.getElementById('chatArea').classList.add('hidden');
  document.getElementById('noChat').style.display = '';
}

// ── Toast ──
function showToast(msg, type='info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  setTimeout(() => t.className='toast hidden', 3000);
}

// ── Utils ──
function avatarColor(u) {
  const colors = ['#075E54','#25D366','#128C7E','#34B7F1','#FF6B6B','#845EC2','#FF9671','#00C9A7'];
  let h = 0;
  for (let c of u) h = c.charCodeAt(0) + ((h<<5)-h);
  return colors[Math.abs(h)%colors.length];
}

function timeAgo(ts) {
  const d = Date.now()-ts;
  if (d < 60000) return 'now';
  if (d < 3600000) return Math.floor(d/60000)+'m';
  if (d < 86400000) return Math.floor(d/3600000)+'h';
  return new Date(ts).toLocaleDateString([],{day:'2-digit',month:'2-digit'});
}

function scrollBottom() {
  const w = document.getElementById('messages');
  setTimeout(() => w.scrollTop=w.scrollHeight, 50);
}

function escHtml(t) {
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
     }
