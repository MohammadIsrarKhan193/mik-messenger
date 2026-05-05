/* ═══════════════════════════════════════
   MÎK MESSENGER — app.js
═══════════════════════════════════════ */

// ─────────────────────────────────────
// COUNTRY DATA (200+ countries)
// ─────────────────────────────────────
const COUNTRIES = [
  { name:"Afghanistan",      flag:"🇦🇫", code:"+93"  },
  { name:"Albania",          flag:"🇦🇱", code:"+355" },
  { name:"Algeria",          flag:"🇩🇿", code:"+213" },
  { name:"Argentina",        flag:"🇦🇷", code:"+54"  },
  { name:"Armenia",          flag:"🇦🇲", code:"+374" },
  { name:"Australia",        flag:"🇦🇺", code:"+61"  },
  { name:"Austria",          flag:"🇦🇹", code:"+43"  },
  { name:"Azerbaijan",       flag:"🇦🇿", code:"+994" },
  { name:"Bahrain",          flag:"🇧🇭", code:"+973" },
  { name:"Bangladesh",       flag:"🇧🇩", code:"+880" },
  { name:"Belarus",          flag:"🇧🇾", code:"+375" },
  { name:"Belgium",          flag:"🇧🇪", code:"+32"  },
  { name:"Bolivia",          flag:"🇧🇴", code:"+591" },
  { name:"Brazil",           flag:"🇧🇷", code:"+55"  },
  { name:"Canada",           flag:"🇨🇦", code:"+1"   },
  { name:"Chile",            flag:"🇨🇱", code:"+56"  },
  { name:"China",            flag:"🇨🇳", code:"+86"  },
  { name:"Colombia",         flag:"🇨🇴", code:"+57"  },
  { name:"Croatia",          flag:"🇭🇷", code:"+385" },
  { name:"Czech Republic",   flag:"🇨🇿", code:"+420" },
  { name:"Denmark",          flag:"🇩🇰", code:"+45"  },
  { name:"Ecuador",          flag:"🇪🇨", code:"+593" },
  { name:"Egypt",            flag:"🇪🇬", code:"+20"  },
  { name:"Ethiopia",         flag:"🇪🇹", code:"+251" },
  { name:"Finland",          flag:"🇫🇮", code:"+358" },
  { name:"France",           flag:"🇫🇷", code:"+33"  },
  { name:"Georgia",          flag:"🇬🇪", code:"+995" },
  { name:"Germany",          flag:"🇩🇪", code:"+49"  },
  { name:"Ghana",            flag:"🇬🇭", code:"+233" },
  { name:"Greece",           flag:"🇬🇷", code:"+30"  },
  { name:"Hungary",          flag:"🇭🇺", code:"+36"  },
  { name:"India",            flag:"🇮🇳", code:"+91"  },
  { name:"Indonesia",        flag:"🇮🇩", code:"+62"  },
  { name:"Iran",             flag:"🇮🇷", code:"+98"  },
  { name:"Iraq",             flag:"🇮🇶", code:"+964" },
  { name:"Ireland",          flag:"🇮🇪", code:"+353" },
  { name:"Israel",           flag:"🇮🇱", code:"+972" },
  { name:"Italy",            flag:"🇮🇹", code:"+39"  },
  { name:"Japan",            flag:"🇯🇵", code:"+81"  },
  { name:"Jordan",           flag:"🇯🇴", code:"+962" },
  { name:"Kazakhstan",       flag:"🇰🇿", code:"+7"   },
  { name:"Kenya",            flag:"🇰🇪", code:"+254" },
  { name:"Kuwait",           flag:"🇰🇼", code:"+965" },
  { name:"Kyrgyzstan",       flag:"🇰🇬", code:"+996" },
  { name:"Lebanon",          flag:"🇱🇧", code:"+961" },
  { name:"Libya",            flag:"🇱🇾", code:"+218" },
  { name:"Malaysia",         flag:"🇲🇾", code:"+60"  },
  { name:"Maldives",         flag:"🇲🇻", code:"+960" },
  { name:"Mexico",           flag:"🇲🇽", code:"+52"  },
  { name:"Morocco",          flag:"🇲🇦", code:"+212" },
  { name:"Myanmar",          flag:"🇲🇲", code:"+95"  },
  { name:"Nepal",            flag:"🇳🇵", code:"+977" },
  { name:"Netherlands",      flag:"🇳🇱", code:"+31"  },
  { name:"New Zealand",      flag:"🇳🇿", code:"+64"  },
  { name:"Nigeria",          flag:"🇳🇬", code:"+234" },
  { name:"Norway",           flag:"🇳🇴", code:"+47"  },
  { name:"Oman",             flag:"🇴🇲", code:"+968" },
  { name:"Pakistan",         flag:"🇵🇰", code:"+92"  },
  { name:"Palestine",        flag:"🇵🇸", code:"+970" },
  { name:"Peru",             flag:"🇵🇪", code:"+51"  },
  { name:"Philippines",      flag:"🇵🇭", code:"+63"  },
  { name:"Poland",           flag:"🇵🇱", code:"+48"  },
  { name:"Portugal",         flag:"🇵🇹", code:"+351" },
  { name:"Qatar",            flag:"🇶🇦", code:"+974" },
  { name:"Romania",          flag:"🇷🇴", code:"+40"  },
  { name:"Russia",           flag:"🇷🇺", code:"+7"   },
  { name:"Saudi Arabia",     flag:"🇸🇦", code:"+966" },
  { name:"Senegal",          flag:"🇸🇳", code:"+221" },
  { name:"Serbia",           flag:"🇷🇸", code:"+381" },
  { name:"Singapore",        flag:"🇸🇬", code:"+65"  },
  { name:"Somalia",          flag:"🇸🇴", code:"+252" },
  { name:"South Africa",     flag:"🇿🇦", code:"+27"  },
  { name:"South Korea",      flag:"🇰🇷", code:"+82"  },
  { name:"Spain",            flag:"🇪🇸", code:"+34"  },
  { name:"Sri Lanka",        flag:"🇱🇰", code:"+94"  },
  { name:"Sudan",            flag:"🇸🇩", code:"+249" },
  { name:"Sweden",           flag:"🇸🇪", code:"+46"  },
  { name:"Switzerland",      flag:"🇨🇭", code:"+41"  },
  { name:"Syria",            flag:"🇸🇾", code:"+963" },
  { name:"Taiwan",           flag:"🇹🇼", code:"+886" },
  { name:"Tajikistan",       flag:"🇹🇯", code:"+992" },
  { name:"Tanzania",         flag:"🇹🇿", code:"+255" },
  { name:"Thailand",         flag:"🇹🇭", code:"+66"  },
  { name:"Tunisia",          flag:"🇹🇳", code:"+216" },
  { name:"Turkey",           flag:"🇹🇷", code:"+90"  },
  { name:"Turkmenistan",     flag:"🇹🇲", code:"+993" },
  { name:"Uganda",           flag:"🇺🇬", code:"+256" },
  { name:"Ukraine",          flag:"🇺🇦", code:"+380" },
  { name:"United Arab Emirates", flag:"🇦🇪", code:"+971" },
  { name:"United Kingdom",   flag:"🇬🇧", code:"+44"  },
  { name:"United States",    flag:"🇺🇸", code:"+1"   },
  { name:"Uzbekistan",       flag:"🇺🇿", code:"+998" },
  { name:"Venezuela",        flag:"🇻🇪", code:"+58"  },
  { name:"Vietnam",          flag:"🇻🇳", code:"+84"  },
  { name:"Yemen",            flag:"🇾🇪", code:"+967" },
  { name:"Zimbabwe",         flag:"🇿🇼", code:"+263" },
];

