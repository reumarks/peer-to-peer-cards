import { setupCallbacks, mouse, resetInputStates } from './inputManager.js'

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let room = null;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

export function initGame(currentRoom){
  resizeCanvas();
  setupCallbacks({canvas: canvas});

  room = currentRoom;

  room.on('action', (e) => {
    const { type, payload, from } = e.detail;
    if (type === 'mouse-click-event') makeDot(payload);
  });

  draw();
}

let dots = [];

function makeDot(dotPos){
  dots.push(dotPos);
}

function draw(){
  ctx.fillStyle = '#0e1013';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#eceef1';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  
  if(mouse.wasReleased){
    room.send('mouse-click-event', { x: mouse.x, y: mouse.y });
  }
  
  ctx.fillStyle = '#ff0000'
  ctx.beginPath();
  ctx.ellipse(mouse.x, mouse.y, 50, 50, Math.PI / 4, 0, 2 * Math.PI);
  ctx.fill();

  for(let i = 0; i < dots.length; i++){
    ctx.fillStyle = '#ff0000'
    ctx.beginPath();
    ctx.ellipse(dots[i].x, dots[i].y, 20, 20, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
  }

  resetInputStates();
  requestAnimationFrame(draw);
}
