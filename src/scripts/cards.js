let room = null;
const cardParent = document.body;

let topIndex = 10;

export const cardValues = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
export const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

export function createDeck(currentRoom, x, y){
  room = currentRoom;
  let currentIndex = 0;
  for(let suitIndex = 0; suitIndex < cardSuits.length; suitIndex++){
    for(let valueIndex = 0; valueIndex < cardValues.length; valueIndex++){
      createCard(
        `${cardValues[valueIndex]}-of-${cardSuits[suitIndex]}`, 
        x + currentIndex * 15, 
        y
      );
      currentIndex++;
    }
  }
}

export function createCard(cardName, x, y){
  if(document.getElementById(cardName)){
    return;
  }
  let newCard = document.createElement('img');
  newCard.id = cardName;
  newCard.className = 'card';
  newCard.src = `./resources/playing-cards/${cardName}.svg`;
  newCard.alt = cardName;
  newCard.style.left = x + "px";
  newCard.style.top = y + "px";
  newCard.style.zIndex = topIndex + 1;
  topIndex ++;
  makeElementDraggable(newCard);
  cardParent.appendChild(newCard);
}

export function moveCard(cardName, x, y){
  let currentCard = document.getElementById(cardName);
  if(currentCard === null){
    console.log(`No card ${cardName} found.`);
    return;
  }
  
  currentCard.style.left = x;
  currentCard.style.top = y;
  currentCard.style.zIndex = topIndex + 1;
  topIndex++;
}

function makeElementDraggable(elmnt) {
  let pPosX = 0, pPosY = 0, posX = 0, posY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pPosX = e.clientX;
    pPosY = e.clientY;

    // Move card to top
    elmnt.style.zIndex = topIndex + 1;
    topIndex++;

    let tiltDirection = Math.random() > 0.5;
    elmnt.classList.add(tiltDirection ? "tilt-right" : "tilt-left");
        
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    posX = pPosX - e.clientX;
    posY = pPosY - e.clientY;
    pPosX = e.clientX;
    pPosY = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - posY) + "px";
    elmnt.style.left = (elmnt.offsetLeft - posX) + "px";
    room.send('move-card-event', { cardName: elmnt.id, x: elmnt.style.left, y: elmnt.style.top });
  }

  function closeDragElement() {
    elmnt.classList.remove("tilt-right");
    elmnt.classList.remove("tilt-left");
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