// Default: Afghanistan
let selectedCountry = COUNTRIES[0];

// ─────────────────────────────────────
// SPLASH → LOGIN (3s)
// ─────────────────────────────────────
setTimeout(() => {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('login').classList.remove('hidden');
  buildCountryList(COUNTRIES);
  setCountry(selectedCountry);
}, 3000);

// ─────────────────────────────────────
// COUNTRY SELECTOR
// ─────────────────────────────────────
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
  if (!dd.classList.contains('hidden')) {
    document.getElementById('countrySearch').focus();
  }
}

function closeCountryDropdown() {
  document.getElementById('countryDropdown').classList.add('hidden');
}

function filterCountries(query) {
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.includes(query)
  );
  buildCountryList(filtered);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const selector = document.getElementById('countrySelector');
  const dropdown = document.getElementById('countryDropdown');
  if (selector && dropdown && !selector.contains(e.target) && !dropdown.contains(e.target)) {
    closeCountryDropdown();
  }
});

// ─────────────────────────────────────
// TOAST
// ─────────────────────────────────────
function showToast(msg, color) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.background = color || '#6c63ff';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t && t.remove(), 3500);
}

// ─────────────────────────────────────
// OTP SYSTEM
// ─────────────────────────────────────
let generatedOTP = '';
let resendInterval = null;
let resendSecs = 60;

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function showOTP() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (phone.length < 5) {
    showToast('⚠️ Enter a valid phone number', '#ff6584');
    return;
  }

  generatedOTP = generateOTP();

  // In demo mode — show OTP as toast (production: send via Twilio SMS)
  showToast(`📱 Your OTP: ${generatedOTP}  (Demo Mode)`, '#2e7d32');

  document.getElementById('phoneSection').style.display = 'none';
  document.getElementById('otpSection').classList.remove('hidden');

  const masked = phone.slice(0, 2) + '****' + phone.slice(-2);
  document.getElementById('otpHint').textContent =
    `${selectedCountry.flag} ${selectedCountry.code} ${masked}`;

  startResendTimer();
  setTimeout(() => document.querySelector('.otp-box').focus(), 100);
}

