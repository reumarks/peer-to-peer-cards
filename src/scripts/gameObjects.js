import { mouse } from "./inputManager.js";
import { gameTable, paw } from "./sceneElements.js";

const gameObjects = [];
const playerIndex = 0;

let topIndex = 10;

export class GameObject {
    constructor(name, type, imageSrc, spawnX, spawnY, width, height, isDraggable){
        this.name = name;
        this.type = type;
        this.imageSrc = imageSrc;
        this.x = spawnX;
        this.y = spawnY;
        this.r = 0;
        this.width = width;
        this.height = height;
        this.isDraggable = isDraggable;
        this.element = this.createDomElement();
    }

    createDomElement(){
        this.element = document.createElement('img');
        this.element.alt = this.name;
        this.element.className = this.type;
        this.element.src = this.imageSrc;
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        this.element.style.transform = `rotate(${this.r}deg)`
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.zIndex = ++topIndex;
        
        if(this.isDraggable){
            this.element.onmousedown = (e) => this.mouseDown(e);
        }
        
        gameTable.element.appendChild(this.element);
        return this.element;
    }

    updateDomPosition(){
        this.element.style.left = this.x - this.width/2 + "px";
        this.element.style.top = this.y - this.height/2 + "px";
        this.element.style.transform = `rotate(${this.r}deg)`
        this.element.style.zIndex = ++topIndex;
    }

    mouseDown(e){
        e = e || window.event;
        e.preventDefault();
    
        if(paw.held !== null) return;
        if(!paw.onMouse) return;

        paw.held = this;

        document.onmouseup = (e) => this.mouseUp(e);
    }

    mouseUp(e) {    
        gameTable.add(this)
        paw.held = null;
        document.onmouseup = null;
    }
}