const ID_PREFIX = 'roomsync-';

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export class RoomSync extends EventTarget {
  constructor(options = {}) {
    super();
    this.roomParam = options.roomParam || 'room';
    this.container = document.getElementById(options.containerId || 'room-ui');
    this.hostBadge = document.getElementById(options.hostBadgeId || 'room-host-badge');
    this.copyBtn = document.getElementById(options.copyBtnId || 'room-copy-btn');

    this.peer = null;
    this.roomCode = null;
    this.isHost = false;
    this.connections = new Map();
    this.hostConn = null;
    this.joinedAt = Date.now();
    this.destroyed = false;

    if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyInviteLink());
  }

  async start() {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get(this.roomParam);

    if (!codeParam) {
      this.roomCode = generateRoomCode();
      await this.becomeHost(this.roomCode);
    } else {
      this.roomCode = codeParam.toUpperCase();
      await this.joinThenFallbackToHost(this.roomCode);
    }

    this.showUI();
    return this;
  }

  send(type, payload) {
    if (!this.peer) return;
    const msg = { type, payload, from: this.peer.id, ts: Date.now() };
    if (this.isHost) {
      this.handleIncoming(msg);
      this.broadcast(msg);
    } else if (this.hostConn && this.hostConn.open) {
      this.hostConn.send(msg);
    }
  }

  on(eventName, callback) {
    this.addEventListener(eventName, callback);
    return this;
  }

  off(eventName, callback) {
    this.removeEventListener(eventName, callback);
    return this;
  }

  getShareUrl() {
    const url = new URL(location.href);
    url.searchParams.set(this.roomParam, this.roomCode);
    return url.toString();
  }

  async copyInviteLink() {
    const url = this.getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  destroy() {
    this.destroyed = true;
    if (this.peer) this.peer.destroy();
    if (this.container) this.container.hidden = true;
  }

  peerId(code) {
    return ID_PREFIX + code;
  }

  handleIncoming(msg) {
    this.dispatchEvent(new CustomEvent('action', { detail: msg }));
  }

  broadcast(msg) {
    for (const [id, conn] of this.connections) {
      if (conn.open) conn.send(msg);
    }
  }

  becomeHost(code) {
    return new Promise((resolve) => {
      const peer = new Peer(this.peerId(code));
      this.peer = peer;

      peer.on('open', () => {
        this.isHost = true;
        this.hostConn = null;
        this.setupHostListeners();
        this.dispatchEvent(new CustomEvent('hostchange', { detail: { isHost: true } }));
        this.updateHostBadge();
        resolve();
      });

      peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          peer.destroy();
          this.joinAsClient(code).then(resolve).catch(resolve);
        } else {
          console.error('RoomSync host error:', err);
          resolve();
        }
      });
    });
  }

  async joinThenFallbackToHost(code) {
    try {
      await this.joinAsClient(code, 4000);
    } catch {
      await this.becomeHost(code);
    }
  }

  joinAsClient(code, timeout = 6000) {
    return new Promise((resolve, reject) => {
      const peer = new Peer();
      this.peer = peer;
      let settled = false;

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        peer.destroy();
        reject(new Error('No host found'));
      }, timeout);

      peer.on('open', () => {
        const conn = peer.connect(this.peerId(code), { reliable: true });

        conn.on('open', () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          this.isHost = false;
          this.hostConn = conn;
          this.setupClientListeners(conn);
          this.dispatchEvent(new CustomEvent('hostchange', { detail: { isHost: false } }));
          this.updateHostBadge();
          resolve();
        });

        conn.on('error', () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(new Error('Connection to host failed'));
        });becomeHost
      });

      peer.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  setupHostListeners() {
    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        this.connections.set(conn.peer, conn);
        this.dispatchEvent(new CustomEvent('peerjoined', { detail: { peerId: conn.peer } }));
      });
      conn.on('data', (data) => {
        this.handleIncoming(data);
        this.broadcast(data);
      });
      conn.on('close', () => {
        this.connections.delete(conn.peer);
        this.dispatchEvent(new CustomEvent('peerleft', { detail: { peerId: conn.peer } }));
      });
    });
  }

  setupClientListeners(conn) {
    conn.on('data', (data) => this.handleIncoming(data));
    conn.on('close', () => this.handleHostLost());
  }

  handleHostLost() {
    if (this.destroyed) return;
    this.dispatchEvent(new CustomEvent('hostlost'));
    this.hostConn = null;

    // Longest-connected peer waits the shortest time, so it wins the race to re-host
    const tenure = Date.now() - this.joinedAt;
    const wait = Math.max(150, 3000 - Math.min(tenure / 10, 2800)) + Math.random() * 250;

    setTimeout(async () => {
      if (this.destroyed) return;
      if (this.peer) this.peer.destroy();
      await this.becomeHost(this.roomCode);
    }, wait);
  }

  showUI() {
    if (this.container) this.container.hidden = false;
    this.updateHostBadge();
  }

  updateHostBadge() {
    if (this.hostBadge) this.hostBadge.hidden = !this.isHost;
  }
}