import { createDeck, moveCard } from "./cards.js";
import { mouse, paw, refreshInputStates, setupInputManager } from "./inputManager.js";
import { convertToPlayerCords, hand, setupSceneElements, showCursor } from "./sceneElements.js";

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

  createDeck(room, 0, 0);
  draw();
}

function moveCardEvent(cardName, x, y){
  const cardPosition = convertToPlayerCords(room.playerNumber, parseInt(x), parseInt(y), 0);
  console.log(`Got global position ${parseInt(x)}, ${parseInt(y)}, converted it to local ${cardPosition.x}, ${cardPosition.y}`)
  moveCard(cardName, cardPosition.x, cardPosition.y);
}

function updateCardsInHand(){
  for(let handIndex = 0; handIndex < hand.items.length; handIndex++){
    if(hand.items[handIndex] === null){
      continue;
    }
    const cardX = parseFloat(hand.items[handIndex].style.left);
    const cardY = parseFloat(hand.items[handIndex].style.top);
    const cardWidth = 100;
    const aspectRatio = 5/7;
    const padding = 20;
    const boundCenterX = (hand.bounds.left + hand.bounds.right) / 2;
    const boundCenterY = (hand.bounds.top + hand.bounds.bottom) / 2;
    const indexedPosition = (boundCenterX - ((cardWidth + padding) * (hand.items.length - 1) + cardWidth)/2) + (cardWidth + padding) * handIndex;

    hand.items[handIndex].style.left = (cardX * 0.6 + indexedPosition * 0.4) + "px";
    hand.items[handIndex].style.top = (cardY * 0.6 + (boundCenterY - (cardWidth / aspectRatio) / 2) * 0.4) + "px";
  }
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

  if(!paw.onMouse && paw.held.element !== null){
    paw.held.x = paw.held.offset.x + paw.x;
    paw.held.y = paw.held.offset.y + paw.y;
    paw.held.element.style.left = paw.held.x + "px";
    paw.held.element.style.top = paw.held.y + "px";
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
  updateCardsInHand();


  refreshInputStates();
  requestAnimationFrame(draw);
}
