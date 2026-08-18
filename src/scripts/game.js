import { createDeck, moveCard } from "./cards.js";
import { mouse, hand, refreshInputStates, setupInputManager } from "./input-manager.js";
import { hideCursor, setupSceneElements, showCursor } from "./scene-elements.js";

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
  if(mouse.y < window.innerHeight/2 - 200 && hand.held.element === null){
    hand.y = (hand.y * 0.95 + (window.innerHeight - 50) * 0.05);
    hand.x = (hand.x * 0.7 + mouse.x * 0.3);
    hand.onMouse = false;
  }else if(mouse.y < window.innerHeight/2) {
    hand.y = (Math.max(hand.y, window.innerHeight/2) * 0.7 + (window.innerHeight / 2) * 0.3);
    hand.x = (hand.x * 0.7 + mouse.x * 0.3);
    hand.onMouse = false;
  }else if(mouse.y > window.innerHeight / 2){
    if(Math.abs(mouse.x - hand.x) < 10 && Math.abs(mouse.y - hand.y) < 10){
      hand.onMouse = true;
      hand.y = mouse.y;
      hand.x = mouse.x;
    }else{
      hand.x = (hand.x * 0.7 + mouse.x * 0.3);
      hand.y = (hand.y * 0.7 + mouse.y * 0.3);
    }
  }

  if(!hand.onMouse){
    if(hand.held.element !== null){
        hand.held.element.style.left = (hand.held.offset.x + hand.x) + "px";
        hand.held.element.style.top = (hand.held.offset.y + hand.y) + "px";
    }
  }

  if (mouse.wasPressed) {
    myArm.src = './resources/cat-arms/orange_closed.svg';
  } else if (mouse.wasReleased) {
    myArm.src = './resources/cat-arms/orange_open.svg';
  }

  myArm.style.left = hand.x + "px";
  myArm.style.top = hand.y + "px";
  
  showCursor(hand.onMouse);
}

function draw(){
  updateCatArm();

  refreshInputStates();
  requestAnimationFrame(draw);
}
