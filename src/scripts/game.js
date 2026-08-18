import { createDeck, moveCard } from "./cards.js";
import { mouse, paw, refreshInputStates, setupInputManager } from "./input-manager.js";
import { setupSceneElements, showCursor } from "./scene-elements.js";

let room = null;

let topIndex = 10;

const myArm = document.getElementById('my-arm');

export async function initGame(currentRoom){
  room = currentRoom;

  setupSceneElements();
  setupInputManager();


  room.on('action', (e) => {
    const { type, payload, from } = e.detail;
    if (type === 'move-card-event') {
      const {cardName, x, y} = payload;
      moveCardEvent(cardName, x, y);
    }
  });

  createDeck(room, 20, window.innerHeight * 3/5, 10);
  draw();
}

function moveCardEvent(cardName, x, y){
  moveCard(cardName, x, y);
}

function updateCatArm(){
  if(mouse.y < window.innerHeight/2 - 200 && paw.held.element === null){
    paw.y = (paw.y * 0.95 + (window.innerHeight - 50) * 0.05);
    paw.x = (paw.x * 0.7 + mouse.x * 0.3);
    paw.onMouse = false;
  }else if(mouse.y < window.innerHeight/2) {
    paw.y = (Math.max(paw.y, window.innerHeight/2) * 0.7 + (window.innerHeight / 2) * 0.3);
    paw.x = (paw.x * 0.7 + mouse.x * 0.3);
    paw.onMouse = false;
  }else if(mouse.y > window.innerHeight / 2){
    if(Math.abs(mouse.x - paw.x) < 10 && Math.abs(mouse.y - paw.y) < 10){
      paw.onMouse = true;
      paw.y = mouse.y;
      paw.x = mouse.x;
    }else{
      paw.x = (paw.x * 0.7 + mouse.x * 0.3);
      paw.y = (paw.y * 0.7 + mouse.y * 0.3);
    }
  }

  if(!paw.onMouse){
    if(paw.held.element !== null){
        paw.held.element.style.left = (paw.held.offset.x + paw.x) + "px";
        paw.held.element.style.top = (paw.held.offset.y + paw.y) + "px";
    }
  }

  if (mouse.wasPressed) {
    myArm.src = './resources/cat-arms/orange_closed.svg';
  } else if (mouse.wasReleased) {
    myArm.src = './resources/cat-arms/orange_open.svg';
  }

  myArm.style.left = paw.x + "px";
  myArm.style.top = paw.y + "px";
  
  showCursor(paw.onMouse);
}

function draw(){
  updateCatArm();

  refreshInputStates();
  requestAnimationFrame(draw);
}
