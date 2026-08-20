import { GameObject } from "./gameObjects.js";
import { mouse } from "./inputManager.js";
import { paw, convertToWorldCords } from "./sceneElements.js";

export const cardValues = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
export const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

class Deck extends GameObject {
    constructor(spawnX, spawnY) {
        super('deck', 'card', `./resources/playing-cards/back.svg`, spawnX, spawnY, 100, 100 * 7 / 5, true);
        
        this.queue = [];
        
        for(let valueIndex = 0; valueIndex < cardValues.length; valueIndex++){
            for(let suitIndex = 0; suitIndex < cardSuits.length; suitIndex++){
                this.queue.push(`${cardValues[valueIndex]}-of-${cardSuits[suitIndex]}`);
            }
        }
    }

    mouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        
        if (paw.held !== null) return;
        if (!paw.onMouse) return;
        if(this.queue.length === 0) return;

        const newCard = createCard(this.queue.pop(), this.x, this.y)
        paw.pickUp(newCard);

        document.onmouseup = (e) => newCard.mouseUp(e);
    }
}

export function createDeck(x, y) {
    return new Deck(
        x,
        y,
    );
}

export function createCard(cardName, x, y) {
    return new GameObject(
        cardName,
        'card',
        `./resources/playing-cards/${cardName}.svg`,
        x,
        y,
        100,
        100 * 7 / 5,
        true
    );
}