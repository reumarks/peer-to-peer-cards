import { createDeck, moveCard } from "./cards.js";
import { mouse, refreshInputStates, setupInputManager } from "./input-manager.js";

let room = null;

let topIndex = 10;

const myArm = document.getElementById('my-arm');


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
  setupInputManager();
  draw();
}

function moveCardEvent(cardName, x, y){
  moveCard(cardName, x, y);
}

function updateCatArm(){
  if (mouse.wasPressed) {
    myArm.src = './resources/cat-arms/orange_closed.svg';
  } else if (mouse.wasReleased) {
    myArm.src = './resources/cat-arms/orange_open.svg';
  }

  myArm.style.left = mouse.x + "px";
  myArm.style.top = mouse.y + "px";
}

function draw(){
  updateCatArm();

  refreshInputStates();
  requestAnimationFrame(draw);
}
