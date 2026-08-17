import { createDeck, moveCard } from "./cards.js";

let room = null;

let topIndex = 10;

export async function initGame(currentRoom){
  room = currentRoom;

  room.on('action', (e) => {
    const { type, payload, from } = e.detail;
    if (type === 'move-card-event') {
      const {cardName, x, y} = payload;
      moveCardEvent(cardName, x, y);
    }
  });

  createDeck(room, 20, 20, 10);

  draw();
}

function moveCardEvent(cardName, x, y){
  moveCard(cardName, x, y);
}

function draw(){

  requestAnimationFrame(draw);
}
