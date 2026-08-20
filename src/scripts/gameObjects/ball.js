import { GameObject } from "../gameObject.js";

export class Ball extends GameObject {
    constructor(spawnX, spawnY) {
        super('ball', 'ball', `./resources/toys/ball.svg`, spawnX, spawnY, 100, 100, true);
    }
}