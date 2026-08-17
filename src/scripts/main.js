import { RoomSync } from './room-sync.js';
import { initGame } from './game.js';

const room = new RoomSync();
await room.start();

room.on('hostchange', (e) => {
  // e.detail.isHost tells if this client is now the host
});

room.on('peerjoined', (e) => console.log('peer joined', e.detail.peerId));
room.on('peerleft', (e) => console.log('peer left', e.detail.peerId));

await initGame(room);