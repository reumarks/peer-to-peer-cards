import { GameObject } from "../gameObject.js";
import { paw } from "../sceneElements.js";
import { Card } from "./card.js";

export const cardValues = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
export const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

export class Deck extends GameObject {
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

        const newCard = new Card(this.queue.pop(), this.x, this.y);
        paw.pickUp(newCard);

        document.onmouseup = (e) => newCard.mouseUp(e);
    }
}