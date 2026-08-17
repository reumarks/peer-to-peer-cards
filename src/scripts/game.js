import { createDeck } from "./cards.js";

let room = null;

let topIndex = 10;

export async function initGame(currentRoom){
  room = currentRoom;

  room.on('action', (e) => {
    const { type, payload, from } = e.detail;
    //if (type === 'mouse-click-event') makeDot(payload);
  });

  createDeck(20, 20, 10);

  draw();
}

function draw(){

  requestAnimationFrame(draw);
}
