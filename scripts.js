const getNames = () => {
    const _player1Form = document.getElementById('player1Name');
    const _player2Form = document.getElementById('player2Name');
    const player1Name = _player1Form.value;
    const player2Name = _player2Form.value;
    
    return {
        player1Name,
        player2Name,
    }
}

const getWeapons = () => {
    const player1Weapon = document.getElementById('player1Weapon').nextElementSibling.textContent;
    const player2Weapon = document.getElementById('player2Weapon').nextElementSibling.textContent;
    return {
        player1Weapon,
        player2Weapon,
    }
}

const getPlayers = () => {
    const playerInformation = (() => {
        let player1Name = getNames().player1Name;
        let player2Name = getNames().player2Name;
        let player1Weapon = getWeapons().player1Weapon;
        let player2Weapon = getWeapons().player2Weapon;
        if (player1Name === '' || player2Name === '') {
            if (player1Name === '') {
                player1Name = 'Player 1';
            }
            
            if (player2Name === '') {
                player2Name = 'Player 2';
            }
        }
        return {
            player1Name,
            player2Name,
            player1Weapon,
            player2Weapon,
            }
    })();
        
    
    
    const players = (() => [
        {
            name: playerInformation.player1Name,
            weapon: playerInformation.player1Weapon, 
        },
        {
            name: playerInformation.player2Name,
            weapon: playerInformation.player2Weapon, 
        }
    ])();
    
    return {
        playerInformation,
        players,
    }
}

const startButton = (() => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', loadGameScreen.bind(this, startButton));
    
})();

const gameBoard = (() => {
    const _boardPartsArray = ['topLeft', 'topMid', 'topRight', 'midLeft', 'midMid', 'midRight', 'botLeft', 'botMid', 'botRight']
    const board = {
        boardParts: _boardPartsArray,
    }
    let logicBoard = {};
    board.boardParts.forEach((square) => {
        logicBoard[square] = '';
    })
    
    const buildBoard = (player1Name, player2Name, player1Weapon, player2Weapon, players, currentIndex) => {
        board.boardParts.forEach((square) => {
            const boardSquare = document.createElement('div');
            boardSquare.id = square;
            boardSquare.classList.add('boardSquare');
            const squareName = boardSquare.id;
            
            const mouseHoverSquare = (player1Weapon, player2Weapon) => {
                letterSquare = document.getElementById(`${boardSquare.id}`);
                const weaponHoverText = document.createElement('h2');
                weaponHoverText.id = `wHT${boardSquare.id}`;
                weaponHoverText.classList.add('weaponHoverText');
                const displayMoveText = document.getElementById(`dMT${boardSquare.id}`);
                if (displayMoveText == null) {
                    weaponHoverText.textContent = players[currentIndex].weapon;
                    letterSquare.appendChild(weaponHoverText);
                }
                
                return {
                    weaponHoverText,
                }
            }
            boardSquare.addEventListener('mouseenter', mouseHoverSquare.bind(player1Weapon, player2Weapon, squareName));

            const mouseLeaveSquare = () => {
                let weaponHoverText = document.getElementById(`wHT${boardSquare.id}`)
                if (weaponHoverText) {
                    weaponHoverText.remove();
                }
            }
            boardSquare.addEventListener('mouseleave', mouseLeaveSquare);

            const displayMove = () => {
                letterSquare = document.getElementById(`${boardSquare.id}`);
                const displayMoveText = document.createElement('h2');
                displayMoveText.id = (`dMT${boardSquare.id}`);
                displayMoveText.classList.add('displayMoveText');
                displayMoveText.textContent = players[currentIndex].weapon;
                
                if (!letterSquare.classList.contains('containsMove')) {
                    letterSquare.classList.add('containsMove');
                    letterSquare.appendChild(displayMoveText);
                    mouseLeaveSquare();
                    if (currentIndex === 1) {
                        currentIndex = 0;
                    } else if (currentIndex === 0) {
                        currentIndex = 1;
                    }
                }
                console.log(players, currentIndex);
                
                gameLogic(players, currentIndex, squareName);
                return {
                    displayMoveText,
                }
            }
            boardSquare.addEventListener('click', displayMove);
            
            
            
            const gameHolder = document.getElementById('gameHolder');
            gameHolder.appendChild(boardSquare);
        })     
    }


    return {
        board,
        buildBoard,
        logicBoard,
    };
    
})();

