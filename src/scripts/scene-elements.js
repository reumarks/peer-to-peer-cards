export const boardState = {
    topIndex: 10,
}

export function setupSceneElements(){

}

export function hideCursor(){
}

export function showCursor(show){
    if(show){
        document.body.classList.add('no-cursor');
    }else if(!show){
        document.body.classList.remove('no-cursor');
    }
}