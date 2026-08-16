
export const mouse = {
  x: 0,
  y: 0,
  isDown: false,
  wasPressed: false,
  wasReleased: false,
};

export const setupCallbacks = (clientContext) => {
  clientContext.canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  });

  clientContext.canvas.addEventListener('mousedown', (e) => {
    mouse.isDown = true;
    mouse.wasPressed = true;
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  });

  clientContext.canvas.addEventListener('mouseup', () => {
    mouse.isDown = false;
    mouse.wasReleased = true;
  });
};

export const resetInputStates = () => {
  mouse.wasPressed = false;
  mouse.wasReleased = false;
}