function loadGameScreen (startButton) {
    
    const beginGame = (player1Name, player2Name, player1Weapon, player2Weapon) => {
        const playerNameForm = document.getElementById('playerNameForm');
        
        const addVersusText = (() => {
            const container = document.getElementById('container');
            const buttonHolder = document.getElementById('buttonHolder');
            const versusText = document.createElement('div');
            versusText.id = ('versusText');
            versusText.innerHTML = `<h1 id='versusText'><p id='player1Name'>${player1Name}<p><p id='vs'>vs.<p><p id='player2Name'>${player2Name}</p>`;
            container.insertAdjacentElement('afterbegin', versusText);
    
        })();
        const players = getPlayers().players;
        const chooseStartingPlayer = (()  => {
            let currentIndex = Math.round(Math.random());
            let currentPlayer = players[currentIndex];
            
            return {
                currentIndex,
                currentPlayer,
            }
        })(player1Name, player2Name);

        const currentPlayer = chooseStartingPlayer.currentPlayer;
        const currentIndex = chooseStartingPlayer.currentIndex;
        const firstPlayerText = document.createElement('h2');
        firstPlayerText.id = 'firstPlayerText';
        firstPlayerText.textContent = `${chooseStartingPlayer.currentPlayer.name} goes first!`
        const versusText = document.getElementById('versusText');
        versusText.insertAdjacentElement('afterend', firstPlayerText);

        startButton.remove();
        playerNameForm.remove();
        gameBoard.buildBoard(player1Name, player2Name, player1Weapon, player2Weapon, players, currentIndex);
        
    }

    beginGame(getPlayers().players[0].name, getPlayers().players[1].name, getPlayers().players[0].weapon, getPlayers().players[1].weapon);
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

const gameLogic = (players, currentIndex, square) => {
    logicBoard = gameBoard.logicBoard;
    if (currentIndex === 1) {
        currentIndex = 0;
    } else if (currentIndex === 0) {
        currentIndex = 1;
    }
    let currentWeapon = players[currentIndex].weapon;
    console.log(square);
    console.log(currentWeapon);
    logicBoard[square] = currentWeapon;
    console.log(logicBoard);
    if (square === 'topLeft') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.topRight === currentWeapon){
            console.log('topLeft 1,2,3');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeTopHorizontalWinLine();
        } else if (logicBoard.midLeft === currentWeapon
        && logicBoard.botLeft === currentWeapon){
            console.log('topLeft 1,4,7');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeLeftWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.botRight === currentWeapon) {
            console.log('topLeft 1,5,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeLeftAngledWinLine();
        }
    } else if (square === 'topMid') {
        if (logicBoard.topLeft === currentWeapon 
        && logicBoard.topRight === currentWeapon){
            console.log('topMid 1,2,3');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeTopHorizontalWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.botMid === currentWeapon){
            console.log('topMid 2,5,8');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeWinLine();
        }
    } else if (square === 'topRight') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.topLeft === currentWeapon){
            console.log('topRight 1,2,3');
            console.log(players[currentIndex].name + ' wins'); 
            winLines.makeTopHorizontalWinLine();
        } else if (logicBoard.midRight === currentWeapon
        && logicBoard.botRight === currentWeapon){
            console.log('topRight 3,6,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeRightWinLine();
        } else if (logicBoard.midMid === currentWeapon 
        && logicBoard.botLeft === currentWeapon) {
            console.log('topRight 3,5,7');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeRightAngledWinLine();
        }
    } else if (square === 'midLeft') {
        if (logicBoard.topLeft === currentWeapon 
        && logicBoard.botLeft === currentWeapon){
            console.log('midLeft 1,4,7');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeLeftWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.midRight === currentWeapon){
            console.log('midLeft 4,5,6');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeHorizontalWinLine();
        }
    } else if (square === 'midMid') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.botMid === currentWeapon){
            console.log('midMid 2,5,8');
            console.log(players[currentIndex].name + ' wins'); 
            winLines.makeWinLine();
        } else if (logicBoard.midLeft === currentWeapon
        && logicBoard.midRight === currentWeapon){
            console.log('midMid 4,5,6');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeHorizontalWinLine(); 
        } else if (logicBoard.topLeft === currentWeapon
        && logicBoard.botRight === currentWeapon){
            console.log('midMid 1,5,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeLeftAngledWinLine(); 
        } else if (logicBoard.botLeft === currentWeapon
        && logicBoard.topRight === currentWeapon){
            console.log('midMid 3,5,7');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeRightAngledWinLine(); 
        } 
    }  else if (square === 'midRight') {
        if (logicBoard.topRight === currentWeapon 
        && logicBoard.botRight === currentWeapon){
            console.log('3,6,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeRightWinLine();
        } else if (logicBoard.midLeft === currentWeapon
        && logicBoard.midMid === currentWeapon){
            console.log('4,5,6');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeHorizontalWinLine(); 
        }
    } else if (square === 'botLeft') {
        if (logicBoard.topLeft === currentWeapon 
        && logicBoard.midLeft === currentWeapon){
            console.log('botLeft 1,4,7');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeLeftWinLine();
        } else if (logicBoard.botMid === currentWeapon
        && logicBoard.botRight === currentWeapon){
            console.log('botLeft 7,8,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeBottomHorizontalWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.topRight === currentWeapon) {
            console.log('botLeft 3,5,7');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeRightAngledWinLine();
        }
    } else if (square === 'botMid') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.midMid === currentWeapon){
            console.log('botMid 2,5,8');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeWinLine();
        } else if (logicBoard.botLeft === currentWeapon
        && logicBoard.botRight === currentWeapon){
            console.log('botMid 7,8,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeBottomHorizontalWinLine();
        }
    } else if (square === 'botRight') {
        if (logicBoard.midRight === currentWeapon 
        && logicBoard.topRight === currentWeapon){
            console.log('botRight 3,6,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeRightWinLine();
        } else if (logicBoard.botMid === currentWeapon
        && logicBoard.botLeft === currentWeapon){
            console.log('botRight 7,8,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeBottomHorizontalWinLine(); 
        } else if (logicBoard.midMid === currentWeapon 
        && logicBoard.topLeft === currentWeapon) {
            console.log('botRight 1,5,9');
            console.log(players[currentIndex].name + ' wins');
            winLines.makeLeftAngledWinLine();
        }
    }
}

const winLines = (() => {
    const makeWinLine = () => {
        winLine = document.createElement('div');
        winLine.id = 'winLine'
        winLine.classList.add('winLine');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(winLine);
    }
    const makeLeftWinLine = () => {
        winLine = document.createElement('div');
        winLine.id = 'winLine'
        winLine.classList.add('winLine', 'leftWL');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(winLine);
    }
    const makeRightWinLine = () => {
        winLine = document.createElement('div');
        winLine.id = 'winLine'
        winLine.classList.add('winLine', 'rightWL');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(winLine);
    }
    const makeHorizontalWinLine = () => {
        horizontalWinLine = document.createElement('div');
        horizontalWinLine.id = 'horizontalWinLine'
        horizontalWinLine.classList.add('winLine', 'horizontalWinLine');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(horizontalWinLine);
    }
    const makeTopHorizontalWinLine= () => {
        topHorizontalWinLine = document.createElement('div');
        topHorizontalWinLine.id = 'topHorizontalWinLine'
        topHorizontalWinLine.classList.add('winLine', 'horizontalWinLine', 'topHWL');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(topHorizontalWinLine);
    }
    const makeBottomHorizontalWinLine = () => {
        bottomHorizontalWinLine = document.createElement('div');
        bottomHorizontalWinLine.id = 'bottomHorizontalWinLine'
        bottomHorizontalWinLine.classList.add('winLine', 'horizontalWinLine', 'bottomHWL');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(bottomHorizontalWinLine);
    }
    const makeRightAngledWinLine = () => {
        rightAngledWinLine = document.createElement('div');
        rightAngledWinLine.id = 'rightAngledWinLine'
        rightAngledWinLine.classList.add('winLine', 'rightAngledWL');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(rightAngledWinLine);
    }
    const makeLeftAngledWinLine = () => {
        leftAngledWinLine = document.createElement('div');
        leftAngledWinLine.id = 'leftAngledWinLine'
        leftAngledWinLine.classList.add('winLine', 'leftAngledWL');
        const gameHolder = document.getElementById('gameHolder');
        gameHolder.appendChild(leftAngledWinLine);
    }
    
    
    return {
        makeWinLine,
        makeLeftWinLine,
        makeRightWinLine,
        
        makeHorizontalWinLine,
        makeTopHorizontalWinLine,
        makeBottomHorizontalWinLine,

        makeRightAngledWinLine,
        makeLeftAngledWinLine,
    }
})();