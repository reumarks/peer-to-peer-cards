import { boardState } from "./scene-elements.js";

export const mouse = {
    x: 0,
    y: 0,
    isDown: false,
    wasPressed: false,
    isPressed: false,
};

export const hand = {
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    onMouse: false,
    held: {
        element: null,
        offset: {
            x: 0,
            y: 0,
        }
    }
};

export function setupInputManager(){
    window.onmousemove = (e) => {
        e = e || window.event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if(hand.onMouse){
            hand.x = mouse.x;
            hand.y = mouse.y;
            if(hand.held.element !== null){
                hand.held.element.style.left = (hand.held.offset.x + hand.x) + "px";
                hand.held.element.style.top = (hand.held.offset.y + hand.y) + "px";
            }
        }
    }
    window.onmousedown = (e) => {
        e = e || window.event;
        mouse.isDown = true;
        mouse.wasPressed = true;
    }
    window.onmouseup = (e) => {
        e = e || window.event;
        mouse.wasReleased = true;
    }
}

export function refreshInputStates(){
    mouse.wasPressed = false;
    mouse.wasReleased = false;
}

export function makeElementDraggable(elmnt, onDown, onUp) {
  let pPosX = 0, pPosY = 0, posX = 0, posY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    if(hand.held.element !== null){
      return;
    }

    if(!hand.onMouse){
      return;
    }

    hand.held.element = elmnt;
    hand.held.offset = {
      x: elmnt.offsetLeft - hand.x,
      y: elmnt.offsetTop - hand.y,
    }
      
    elmnt.style.zIndex = boardState.topIndex + 1;
    boardState.topIndex++;

    // Run callback method
    if(onDown !== null){
      onDown(elmnt); 
    }

    document.onmouseup = closeDragElement;
  }
  
  function closeDragElement() {
    // Run callback method
    if(onUp !== null){
      onUp(elmnt); 
    }

    hand.held.element = null;
    document.onmouseup = null;
  }
}