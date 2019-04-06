let logic = (function() {

    let Player = function(symbol, score = 2, tunrsAmount = 0, avgMoveTime = 0, totalPlayTime = 0, twoDiscsAmonut = 1, allGamesTunrsAmount = 0, allGamesTotalPlayTime = 0, allGamesAvgMoveTime = 0) {
        this.score = score;
        this.tunrsAmount = tunrsAmount;
        this.avgMoveTime = avgMoveTime;
        this.totalPlayTime = totalPlayTime;
        this.twoDiscsAmonut = twoDiscsAmonut;
        
        this.symbol = symbol;
        this.allGamesTunrsAmount = allGamesTunrsAmount;
        this.allGamesTotalPlayTime = allGamesTotalPlayTime;
        this.allGamesAvgMoveTime = allGamesAvgMoveTime;
    };

    let GameState = function() {
        this.players = {
            playerOne: new Player('X'),
            playerTwo: new Player('O'),
        };

        this.activePlayer = "playerOne";
        this.otherPlayer = "playerTwo";
        this.winner = null;
        this.activePlayerWins = false;
    };
    
    //privae properties:
    var board = [];
    var size;
    var gameState = new GameState(); 

    var totalSeconds = 0;
    var allGamesTotalSeconds = 0;

    //private methods
    let getOneRow = function() {
        let oneRow = [];
        for(let i = 0; i < size; i++) {
            oneRow.push(' ');
        }
        return oneRow;
    };

    let getSurroundingEnemiesArr = function(enemySymbol, i, j) {
        let arr = [];
        if(i - 1 >= 0 && board[i - 1][j] === enemySymbol) arr.push('up'); 
        if(i - 1 >= 0 && j + 1 <= size - 1 && board[i - 1][j + 1] === enemySymbol) arr.push('upRight');
        if(j + 1 <= size - 1 && board[i][j + 1] === enemySymbol) arr.push('right');
        if(i + 1 <= size - 1 && j + 1 <= size - 1 && board[i + 1][j + 1] === enemySymbol) arr.push('rightDown');
        if(i + 1 <= size - 1 && board[i + 1][j] === enemySymbol) arr.push('down');
        if(i + 1 <= size - 1 && j - 1 >= 0 &&  board[i + 1][j - 1] === enemySymbol) arr.push('downLeft');
        if(j - 1 >= 0 && board[i][j - 1] === enemySymbol) arr.push('left');
        if(i - 1 >= 0 && j - 1 >= 0 && board[i - 1][j - 1] === enemySymbol) arr.push('leftUp');

        return arr;
    };

    let killEnemiesVector = function(direction, mySymbol, enemySymbol, i, j) {
        let vector = [];

        switch(direction) {
            case 'up':
                i--;
                while(i >= 0 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    i--;
                }
                if(i >= 0 && board[i][j] !== ' ') { // means we exited the while cuase ***board[i][j] === mySymbol*** 
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'down':
                i++;
                while(i <= size - 1 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    i++;
                }
                if(i <= size - 1 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'right':
                j++;
                while(j <= size - 1 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    j++;
                }
                if(j <= size - 1 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'left':
                j--;
                while(j >= 0 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    j--;
                }
                if(j >= 0 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'upRight':
                j++; i--;
                while(j <= size - 1 && i >= 0 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    j++; i--;
                }
                if(j <= size - 1 && i >= 0 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'rightDown':
                j++; i++;
                while(j <= size - 1 && i <= size - 1 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    j++; i++;
                }
                if(j <= size - 1 && i <= size - 1 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'downLeft':
                j--; i++;
                while(j >= 0 && i <= size - 1 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    j--; i++;
                }
                if(j >= 0 && i <= size - 1 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
            case 'leftUp':
                j--; i--;
                while(j >= 0 && i >= 0 && board[i][j] !== mySymbol && board[i][j] !== ' ') {
                    vector.push(`${i}${j}`);
                    j--; i--;
                }
                if(j >= 0 && i >= 0 && board[i][j] !== ' ') {
                    return vector;
                } else {
                    return [];
                }
                break;
        } // switch
    }; // killEnemiesVector


    let swapActivePlayer = function() {
        let backUp = gameState.activePlayer;
        gameState.activePlayer = gameState.otherPlayer;
        gameState.otherPlayer = backUp;
		
		document.querySelector('.player-' + 1 + '-panel').classList.toggle('active');
		document.querySelector('.player-' + 0 + '-panel').classList.toggle('active');
    };




    let playerHasLegalMoves = function(player, otherPlayer) {
        for(let i = 0; i < size; i++) 
            for(let j = 0; j < size; j++) 
                if(logic.isMoveLegal(`${i}${j}`, player, otherPlayer))
                    return true;
        return false;
    }; // playerHasLegalMoves

    
    let doesActivePlayerWin = function() {
        // if: gameState.activePlayerWins || no additional moves to both players

        if(gameState.activePlayerWins) {
            return true;
        }

        // 'else': 

        let existAdditionalMoves = false; // "active player does win. that's the initial assumption".
        let activePlayer = gameState.players[gameState.activePlayer];
        let otherPlayer = gameState.players[gameState.otherPlayer];

        if(playerHasLegalMoves(activePlayer, otherPlayer) || playerHasLegalMoves(otherPlayer, activePlayer)) {
            existAdditionalMoves = true; // game is not over yet!
        }

        let res = !existAdditionalMoves;
        gameState.activePlayerWins = res;
        return res;
    };

    let initPlayer = function(playerStr) {

        playerObj = gameState.players[playerStr];

        this.allGamesTunrsAmount += playerObj.tunrsAmount;
        this.allGamesTotalPlayTime += playerObj.totalPlayTime;
        
        playerObj.score = 2;
        playerObj.tunrsAmount = 0;
        playerObj.avgMoveTime = 0;
        playerObj.totalPlayTime = 0;
        playerObj.twoDiscsAmonut = 1;
    }; // init player
    
    return {
        // logic public data:
        getEnemiesToKill: function(move, activePlayer = gameState.players[gameState.activePlayer], otherPlayer = gameState.players[gameState.otherPlayer]) {
            const mySymbol =  activePlayer.symbol;
            const enemySymbol = otherPlayer.symbol;
            let i = Number(move[0]);
            let j = Number(move[1]);
            let enemiesToKill = [];
    
            if(board[i][j] === ' ') {
                let surroundingEnemiesDirections = getSurroundingEnemiesArr(enemySymbol, i, j);
                surroundingEnemiesDirections.forEach(direction => {
                            enemiesToKill = enemiesToKill.concat(killEnemiesVector(direction, mySymbol, enemySymbol, i, j));
                });
    
            } // if board[i][j] === ' ' and we can speak!
    
            return enemiesToKill; // might return empty arr if there are no enemies to eat => move is not legal.
        }, // getEnemiesToKill




        winningLogics: function(winner /*reference to the player */) {
            gameState.winner = winner;
        },

        getTotalSeconds: function() {
            return totalSeconds;
        },

        setTotalSeconds: function(value) {
            totalSeconds = value;
        },

        getAllGamesTotalSeconds: function() {
            return allGamesTotalSeconds;
        },

        setAllGamesTotalSeconds: function(value) {
            allGamesTotalSeconds = value;
        },

        init: function() {

            // initiazling the state of the new game
            //gameState = new GameState();

            initPlayer("playerOne"); 
            initPlayer("playerTwo");

            gameState.activePlayer = "playerOne";
            gameState.otherPlayer = "playerTwo";
            gameState.winner = null;
            gameState.activePlayerWins = false;

            // start counting the game clock
            totalSeconds = 0;
        }, // init function

        makeMove: function(move) {
            let i = move[0];
            let j = move[1];
            let activePlayer = gameState.players[gameState.activePlayer];
            let otherPlayer = gameState.players[gameState.otherPlayer];
            let mySymbol =  gameState.players[gameState.activePlayer].symbol;
            
            // 1. updating the board with the enemies I conqured to be MY SYMBOL.
            let enemiesToKill = logic.getEnemiesToKill(move);
            enemiesToKill.forEach(enemyCell => {
            board[enemyCell[0]][enemyCell[1]] = mySymbol;
            });

            // 2. updating the cell I clioked to by MY SYMBOL.
            board[i][j] = mySymbol;
    
            // 3. all player related logics
            activePlayer.score += enemiesToKill.length + 1; // player added one disc by clicking and another enemiesToKill.length discs by eating!
            otherPlayer.score -= enemiesToKill.length; // oyyy :(
            if(otherPlayer.score === 2) otherPlayer.twoDiscsAmonut++; // means he's having another situation of two discs only
            if(activePlayer.score === 2) activePlayer.twoDiscsAmonut++;
            if(otherPlayer.score === 0) logic.winningLogics(activePlayer);

            activePlayer.tunrsAmount++; // player just made another turn
            activePlayer.allGamesTunrsAmount++;
            
            // the avg time is in seconds! i don't think the avg time would be minutes but we need to think about it and might support min as well
            activePlayer.totalPlayTime = parseInt(totalSeconds - otherPlayer.totalPlayTime);
            activePlayer.allGamesTotalPlayTime = parseInt(allGamesTotalSeconds - otherPlayer.allGamesTotalPlayTime);

            activePlayer.avgMoveTime = ((activePlayer.totalPlayTime / activePlayer.tunrsAmount)).toFixed(2); 
            activePlayer.allGamesAvgMoveTime = ((activePlayer.allGamesTotalPlayTime / activePlayer.allGamesTunrsAmount)).toFixed(2); 

            // 4. check wether I am the winner now
            if(doesActivePlayerWin()) {
                logic.winningLogics(activePlayer);
            } else {
                // 5. swap active player and keep playing only if the other player has more legal moves!
                if(playerHasLegalMoves(otherPlayer, activePlayer)) {
                    swapActivePlayer();
                } else {
                    alert('turn is still belogns to ' + activePlayer.symbol);
                }
            }
        }, // makeMove

        isMoveLegal: function(move, activePlayer, otherPlayer) { // I know activePlayer, otherPlayer may be undefined. getEnemiesToKill have default values.
            // past was: return getEnemiesToKill(move, activePlayer, otherPlayer).length > 0;
            const i = parseInt(move[0]);
            const j = parseInt(move[1]);
            const board = logic.getBoard();

            return (
            board[i][j] === ' ' &&
            ( 
            (i - 1 >= 0 && board[i - 1][j] !== ' ') ||
            (i - 1 >= 0 && j + 1 <= size - 1 && board[i - 1][j + 1] !== ' ') ||
            (j + 1 <= size - 1 && board[i][j + 1] !== ' ') ||
            (i + 1 <= size - 1 && j + 1 <= size - 1 && board[i + 1][j + 1] !== ' ') ||
            (i + 1 <= size - 1 && board[i + 1][j] !== ' ') ||
            (i + 1 <= size - 1 && j - 1 >= 0 &&  board[i + 1][j - 1] !== ' ') ||
            (j - 1 >= 0 && board[i][j - 1] !== ' ') ||
            (i - 1 >= 0 && j - 1 >= 0 && board[i - 1][j - 1] !== ' ')));
        },

        getBoard: function() {
            return board;
        },

        getGameState: function() {
            return gameState;
        },

        setSize: function(sizeToSet) {
            if(sizeToSet < 4 || sizeToSet % 2 == 1) {
                return false;
            
            } else {
                size = sizeToSet;
                return true;
            }
        },

        getSize: function() { return size; },

        getActivePlayerSymbol: function() { return gameState.players[gameState.activePlayer].symbol; },

        buildBoard: function() {
            board = [];
            for(let i = 0; i < size; i++) {
                board.push(getOneRow());
            } // for

            board[size / 2 - 1][size / 2 - 1] = 'X';
            board[size / 2 - 1][size / 2] = 'O';
            board[size / 2][size / 2 - 1] = 'O';
            board[size / 2][size / 2] = 'X';
        },

    }
})();


let UI = (function() {
    
    //private methods
    
    
    
    return {
        // public 
        update: function() {

            let isFinished = false;
            
            let gameState = logic.getGameState();

            // 1. update the current active player
            document.getElementById('activePlayer').innerHTML = 'active player symbol is: ' + logic.getActivePlayerSymbol();
            
            // 2. update the data about each player
            document.getElementById('playerOneScore').innerHTML = gameState.players.playerOne.score;            
            document.getElementById('playerTwoScore').innerHTML = gameState.players.playerTwo.score;            
            document.getElementById('totalTurnsAmount').innerHTML = 'Turns amount: ' + (gameState.players.playerOne.tunrsAmount + gameState.players.playerTwo.tunrsAmount);  

            document.getElementById('playerTwoTwoDisc').innerHTML = '2disc ammount: ' + gameState.players.playerTwo.twoDiscsAmonut;  
            document.getElementById('playerOneTwoDisc').innerHTML = '2disc ammount: ' + gameState.players.playerOne.twoDiscsAmonut;            

            document.getElementById('PlayerOneAvgMoveTime').innerHTML = 'Move avg time: ' + gameState.players.playerOne.avgMoveTime;            
            document.getElementById('PlayerTwoAvgMoveTime').innerHTML = 'Move avg time:' + gameState.players.playerTwo.avgMoveTime;  

            document.getElementById('PlayerOneAllGamesAvgMoveTime').innerHTML = 'All games avg time: ' + gameState.players.playerOne.allGamesAvgMoveTime;            
            document.getElementById('PlayerTwoAllGamesAvgMoveTime').innerHTML = 'All games avg time: ' + gameState.players.playerTwo.allGamesAvgMoveTime;  

            // 3. update the board table 
            UI.updateHTMLBoard();

            if(gameState.winner) {

                isFinished = true;

                UI.showWinner(gameState.winner);
            }

            return isFinished;
        }, // update

        showWinner: function(winner) {

            const modal = document.getElementById('myModal');
            document.getElementById('modalText').innerHTML = winner.symbol === 'X' ? 'black won' : 'pink won';
            modal.style.display = 'block'; 
            setTimeout(() =>  modal.style.display = 'none', 2000);

        },

        paintCellBackNoraml: function(id) {
            document.getElementById(id).parentElement.style.backgroundColor = 'transparent';
        },

        paintCell: function(id, color = 'blue') {
                document.getElementById(id).parentElement.style.backgroundColor = color;
                //document.getElementById(id).className = logic.getActivePlayerSymbol();
        }, 

        displayHTMLBoard: function(HTMLBoard) {
            let table = controler.getElements().table;
            table.innerHTML = '';
            table.insertAdjacentHTML('afterbegin', HTMLBoard);
            UI.updateHTMLBoard();
        }, // function displayBoard

        
        updateHTMLBoard: function() {
            for(let i = 0; i < logic.getSize(); i++) 
                for(let j = 0; j < logic.getSize(); j++) {
                    document.getElementById(`${i}${j}`).className = logic.getBoard()[i][j] === ' ' ? '' : `${logic.getBoard()[i][j]}`;
                    //document.getElementById(`${i}${j}`).children[0].style.display = logic.getBoard()[i][j] === ' ' ? 'none' : 'block';
                    } // for
        },

        changeCursorBackNormal: function () {
            document.getElementsByTagName("body")[0].style.cursor = 'default';
        },

    } // the public data ends
})();


let controler = (function() {
    
    //private methods
    let elements = {
        inputSize: document.getElementById('inputSize'),
        table: document.getElementById("table"),
        buttonStart: document.getElementById("buttonStart"),
        timeLabel: document.getElementById("timeLabel"),
        buttonQuit:document.getElementById("buttonQuit"),
        checkBoxPotentialGain: document.getElementById('checkBoxPotentialGain'),
        potentialGain: document.getElementById('potentialGain'),
    };

    var mouseLeftBoard;
    table.addEventListener('mouseenter', () => {mouseLeftBoard = false; });
    table.addEventListener('mouseleave', () => {mouseLeftBoard = true; UI.changeCursorBackNormal()});

    // invoked once a second
    function gameTimer() {
        let currentTime = logic.getTotalSeconds();
        currentTime++;
        logic.setTotalSeconds(currentTime);
        currentTime = logic.getTotalSeconds();
        elements.timeLabel.innerHTML = pad(parseInt(currentTime / 60)) + ':' + pad(currentTime % 60);
        //document.getElementsByClassName(".ion-ios-loop")[0].innerHTML = pad(parseInt(currentTime / 60)) + ':' + pad(currentTime % 60);


        let allGamesTime = logic.getAllGamesTotalSeconds();
        allGamesTime++;
        logic.setAllGamesTotalSeconds(allGamesTime);
    };

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString + "";
        } else {
            return valString;
        }
    };



	
	
	
    let cellEventHandler = function(e) {
        let cell = e.target.closest('td'); 
        let a = cell.children[0]; // works under the assumption that cell has ONLY ONE KID! the div kid!

        if(e.type === 'mouseenter') {
            mouseEnteredToCell(cell, a);
            
        } else if(e.type === 'mouseleave') {
            mouseLeftCell(cell, a);
        } else if(e.type === 'click') {
        cellClicked(cell, a);
        }
    }; // cellEventHandler

    let mouseEnteredToCell = function(cell, a) {
        UI.changeCursorBackNormal();
        document.getElementsByTagName("body")[0].style.cursor =`url('cursor${logic.getActivePlayerSymbol()}.cur'), auto`;

        elements.potentialGain.style.display = 'none';

        if(logic.isMoveLegal(a.id)) {
            UI.paintCell(a.id);

            const enemiesToKill = logic.getEnemiesToKill(a.id);

            if(elements.checkBoxPotentialGain.checked) {
                enemiesToKill.forEach(cell =>  UI.paintCell(cell, 'yellow'));
                elements.potentialGain.innerHTML = 'potential gain is ' + enemiesToKill.length;
                elements.potentialGain.style.display = enemiesToKill.length === 0 ? 'none' : 'block';
            }


            
        } else {
        }
    };




    let mouseLeftCell = function(cell, a) {
        UI.paintCellBackNoraml(a.id);
        logic.getEnemiesToKill(a.id).forEach(cell =>  UI.paintCellBackNoraml(cell));
        


        if(mouseLeftBoard) {
            UI.changeCursorBackNormal();
        }
    };

    // main functionionality 
    let cellClicked = function(cell, a) {
        if(logic.isMoveLegal(a.id)) {

            // making the move logicly
            logic.makeMove(a.id);
            
            // unmark the cell and the makred optional eatable cells
            const board = logic.getBoard();
            for(let i = 0; i < board.length; i++) 
                for(let j = 0; j < board.length; j++)
                    UI.paintCellBackNoraml(`${i}${j}`);
            
            // changing cursor to normal cursor
            UI.changeCursorBackNormal();
            document.getElementsByTagName("body")[0].style.cursor =`url('cursor${logic.getActivePlayerSymbol()}.cur'), auto`;

            
            elements.potentialGain.style.display = 'none';
            
            // updating UI after the move, building an updated table (board)
            UI.update();

            if(logic.getGameState().winner) {

                clearInterval(timeInterval);

                Array.from(document.getElementsByClassName('onlyInGame')).forEach(elem => elem.style.display = 'none');
                removeOrAddClicksEvents('remove');
            }

        } else {
            // move is not legal...
            const modal = document.getElementById('myModal');
            modal.style.display = 'block';
            document.getElementById('modalText').innerHTML = 'NOT A VALID MOVE';
            setTimeout(() =>  modal.style.display = 'none', 1000);
        } // else

    }; // cellClicked function 

    let removeOrAddClicksEvents = function(flag) {
        let allCells = document.getElementsByTagName('td'); // to make sure that we dont have any additional 'td' element in the html file.
        for (let cell of allCells) {
            if(flag === 'add') {
                ['mouseleave', 'mouseenter', 'click'].forEach(event => cell.addEventListener(event, cellEventHandler));
            } else if(flag === 'remove') {
                ['mouseleave', 'mouseenter', 'click'].forEach(event => cell.removeEventListener(event, cellEventHandler));

            }
        }
    };


    let buildHTMLBoard = function() {
        let board = logic.getBoard();
        let size = logic.getSize();

        let html = '';
        

        for(let i = 0; i < size; i++) {
            html += '<tr>';

            for(let j = 0; j < size; j++) {

                // id is a STRING (like '02'), representing the curreny i,j cell
               // html += `<td><a id=\'${i}${j}\'>${board[i][j]}</a></td>`;

                // adding image does NOT work well on board over 4x4 (like 6x6):
                //html += `<td><a id=\'${i}${j}\'><img src=${board[i][j]}-80.png display=${board[i][j] === ' ' ?  'none': 'block'}></a></td>`;
                html += `<td><div id=\'${i}${j}\'></div></td>`;

            } // for adding each <td><a id=0> </a></td>
            
            html += '</tr>';
        } // for i, each <tr> block

        return html;
    };




	let timeInterval;
	
	

    let startGame = function() {

        // -3 showing the only in games elements
        Array.from(document.getElementsByClassName('onlyInGame')).forEach(elem => elem.style.display = 'block');
		
		if(!document.querySelector('.player-0-panel').classList.contains("active")) {
				document.querySelector('.player-' + 1 + '-panel').classList.toggle('active');
				document.querySelector('.player-' + 0 + '-panel').classList.toggle('active');
		}


        // -2. stating the game clock
        clearInterval(timeInterval);
        elements.timeLabel.innerHTML = '00:00';
        timeInterval = setInterval(gameTimer, 1000);

        // -1. 
        logic.init();

        // 0. size is always 10 (we can change it to be dinamicaly in the future)
        logic.setSize(boardSize = 10);

        // 1. build the logic board in the logic side (the matrix itself)
        logic.buildBoard();

        // 2. build & display the html table that represent the logic board (the html table is derived from the logic board!)
        UI.displayHTMLBoard(buildHTMLBoard());

        // 3. display the init state of the game (current player, amount of rounds...)
        UI.update();

        // 3. implement the click events on each cell and its affect
        removeOrAddClicksEvents('add');
    };
	
	


    // entry point to the game is clicking the start button
    elements.buttonStart.addEventListener('click', startGame);

    // quit handle
    elements.buttonQuit.addEventListener('click', function() {

        let gameState = logic.getGameState();

        // 1. tell logic active player has quit hence other player has won technically
        logic.winningLogics(gameState.players[gameState.otherPlayer]);

        // 2. UI handling
        UI.showWinner(gameState.winner);

        clearInterval(timeInterval);

        Array.from(document.getElementsByClassName('onlyInGame')).forEach(elem => elem.style.display = 'none');
        removeOrAddClicksEvents('remove');
    });
	


    //public data
    return {
        // public properties
        getElements: function() { return elements; },
    }
})();