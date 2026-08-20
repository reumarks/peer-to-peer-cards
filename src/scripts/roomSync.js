const ID_PREFIX = 'roomsync-';
const MAX_PLAYERS = 4;

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function isProtocolType(type) {
    return typeof type === 'string' && type.startsWith('__');
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
        this.playerNumbers = new Map();
        this.playerNumber = null;
        this.playerCount = 0;
        this.hostConn = null;
        this.joinedAt = Date.now();
        this.destroyed = false;
        this.connectionFailed = false;

        if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyInviteLink());
    }

    async start() {
        const params = new URLSearchParams(location.search);
        let codeParam = params.get(this.roomParam);

        if (!codeParam) {
            codeParam = generateRoomCode();
            params.set(this.roomParam, codeParam);
            const newUrl = `${location.pathname}?${params.toString()}${location.hash}`;
            history.replaceState(null, '', newUrl);
        }

        this.roomCode = codeParam.toUpperCase();
        try {
            await this.joinAsClient(this.roomCode, 4000);
        } catch (err) {
            if (err.message === 'Room full') {
                this.dispatchEvent(new CustomEvent('roomfull'));
            } else {
                await this.becomeHost(this.roomCode);
            }
        }

        if (this.playerNumber == null) this.connectionFailed = true;

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

    setRole(isHost, hostConn = null) {
        this.isHost = isHost;
        this.hostConn = hostConn;
        this.dispatchEvent(new CustomEvent('hostchange', { detail: { isHost } }));
        this.updateHostBadge();
    }

    handleIncoming(msg) {
        this.dispatchEvent(new CustomEvent('action', { detail: msg }));
    }

    broadcast(msg, excludePeerId) {
        for (const [id, conn] of this.connections) {
            if (id !== excludePeerId && conn.open) conn.send(msg);
        }
    }

    becomeHost(code) {
        return new Promise((resolve) => {
            if (this.peer) this.peer.destroy();
            const peer = new Peer(this.peerId(code));
            this.peer = peer;

            peer.on('open', () => {
                if (this.playerNumber == null) this.playerNumber = 1;
                this.playerNumbers = new Map();
                this.playerCount = 1;
                this.setRole(true);
                this.setupHostListeners();
                resolve();
            });

            peer.on('error', (err) => {
                peer.destroy();
                if (err.type === 'unavailable-id') {
                    this.joinAsClient(code)
                        .then(resolve)
                        .catch((joinErr) => {
                            if (joinErr.message === 'Room full') {
                                this.dispatchEvent(new CustomEvent('roomfull'));
                            } else {
                                console.error('RoomSync fallback join error:', joinErr);
                            }
                            resolve();
                        });
                } else {
                    console.error('RoomSync host error:', err);
                    resolve();
                }
            });
        });
    }

    joinAsClient(code, timeout = 6000) {
        return new Promise((resolve, reject) => {
            if (this.peer) this.peer.destroy();
            const peer = new Peer();
            this.peer = peer;
            let settled = false;

            const finish = (fn) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                fn();
            };

            const timer = setTimeout(() => {
                finish(() => {
                    peer.destroy();
                    reject(new Error('No host found'));
                });
            }, timeout);

            peer.on('open', () => {
                const conn = peer.connect(this.peerId(code), { reliable: true });

                conn.once('data', (msg) => {
                    if (msg && msg.type === '__welcome') {
                        finish(() => {
                            this.playerNumber = msg.payload.number;
                            this.playerCount = msg.payload.count;
                            this.setRole(false, conn);
                            this.setupClientListeners(conn);
                            resolve();
                        });
                    } else if (msg && msg.type === '__room-full') {
                        finish(() => {
                            conn.close();
                            peer.destroy();
                            reject(new Error('Room full'));
                        });
                    }
                });

                conn.on('error', () => {
                    finish(() => {
                        peer.destroy();
                        reject(new Error('Connection to host failed'));
                    });
                });
            });

            peer.on('error', (err) => {
                finish(() => {
                    peer.destroy();
                    reject(err);
                });
            });
        });
    }
    nextAvailableNumber() {
        const taken = new Set([this.playerNumber, ...this.playerNumbers.values()]);
        for (let n = 1; n <= MAX_PLAYERS; n++) {
            if (!taken.has(n)) return n;
        }
        return null;
    }

    setupHostListeners() {
        this.peer.on('connection', (conn) => {
            conn.on('open', () => {
                const number = this.nextAvailableNumber();

                if (number == null) {
                    conn.send({ type: '__room-full' });
                    conn.close();
                    return;
                }

                this.playerNumbers.set(conn.peer, number);
                this.connections.set(conn.peer, conn);
                this.playerCount = 1 + this.playerNumbers.size;
                conn.send({ type: '__welcome', payload: { number, count: this.playerCount } });
                this.broadcast(
                    { type: '__peer-joined', payload: { peerId: conn.peer, number, count: this.playerCount } },
                    conn.peer
                );
                this.dispatchEvent(new CustomEvent('peerjoined', { detail: { peerId: conn.peer, number } }));
                this.updateHostBadge();
            });
            conn.on('data', (data) => {
                if (isProtocolType(data?.type)) return;
                this.handleIncoming(data);
                this.broadcast(data, conn.peer);
            });
            conn.on('close', () => {
                const number = this.playerNumbers.get(conn.peer);
                this.playerNumbers.delete(conn.peer);
                this.connections.delete(conn.peer);
                this.playerCount = 1 + this.playerNumbers.size;
                this.broadcast({ type: '__peer-left', payload: { peerId: conn.peer, number, count: this.playerCount } });
                this.dispatchEvent(new CustomEvent('peerleft', { detail: { peerId: conn.peer, number } }));
                this.updateHostBadge();
            });
        });
    }

    setupClientListeners(conn) {
        conn.on('data', (data) => {
            if (data?.type === '__peer-joined') {
                this.playerCount = data.payload.count;
                this.dispatchEvent(new CustomEvent('peerjoined', { detail: data.payload }));
                this.updateHostBadge();
            } else if (data?.type === '__peer-left') {
                this.playerCount = data.payload.count;
                this.dispatchEvent(new CustomEvent('peerleft', { detail: data.payload }));
                this.updateHostBadge();
            } else if (!isProtocolType(data?.type)) {
                this.handleIncoming(data);
            }
        });
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
        if (!this.hostBadge) return;
        const hasNumber = this.playerNumber != null;
        this.hostBadge.hidden = !hasNumber && !this.connectionFailed;
        if (hasNumber) {
            const label = `Player ${this.playerNumber} of ${this.playerCount}`;
            this.hostBadge.textContent = this.isHost ? `${label} · Host` : label;
        } else if (this.connectionFailed) {
            this.hostBadge.textContent = 'Not connected';
        }
    }
}