/*const gameLogic = (() => {
    const createGameBoard = () => {
        gameBoard = {
            boardPiecesObject: boardPieces = () => {
                let boardPiecesArray = ['topLeft', 'topMid', 'topRight', 'midLeft', 'midMid', 'midRight', 'botLeft', 'botMid', 'botRight'];
                return boardPiecesArray;
            },
        }
        return gameBoard;
    }
    const log = (toLog) => {
        return console.log(toLog);
    }
    return {
        createGameBoard,
        log,
    }
})();*/
const getNames = () => {
    const player1Form = document.getElementById('player1Name');
    const player2Form = document.getElementById('player2Name');
    const player1Name = player1Form.value;
    const player2Name = player2Form.value;

    return {
        player1Name,
        player2Name,
    }
}
console.log(getNames());
console.log(getNames.player2Name);
const startButton = (() => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', loadGameScreen.bind(this, startButton));
    
    
    
})();

function loadGameScreen (startButton) {
    console.log(getNames().player1Name + getNames().player2Name);
    if (getNames.player1Name === '' || getNames.player2Name === '') {
        console.log('missing names');
    } else {
        startButton.remove();
    } 
}


const swapWeapon = (() => {
    const weapons = document.getElementsByClassName('weapon');
    for(weapon of weapons){
        weapon.addEventListener('click', clickChange);
    }
    function clickChange () {
        const weaponO = document.getElementById('weaponO');
        const weaponX = document.getElementById('weaponX');
        const x = 'X';
        const o = 'O';
        weaponO.textContent = x;
        weaponX.textContent = o;
        weaponO.id = 'weaponX'
        weaponX.id = 'weaponO'
    }
    return {
        clickChange
    }
    

})();



const gameBoard = (() => {
        const _boardPartsArray = ['topLeft', 'topMid', 'topRight', 'midLeft', 'midMid', 'midRight', 'botLeft', 'botMid', 'botRight']
        const board = {
            boardParts: _boardPartsArray,
        }
        console.log('hello');
        return {
            board,
        };
        
})();

console.log(gameBoard.board);
const newPlayer = (name) => {

}

