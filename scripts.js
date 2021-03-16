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
    //Retrieves the player names and player weapons
    const _playerInformation = (() => {
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
        
    //Adds the player names and player weapons to an object and then adds those objects to an array called players
    const players = (() => [
        {
            name: _playerInformation.player1Name,
            weapon: _playerInformation.player1Weapon, 
        },
        {
            name: _playerInformation.player2Name,
            weapon: _playerInformation.player2Weapon, 
        }
    ])();
    
    return {
        players,
    }
}

const gameBoard = (() => {
    const _boardPartsArray = ['topLeft', 'topMid', 'topRight', 'midLeft', 'midMid', 'midRight', 'botLeft', 'botMid', 'botRight']
    const board = {
        boardParts: _boardPartsArray,
    }
    
    //Builds the array of objects that correlate to each board square
    let logicBoard = {};
    board.boardParts.forEach((square) => {
        logicBoard[square] = '';
    })

    //Adds a shadow of the letter to be added when the mouse hovers over a square
    const mouseHoverSquare = (boardSquare) => {
        letterSquare = document.getElementById(`${boardSquare.id}`);
        const weaponHoverText = document.createElement('h2');
        weaponHoverText.id = `wHT${boardSquare.id}`;
        weaponHoverText.classList.add('weaponHoverText');
        const displayMoveText = document.getElementById(`dMT${boardSquare.id}`);
        let currentIndex = gameStorage.currentIndex;
        let players = gameStorage.players;
        if (!letterSquare.classList.contains('containsMove')) {
            weaponHoverText.textContent = players[currentIndex].weapon;
            letterSquare.appendChild(weaponHoverText);
        }
    }

    //Removes the hover text when the mouse leaves the square
    const mouseLeaveSquare = (boardSquare) => {
        let weaponHoverText = document.getElementById(`wHT${boardSquare.id}`)
        if (weaponHoverText) {
            weaponHoverText.remove();
        }
    }
    
    //Adds the letter to the square when the square is clicked
    const displayMove = (boardSquare) => {
        letterSquare = document.getElementById(`${boardSquare.id}`);
        const displayMoveText = document.createElement('h2');
        displayMoveText.id = (`dMT${boardSquare.id}`);
        
        //Gets the information from the gameStorage
        let currentIndex = gameStorage.currentIndex;
        let players = gameStorage.players;
        
        //Updates the color class of the weapon depending upon what index it has
        if (currentIndex === 0) {
            weaponClass = 'purpleWeapon';
        } else if (currentIndex === 1) {
            weaponClass = 'greenWeapon';
        }
        displayMoveText.classList.add('displayMoveText', `${weaponClass}`);
        displayMoveText.textContent = players[currentIndex].weapon;
        
        //Checks if the square already contains a move and adds the letter if it doesn't
        if (!letterSquare.classList.contains('containsMove')) {
            letterSquare.classList.add('containsMove');
            letterSquare.appendChild(displayMoveText);
            mouseLeaveSquare(boardSquare);
            changeIndex();
            const squareName = boardSquare.id;
            
            //Sends the click data to gameLogic where it will be determined if it was a winning move
            gameLogic(players, currentIndex, squareName);
        }
        
        //Removes the text that tells the players which player goes first after a square has been clicked
        const firstPlayerText = document.getElementById('firstPlayerText');
        if (firstPlayerText) {
            firstPlayerText.remove();
        }
    }
    
    const buildBoard = () => {
        //Loops through each square and adds information and eventListeners
        board.boardParts.forEach((square) => {
            //Board square HMTL information
            const boardSquare = document.createElement('div');
            boardSquare.id = square;
            boardSquare.classList.add('boardSquare');
            
            //Adds eventListeners to the board squares
            boardSquare.addEventListener('mouseenter', mouseHoverSquare.bind(this, boardSquare));
            boardSquare.addEventListener('mouseleave', mouseLeaveSquare.bind(this, boardSquare));
            boardSquare.addEventListener('click', displayMove.bind(this, boardSquare));
            
            //Appends the squares to the gameHolder div
            const gameHolder = document.getElementById('gameHolder');
            gameHolder.appendChild(boardSquare);   
        })  
    }
    return {
        board,
        buildBoard,
        logicBoard,
    }
})();

const initGame = () => {
    //Checks if the game has been run before and gets the player names from the form if it hasn't
    const checkGameState = (() => {
        const playAgainButton = document.getElementById('playAgainButton');
        if (!gameStorage.gamePlayed === true) {
            //Gets the players array and adds it to game storage
            const players = getPlayers().players;
            gameStorage.players = players;
        }
    })();
    
    const players = gameStorage.players;
    
    const beginNewGame = (player1Name, player2Name) => {
        const playerNameForm = document.getElementById('playerNameForm');
        
        //Gets the names of the players and updates the display with that information
        const addVersusText = (() => {
            const container = document.getElementById('container');
            const buttonHolder = document.getElementById('buttonHolder');
            const versusText = document.createElement('div');
            versusText.id = ('versusText');
            versusText.innerHTML = `<h1 id='versus'><p id='player1VsName'>${player1Name}<p><p id='vs'>vs.<p><p id='player2VsName'>${player2Name}</p>`;
            container.insertAdjacentElement('afterbegin', versusText);
    
        })();
        
        //Randomly selects a player to begin the game
        const chooseStartingPlayer = (()  => {
            let currentIndex = Math.round(Math.random());
            let currentPlayer = players[currentIndex];
            
            return {
                currentIndex,
                currentPlayer,
            }
        })();

        //Updates the gameStorage index with the starting index
        let currentIndex = chooseStartingPlayer.currentIndex;
        gameStorage.currentIndex = currentIndex;
        
        //Gets the name of the starting player and updates the page with that information
        const firstPlayerText = document.createElement('h2');
        firstPlayerText.id = 'firstPlayerText';
        firstPlayerText.textContent = `${chooseStartingPlayer.currentPlayer.name} goes first!`
        const versusText = document.getElementById('versusText');
        versusText.insertAdjacentElement('afterend', firstPlayerText);
        
        const startButton = document.getElementById('startButton');
        startButton.remove();
        playerNameForm.remove();
        
        //Builds the game board
        gameBoard.buildBoard(players, currentIndex);
        
    }

    const continueNewGame = (player1Name, player2Name) => {
        //Gets the names of the players and updates the display with that information
        const addVersusText = (() => {
            const container = document.getElementById('container');
            const buttonHolder = document.getElementById('buttonHolder');
            const versusText = document.createElement('div');
            versusText.id = ('versusText');
            versusText.innerHTML = `<h1 id='versus'><p id='player1VsName'>${player1Name}<p><p id='vs'>vs.<p><p id='player2VsName'>${player2Name}</p>`;
            container.insertAdjacentElement('afterbegin', versusText);
    
        })();
        
        //Randomly selects a player to begin the game
        const chooseStartingPlayer = (()  => {
            let currentIndex = Math.round(Math.random());
            let currentPlayer = players[currentIndex];
            
            return {
                currentIndex,
                currentPlayer,
            }
        })();

        //Updates the gameStorage index with the starting index
        let currentIndex = chooseStartingPlayer.currentIndex;
        gameStorage.currentIndex = currentIndex;
        
        //Gets the name of the starting player and updates the page with that information
        const firstPlayerText = document.createElement('h2');
        firstPlayerText.id = 'firstPlayerText';
        firstPlayerText.textContent = `${chooseStartingPlayer.currentPlayer.name} goes first!`
        const versusText = document.getElementById('versusText');
        versusText.insertAdjacentElement('afterend', firstPlayerText);
        
        //Builds the game board
        gameBoard.buildBoard(players, currentIndex);
        
    }
    
    //Starts the games with different functions depending upon whether the game has been run before
    if (gameStorage.gamePlayed === true) {
        continueNewGame(gameStorage.players[0].name, gameStorage.players[1].name)
    } else {
        beginNewGame(gameStorage.players[0].name, gameStorage.players[1].name);
    }
    
}

//Adds an event listener to the startButton
const startButton = (() => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', initGame);
    
})();

