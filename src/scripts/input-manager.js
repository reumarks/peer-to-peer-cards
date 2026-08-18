import { boardState } from "./scene-elements.js";

export const mouse = {
    x: 0,
    y: 0,
    isDown: false,
    wasPressed: false,
    isPressed: false,
};

export const paw = {
    x: -200,
    y: 4000,
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
    mouse.x = window.event.clientX;
    mouse.y = window.event.clientY;
    window.onmousemove = (e) => {
        e = e || window.event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if(paw.onMouse){
            paw.x = mouse.x;
            paw.y = mouse.y;
            if(paw.held.element !== null){
                paw.held.element.style.left = (paw.held.offset.x + paw.x) + "px";
                paw.held.element.style.top = (paw.held.offset.y + paw.y) + "px";
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

    if(paw.held.element !== null){
      return;
    }

    if(!paw.onMouse){
      return;
    }

    paw.held.element = elmnt;
    paw.held.offset = {
      x: elmnt.offsetLeft - paw.x,
      y: elmnt.offsetTop - paw.y,
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

    paw.held.element = null;
    document.onmouseup = null;
  }
}