import { GameObject } from "../gameObject.js";

export class Card extends GameObject {
    constructor(cardName, spawnX, spawnY) {
        super(cardName, 'card', `./resources/playing-cards/${cardName}.svg`, spawnX, spawnY, 100, 100 * 7 / 5, true);
    }
}