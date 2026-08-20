import { paw, hand } from "./sceneElements.js";

export const mouse = {
    x: 0,
    y: 0,
    isDown: false,
    wasPressed: false,
    isPressed: false,
};

export function setupInputManager(){
    //mouse.x = window.event.clientX;
    //mouse.y = window.event.clientY;
    window.onmousemove = (e) => {
        e = e || window.event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if(paw.onMouse){
            if(mouse.y < window.innerHeight/3 - 200 && paw.held === null || mouse.y < window.innerHeight/3) {
                paw.onMouse = false;
            }else{
                paw.x = mouse.x;
                paw.y = mouse.y;
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