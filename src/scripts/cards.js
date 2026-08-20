import { GameObject } from "./gameObjects.js";
import { mouse } from "./inputManager.js";
import { paw, convertToWorldCords } from "./sceneElements.js";

export const cardValues = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
export const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

class Deck extends GameObject() {
    mouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        if (paw.held !== null) return;
        if (!paw.onMouse) return;

        paw.held = this;

        document.onmouseup = (e) => this.mouseUp(e);
    }
}

export function createDeck(x, y) {
    return new GameObject(
        'deck',
        'card',
        `./resources/playing-cards/back.svg`,
        x,
        y,
        100,
        100 * 7 / 5,
        false,
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