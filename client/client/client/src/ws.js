// client/src/ws.js
// Simple WebSocket wrapper for RN/web
export default class WSClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.userId = null;
    this.onMessage = null;
    this.onOpen = null;
    this.onClose = null;
  }

  connect(userId) {
    this.userId = userId;
    const wsUrl = `${this.url}?userId=${encodeURIComponent(userId)}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => { if (this.onOpen) this.onOpen(); };
    this.ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (this.onMessage) this.onMessage(data);
    };
    this.ws.onclose = () => { if (this.onClose) this.onClose(); };
    this.ws.onerror = (err) => { console.warn('WS error', err); };
  }

  send(obj) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(obj));
    } else {
      console.warn('WS not open');
    }
  }

  close() {
    if (this.ws) this.ws.close();
  }
}
