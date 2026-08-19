const gameObjects = [];
const playerIndex = 0;

let topIndex = 10;

export class gameObject {
    constructor(name, type, imageSrc, spawnX, spawnY, width, height, isDraggable){
        this.name = name;
        this.type = type;
        this.imageSrc = imageSrc;
        this.x = spawnX;
        this.y = spawnY;
        this.zIndex = ++topIndex;
        this.width = width;
        this.height = height;
        this.isDraggable = true;
        this.element = this.createDomElement();
    }

    createDomElement(){
        const element = document.createElement('img');
        element.alt = this.name;
        element.className = 'card';
        element.src = this.imageSrc;
        element.style.left = this.x + "px";
        element.style.top = this.y + "px";
        element.style.width = this.width + "px";
        element.style.height = this.height + "px";
        element.style.zIndex = this.zIndex;
        return element;
    }



    
}