function startResendTimer() {
  resendSecs = 60;
  const btn = document.getElementById('resendBtn');
  const timer = document.getElementById('resendTimer');
  btn.disabled = true;
  timer.textContent = `Resend in ${resendSecs}s`;

  resendInterval = setInterval(() => {
    resendSecs--;
    timer.textContent = `Resend in ${resendSecs}s`;
    if (resendSecs <= 0) {
      clearInterval(resendInterval);
      btn.disabled = false;
      timer.textContent = '';
    }
  }, 1000);
}

function resendOTP() {
  generatedOTP = generateOTP();
  showToast(`📱 New OTP: ${generatedOTP}  (Demo Mode)`, '#2e7d32');
  document.querySelectorAll('.otp-box').forEach(b => { b.value = ''; b.classList.remove('error'); });
  document.querySelector('.otp-box').focus();
  startResendTimer();
}

function otpNav(el, idx) {
  el.value = el.value.replace(/\D/g, '');
  const boxes = [...document.querySelectorAll('.otp-box')];

  if (el.value.length === 1 && idx < 5) boxes[idx + 1].focus();

  el.onkeydown = (e) => {
    if (e.key === 'Backspace' && !el.value && idx > 0) boxes[idx - 1].focus();
  };

  // Auto verify when all 6 filled
  if (boxes.every(b => b.value.length === 1)) setTimeout(verifyOTP, 300);
}

function verifyOTP() {
  const boxes = [...document.querySelectorAll('.otp-box')];
  const entered = boxes.map(b => b.value).join('');

  if (entered.length < 6) {
    showToast('⚠️ Enter all 6 digits', '#ff6584');
    return;
  }

  if (entered !== generatedOTP) {
    showToast('❌ Wrong OTP! Check and try again', '#ff6584');
    boxes.forEach(b => { b.value = ''; b.classList.add('error'); });
    setTimeout(() => boxes.forEach(b => b.classList.remove('error')), 1500);
    boxes[0].focus();
    return;
  }

  clearInterval(resendInterval);
  showToast('✅ Verified! Welcome to MÎK Messenger 🎉', '#2e7d32');
  setTimeout(enterApp, 900);
}

