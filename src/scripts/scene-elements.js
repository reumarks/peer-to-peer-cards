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