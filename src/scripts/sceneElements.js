export const paw = {
    element: null,
    imageElement: null,
    onMouse: false,
    
    _x: -200,
    set x(newValue){
        this.element.style.left = this._x + "px";
        this._x = newValue;
    },
    get x(){
        return this._x;
    },
    
    _y: 4000,
    set y(newValue){
        this.element.style.top = this._y + "px";
        this._y = newValue;
    },
    get y(){
        return this._y;
    },
    
    _held: null,
    set held (gameObject) {
        if(gameObject === null){
            this._held = null;
            return;
        }

        let gameObjectAbsolutePos = gameObject.element.getBoundingClientRect();

        gameObject.x = gameObjectAbsolutePos.left + gameObjectAbsolutePos.width/2 - this.x;
        gameObject.y = gameObjectAbsolutePos.top + gameObjectAbsolutePos.height/2 - this.y;
        gameObject.r = gameObject.r + ((Math.random() > 0.5) ? -5 : 5);
        gameObject.updateDomPosition();

        this.element.appendChild(gameObject.element);
        this._held = gameObject;
    },
    get held () {
        return this._held;
    },

    set src(newSrc){
        this.imageElement.src = newSrc;
    }
};

export const gameTable = {
    element: null,
    add(gameObject){
        if(gameObject === null) return;

        let gameObjectAbsolutePos = gameObject.element.getBoundingClientRect();
        let gameTableAbsolutePos = this.element.getBoundingClientRect();
        gameObject.x = gameObjectAbsolutePos.left + gameObjectAbsolutePos.width/2 - gameTableAbsolutePos.left;
        gameObject.y = gameObjectAbsolutePos.top + gameObjectAbsolutePos.height/2 - gameTableAbsolutePos.top;
        gameObject.r = 0;
        gameObject.updateDomPosition()

        this.element.appendChild(gameObject.element);
    },
    setup(){
        this.element = document.getElementById('game-table');
    }
};

export const hand = {
    items: [],
    bounds: null,
}

export function setupSceneElements(){
    paw.element = document.getElementById('my-arm-wrapper');
    paw.imageElement = document.getElementById('my-arm');
    gameTable.element = document.getElementById('game-table');
    hand.bounds = {
        top: window.innerHeight - 180,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
    }
}

export function showCursor(show){
    if(show){
        document.body.classList.add('no-cursor');
    }else if(!show){
        document.body.classList.remove('no-cursor');
    }
}

export function convertToWorldCords(playerNumber, x, y, r){
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    switch(playerNumber){
        case 1:
            return {x: x - centerX, y: y - centerY, r: r};
        case 2:
            return {x: -(x - centerX), y: -(y - centerY), r: r};
        case 3: 
            return {x: x - centerX, y: y - centerY, r: r};
        case 4:
            return {x: x - centerX, y: y - centerY, r: r};
        default:
            return {x: x - centerX, y: y - centerY, r: r};
    }
}

export function convertToPlayerCords(playerNumber, x, y, r){
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    switch(playerNumber){
        case 1:
            return {x: x + centerX, y: y + centerY, r: r};
        case 2:
            return {x: -(x - centerX), y: -(y - centerY), r: r};
        case 3: 
            return {x: x - centerX, y: y - centerY, r: r};
        case 4:
            return {x: x - centerX, y: y - centerY, r: r};
        default:
            return {x: x - centerX, y: y - centerY, r: r};
    }
}