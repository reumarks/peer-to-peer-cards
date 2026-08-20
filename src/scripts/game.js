import { createDeck } from "./cards.js";
import { mouse, refreshInputStates, setupInputManager } from "./inputManager.js";
import { convertToPlayerCords, hand, setupSceneElements, showCursor, paw } from "./sceneElements.js";
import { GameObject } from "./gameObjects.js";

let room = null;

let topIndex = 10;

export async function initGame(currentRoom) {
    room = currentRoom;

    setupSceneElements();
    setupInputManager();


    room.on('action', (e) => {
        const { type, payload, from } = e.detail;
        if (type === 'move-card-event') {
            const { cardName, x, y } = payload;
            moveCardEvent(cardName, x, y);
        }
    });

    createDeck(0, 0);

    const ball = new GameObject(
        "ball",
        'ball',
        `./resources/toys/ball.svg`,
        200,
        200,
        100,
        100,
        true
    );

    draw();
}

function moveCardEvent(cardName, x, y) {
    moveCard(cardName, cardPosition.x, cardPosition.y);
}

function updateCardsInHand() {
    for (let handIndex = 0; handIndex < hand.items.length; handIndex++) {
        if (hand.items[handIndex] === null) {
            continue;
        }
        const cardX = parseFloat(hand.items[handIndex].style.left);
        const cardY = parseFloat(hand.items[handIndex].style.top);
        const cardWidth = 100;
        const aspectRatio = 5 / 7;
        const padding = 20;
        const boundCenterX = (hand.bounds.left + hand.bounds.right) / 2;
        const boundCenterY = (hand.bounds.top + hand.bounds.bottom) / 2;
        const indexedPosition = (boundCenterX - ((cardWidth + padding) * (hand.items.length - 1) + cardWidth) / 2) + (cardWidth + padding) * handIndex;

        hand.items[handIndex].style.left = (cardX * 0.6 + indexedPosition * 0.4) + "px";
        hand.items[handIndex].style.top = (cardY * 0.6 + (boundCenterY - (cardWidth / aspectRatio) / 2) * 0.4) + "px";
    }
}

function updateCatArm() {
    if (!paw.onMouse) {
        if (mouse.y < window.innerHeight / 3 - 200 && paw.held === null) {
            paw.y = (paw.y * 0.95 + (window.innerHeight - 50) * 0.05);
            paw.x = (paw.x * 0.7 + mouse.x * 0.3);
        } else if (mouse.y < window.innerHeight / 3) {
            paw.y = (Math.max(paw.y, window.innerHeight / 3) * 0.7 + (window.innerHeight / 3) * 0.3);
            paw.x = (paw.x * 0.7 + mouse.x * 0.3);
        } else if (mouse.y > window.innerHeight / 3) {
            if (Math.abs(mouse.x - paw.x) < 10 && Math.abs(mouse.y - paw.y) < 10) {
                paw.onMouse = true;
                paw.y = mouse.y;
                paw.x = mouse.x;
            } else {
                paw.x = (paw.x * 0.7 + mouse.x * 0.3);
                paw.y = (paw.y * 0.7 + mouse.y * 0.3);
            }
        }
    }

    if (paw.held !== null) {
        paw.src = './resources/cat-arms/orange_closed.svg';
    } else if (paw.hovering.size > 0) {
        paw.src = './resources/cat-arms/orange_open.svg';
    } else {
        paw.src = './resources/cat-arms/orange_default.svg';
    }

    showCursor(paw.onMouse);
}

function draw() {
    updateCatArm();
    //updateCardsInHand();


    refreshInputStates();
    requestAnimationFrame(draw);
}
