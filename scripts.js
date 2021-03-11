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
                displayMoveText.textContent = players[currentIndex].weapon;;
                
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
    };
    
})();

function loadGameScreen (startButton) {
    
    const beginGame = (player1Name, player2Name, player1Weapon, player2Weapon) => {
        const playerInfoFormHolder = document.getElementById('playerInfoFormHolder');
        
        const addVersusText = (() => {
            const container = document.getElementById('container');
            const buttonHolder = document.getElementById('buttonHolder');
            const versusText = document.createElement('h1');
            versusText.id = ('versusText');
            versusText.textContent = `${player1Name} vs. ${player2Name}`;
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
        playerInfoFormHolder.remove();
        gameBoard.buildBoard(player1Name, player2Name, player1Weapon, player2Weapon, players, currentIndex);
        
    }

    beginGame(getPlayers().players[0].name, getPlayers().players[1].name, getPlayers().players[0].weapon, getPlayers().players[1].weapon);
    gameLogic(gameBoard.board);
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

const gameLogic = () => {
 
}