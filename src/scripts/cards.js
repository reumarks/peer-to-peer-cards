import { GameObject } from "./gameObjects.js";
import { mouse } from "./inputManager.js";
import { paw, convertToWorldCords } from "./sceneElements.js";

let room = null;

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
  let newCard = new GameObject(
    cardName,
    'card',
    `./resources/playing-cards/${cardName}.svg`,
    x,
    y,
    100,
    100 * 7/5,
    true
  );
}