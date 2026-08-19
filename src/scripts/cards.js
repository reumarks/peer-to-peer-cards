import { gameObject } from "./gameObjects.js";
import { mouse, paw, makeElementDraggable } from "./inputManager.js";
import { boardState, convertToWorldCords } from "./sceneElements.js";

let room = null;
const cardParent = document.getElementById("game-table");

export const cardValues = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
export const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

export function createDeck(currentRoom, x, y){
  room = currentRoom;
  let currentIndex = 0;
  for(let suitIndex = 0; suitIndex < cardSuits.length; suitIndex++){
    for(let valueIndex = 0; valueIndex < cardValues.length; valueIndex++){
      createCard(
        `${cardValues[valueIndex]}-of-${cardSuits[suitIndex]}`, 
        x, 
        y,
      );
      currentIndex++;
    }
  }
}

export function createCard(cardName, x, y){
  //let newCard = new gameObject('card', '')

  let newCard = document.createElement('img');
  newCard.id = cardName;
  newCard.className = 'card';
  newCard.src = `./resources/playing-cards/${cardName}.svg`;
  newCard.alt = cardName;
  newCard.style.left = x + "px";
  newCard.style.top = y + "px";
  newCard.style.zIndex = boardState.topIndex + 1;
  boardState.topIndex ++;
  makeElementDraggable(
    newCard, 
    (elmnt) =>{
      let tiltDirection = Math.random() > 0.5;
      elmnt.classList.add(tiltDirection ? "tilt-right" : "tilt-left");
    },
    (elmnt) => {
      const cardPosition = convertToWorldCords(room.playerNumber, parseInt(elmnt.style.left), parseInt(elmnt.style.top), 0);
      console.log(`Got local position ${parseInt(elmnt.style.left)}, ${parseInt(elmnt.style.top)}, converted it to global position ${cardPosition.x}, ${cardPosition.y}`)
      room.send('move-card-event', { cardName: elmnt.id, x: cardPosition.x, y: cardPosition.y });
      elmnt.classList.remove("tilt-right");
      elmnt.classList.remove("tilt-left");
    }
  );
  cardParent.appendChild(newCard);
}

export function moveCard(cardName, x, y){
  let currentCard = document.getElementById(cardName);
  if(currentCard === null){
    console.log(`No card ${cardName} found.`);
    return;
  }
  
  currentCard.style.left = x + "px";
  currentCard.style.top = y + "px";
  currentCard.style.zIndex = boardState.topIndex + 1;
  boardState.topIndex++;
}