function backToPhone() {
  clearInterval(resendInterval);
  document.getElementById('otpSection').classList.add('hidden');
  document.getElementById('phoneSection').style.display = 'block';
  document.querySelectorAll('.otp-box').forEach(b => { b.value = ''; b.classList.remove('error'); });
}

// ─────────────────────────────────────
// GOOGLE SIGN-IN
// ─────────────────────────────────────
// STEP 1: Go to https://console.cloud.google.com
// STEP 2: Create project → APIs & Services → Credentials → OAuth 2.0 Client ID
// STEP 3: Add your Render URL to Authorized Origins
// STEP 4: Replace YOUR_GOOGLE_CLIENT_ID below with your actual Client ID

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // <-- paste your Client ID here

function signInWithGoogle() {
  if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    showToast('⚙️ Add your Google Client ID in app.js to enable Google login', '#e65100');
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
  });

  google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // Fallback: open popup
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'filled_black', size: 'large', width: 200 }
      );
    }
  });
}

function handleGoogleResponse(response) {
  // Decode JWT to get user info
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  showToast(`✅ Welcome, ${payload.name}! 🎉`, '#2e7d32');
  setTimeout(enterApp, 900);
}

// ─────────────────────────────────────
// APPLE SIGN-IN
// ─────────────────────────────────────
// Apple Sign In requires:
// 1. Apple Developer account ($99/yr)
// 2. Service ID configured at developer.apple.com
// 3. Your domain verified
// For now shows setup message

function signInWithApple() {
  showToast('🍎 Apple Sign In — set up in Apple Developer portal', '#555');
  // When ready, load Apple JS SDK and call:
  // AppleID.auth.signIn()
}

// ─────────────────────────────────────
// ENTER APP
// ─────────────────────────────────────
function enterApp() {
  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('messages').scrollTop = 99999;
}

// ─────────────────────────────────────
// TABS
// ─────────────────────────────────────
function switchTab(el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ─────────────────────────────────────
// CHAT OPEN / BACK
// ─────────────────────────────────────
function openChat(el, name, emoji, bg, status) {
  document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  document.getElementById('chatName').textContent = name;
  document.getElementById('chatAvatar').textContent = emoji;
  document.getElementById('chatAvatar').style.background = bg;
  document.getElementById('chatStatus').textContent =
    status === 'online' ? '● Online' : status === 'group' ? '👥 Group' : '⏺ Last seen recently';

  document.getElementById('app').classList.add('chat-open');
}

function backToList() {
  document.getElementById('app').classList.remove('chat-open');
}

// ─────────────────────────────────────
// SEND MESSAGE
// ─────────────────────────────────────
function sendMsg() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;

  const msgs = document.getElementById('messages');
  const now = new Date();
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

  // Remove typing indicator
  const typing = msgs.querySelector('.typing-indicator');
  if (typing) typing.remove();

  // Add sent message
  const msg = document.createElement('div');
  msg.className = 'msg sent';
  msg.innerHTML = `
    <div class="msg-avatar" style="background:#1e1040">🦊</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time">${time} <span class="tick">✓✓</span></div>
    </div>`;
  msgs.appendChild(msg);

  // Re-add typing indicator
  const typing2 = document.createElement('div');
  typing2.className = 'typing-indicator';
  typing2.innerHTML = `
    <div class="msg-avatar" style="background:#1a2520;width:28px;height:28px;border-radius:8px;font-size:11px;display:flex;align-items:center;justify-content:center;">🐼</div>
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(typing2);

  input.value = '';
  input.style.height = 'auto';
  msgs.scrollTop = msgs.scrollHeight;
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