//Acts as memory for the game, is carried between continued games, reset on new game
const gameStorage = ((players, currentIndex, gamePlayed) => {
    return {
        players,
        currentIndex,
        gamePlayed,
    }
})();

//Changes the index between 1 and 0 depending upon what the current index is
const changeIndex = () => {
    index = gameStorage.currentIndex;
    if (index === 0) {
        index = 1;
    } else if (index === 1) {
        index = 0;
    }
    gameStorage.currentIndex = index;
}

//Changes the letter a players uses as their weapon when the letters are clicked
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
})(); 

//Determines if there is a winner
const gameLogic = (players, currentIndex, square) => {
    logicBoard = gameBoard.logicBoard;
    let currentWeapon = players[currentIndex].weapon;
    logicBoard[square] = currentWeapon;
    if (square === 'topLeft') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.topRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeTopHorizontalWinLine();
        } else if (logicBoard.midLeft === currentWeapon
        && logicBoard.botLeft === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeLeftWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.botRight === currentWeapon) {
            gameOver(players[currentIndex].name);
            winLines.makeLeftAngledWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'topMid') {
        if (logicBoard.topLeft === currentWeapon 
        && logicBoard.topRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeTopHorizontalWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.botMid === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'topRight') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.topLeft === currentWeapon){
            gameOver(players[currentIndex].name); 
            winLines.makeTopHorizontalWinLine();
        } else if (logicBoard.midRight === currentWeapon
        && logicBoard.botRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeRightWinLine();
        } else if (logicBoard.midMid === currentWeapon 
        && logicBoard.botLeft === currentWeapon) {
            gameOver(players[currentIndex].name);
            winLines.makeRightAngledWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'midLeft') {
        if (logicBoard.topLeft === currentWeapon 
        && logicBoard.botLeft === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeLeftWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.midRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeHorizontalWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'midMid') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.botMid === currentWeapon){
            gameOver(players[currentIndex].name); 
            winLines.makeWinLine();
        } else if (logicBoard.midLeft === currentWeapon
        && logicBoard.midRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeHorizontalWinLine(); 
        } else if (logicBoard.topLeft === currentWeapon
        && logicBoard.botRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeLeftAngledWinLine(); 
        } else if (logicBoard.botLeft === currentWeapon
        && logicBoard.topRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeRightAngledWinLine(); 
        }  else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    }  else if (square === 'midRight') {
        if (logicBoard.topRight === currentWeapon 
        && logicBoard.botRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeRightWinLine();
        } else if (logicBoard.midLeft === currentWeapon
        && logicBoard.midMid === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeHorizontalWinLine(); 
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'botLeft') {
        if (logicBoard.topLeft === currentWeapon 
        && logicBoard.midLeft === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeLeftWinLine();
        } else if (logicBoard.botMid === currentWeapon
        && logicBoard.botRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeBottomHorizontalWinLine();
        } else if (logicBoard.midMid === currentWeapon
        && logicBoard.topRight === currentWeapon) {
            gameOver(players[currentIndex].name);
            winLines.makeRightAngledWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'botMid') {
        if (logicBoard.topMid === currentWeapon 
        && logicBoard.midMid === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeWinLine();
        } else if (logicBoard.botLeft === currentWeapon
        && logicBoard.botRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeBottomHorizontalWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    } else if (square === 'botRight') {
        if (logicBoard.midRight === currentWeapon 
        && logicBoard.topRight === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeRightWinLine();
        } else if (logicBoard.botMid === currentWeapon
        && logicBoard.botLeft === currentWeapon){
            gameOver(players[currentIndex].name);
            winLines.makeBottomHorizontalWinLine(); 
        } else if (logicBoard.midMid === currentWeapon 
        && logicBoard.topLeft === currentWeapon) {
            gameOver(players[currentIndex].name);
            winLines.makeLeftAngledWinLine();
        } else if (checkBoardFull() === true) {
            gameOver('tie');
        }
    }
}

//Determines if the logicBoard has any empty squares
const checkBoardFull = () => {
    logicBoard = gameBoard.logicBoard;
    for (square in logicBoard) {
        if (logicBoard[square] === ''){
            return false;
        }
    }
    return true;
}

//Resets the logicBoard
const resetBoard = () => {
    for (square in gameBoard.logicBoard) {
        gameBoard.logicBoard[square] = '';
    }
}

//Updates the page with the winner and buttons when the game ends
const gameOver = (result) => {
    if (result !== 'tie') {
        //Swaps the index back to the winning player
        changeIndex();
        const winningIndex = gameStorage.currentIndex;
        if (winningIndex === 0) {
            winnerId = 'player1VsName'
        } else if (winningIndex === 1) {
            winnerId = 'player2VsName'
        }
        versusText.innerHTML = 
        `<h1 id='versus'>
            <p id='${winnerId}'>${result} wins!</p>
        </h1>`;
    } else if (result === 'tie') {
        versusText.innerHTML = 
        `<h1 id='versus'>
            <p>It's a tie!</p>
        </h1>`;
    }
    
    //Adds the containsMove class to all the squares so that they can no longer be clicked
    const boardSquares = document.getElementsByClassName('boardSquare');
    for (square of boardSquares) {
        if (!square.classList.contains('containsMove')) {
            square.classList.add('containsMove');
        }
    }
    
    //Updates gameStorage to show that the game has been run before
    const runOnce = true;
    gameStorage.gamePlayed = runOnce;

    //Adds buttons to start a new game or play again
    const endGameButtonHolder = document.createElement('div');
    endGameButtonHolder.id = 'endGameButtonHolder';
    container.appendChild(endGameButtonHolder);
    
    const playAgainButton = document.createElement('h1');
    playAgainButton.id = 'playAgainButton';
    playAgainButton.classList.add('button');
    playAgainButton.textContent = 'Play Again?'
    endGameButtonHolder.appendChild(playAgainButton);
    playAgainButton.addEventListener('click', continueGame);

    const newGameButton = document.createElement('h1');
    newGameButton.id = 'newGameButton';
    newGameButton.classList.add('button');
    newGameButton.textContent = 'New Game'
    endGameButtonHolder.appendChild(newGameButton);
    newGameButton.addEventListener('click', newGame);
}

//Function for removing all childNodes of a parentNode
const removeChildNodes = (parent) => {
    while(parent.firstChild)  {
        parent.removeChild(parent.lastChild);
    }
}

//Continues the game with the current players
const continueGame = () => {
    //Gets the gameHolder element and removes the old board
    const gameHolder = document.getElementById('gameHolder');
    removeChildNodes(gameHolder);
    
    const endGameButtonHolder = document.getElementById('endGameButtonHolder');
    endGameButtonHolder.remove();
    const versusText = document.getElementById('versusText');
    versusText.remove();
    resetBoard();
    initGame();
}

//Returns the page to its initial state
const newGame = () => {
    //Resets the page to the initial state
    const container = document.getElementById('container');
    removeChildNodes(container);
    container.innerHTML =  `<div id="playerInfoFormHolder">
    <form id = "playerNameForm">
        <div id="player1Form" class="playerForm">
            <div class="playerFormText">
                <p id="player1Text">Player 1 Name:</p>
                <input id="player1Name" type="text">
                
            </div>
            <p id="player1Weapon" class="playerWeaponText">Player 1 Weapon:</p>
            <h1 class="weapon purpleWeapon" id="weaponO">O</h1>
            <p class="clickSwap">(click to swap)</p>
        </div>
        <div id="player2Form" class="playerForm">
            <div class="playerFormText">
                <p id="player1Text">Player 2 Name:</p>
                <input id="player2Name" type="text">
                
            </div>
            <p id="player2Weapon" class="playerWeaponText">Player 2 Weapon:</p>
            <h1 class="weapon greenWeapon" id="weaponX">X</h1>
            <p class="clickSwap">(click to swap)</p>
        </div>
        
    </form>
    
    </div>
    <div id="buttonHolder">
        <button id="startButton" class="button">Start Game</button>
    </div>
    <div id="gameHolder">

    </div>`
    
    //Resets gameStorage and the logicBoard
    gameStorage.players = null;
    gameStorage.currentIndex = null;
    gameStorage.gamePlayed = null;
    resetBoard();

    //Adds an eventListener to the new startButton
    const startButton = (() => {
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', initGame);
        
    })();

    //Adds an eventListener to the weapons
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
    })(); 
}

//Function for adding lines to the board upon game end
const winLines = (() => {
    //Vertical win lines
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
    
    //Horizontal win lins
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
    
    //Angled win lines
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