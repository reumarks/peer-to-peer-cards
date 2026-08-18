export const mouse = {
    x: 0,
    y: 0,
    isDown: false,
    wasPressed: false,
    isPressed: false,
}

export function setupInputManager(){
    window.onmousemove = (e) => {
        e = e || window.event;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
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