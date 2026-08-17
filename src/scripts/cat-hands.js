
export function setupCatHand(){
    const myArm = document.getElementById('my-arm');
    let mouseX;
    let mouseY;
    console.log("setup cat")
    window.onmousemove = (e) => {
        e = e || window.event;
        console.log("moveee")
        document.getElementById('my-arm').style.top = e.clientY + "px";
        document.getElementById('my-arm').style.left = e.clientX + "px";
    }
    window.onmousedown = (e) => {
        e = e || window.event;
        myArm.src = './resources/cat-arms/orange_closed.svg';
    }
    window.onmouseup = (e) => {
        e = e || window.event;
        myArm.src = './resources/cat-arms/orange_open.svg';
    }
}