export const boardState = {
    topIndex: 10,
}

export const hand = {
    items: [],
    bounds: null,
}

export function setupSceneElements(){
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