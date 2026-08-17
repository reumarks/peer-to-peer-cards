const gameBoard = document.getElementById('game-container');
const debugText = document.getElementById('debug-text')
let room = null;

let topIndex = 10;

//window.addEventListener('resize', resizeCanvas);

export async function initGame(currentRoom){
  room = currentRoom;

  room.on('action', (e) => {
    const { type, payload, from } = e.detail;
    //if (type === 'mouse-click-event') makeDot(payload);
  });

  // Register all cards as draggable elements
  let cards = document.getElementsByClassName("card");
  for(let cardIndex = 0; cardIndex < cards.length; cardIndex++){
    dragElement(cards[cardIndex]);
  }

  draw();
}

// drag element loosely based on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
function dragElement(elmnt) {
  var pPosX = 0, pPosY = 0, posX = 0, posY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pPosX = e.clientX;
    pPosY = e.clientY;

    // Move card to top
    elmnt.style.zIndex = topIndex + 1;
    topIndex++;
    
    // Setup stop drag function
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    posX = pPosX - e.clientX;
    posY = pPosY - e.clientY;
    pPosX = e.clientX;
    pPosY = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - posY) + "px";
    elmnt.style.left = (elmnt.offsetLeft - posX) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function draw(){

  requestAnimationFrame(draw);
}
