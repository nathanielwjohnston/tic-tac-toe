const gameBoard = (function () {
  let board = [...Array(9)];

  const updateBoard = function (playerMarker, position) {
    if (playerMarker !== "X" && playerMarker !== "O") {
      console.log("Unsupported marker");
      return;
    }
    board.splice(position, 1, playerMarker);
  }

  const resetBoard = function () {
    board = [...Array(9)];
  }

  const getBoard = () => board;

  return {updateBoard, resetBoard, getBoard};
})();

function createPlayer (marker) {
  // Would maybe update this to include some sort of error handling in future
  if (marker !== "X" && marker !== "O") {
    console.log("Unsupported marker");
    return;
  }

  let name;
  let score = 0;

  const getScore = () => score;
  // addScore also returns the updated score - obviously shouldn't be used
  // just for getting score
  const addScore = () => score++;

  const updateName = (newName) => name = newName;
  const getName = () => name;

  return {marker, getScore, addScore, getName, updateName};
}

const displayContoller = (function () {
  const renderBoard = function () {

    resetBoardDisplay();
    
    const gameBoardDisplay = document.querySelector(".game-board");
    const gameBoardDisplaySquares = gameBoardDisplay
                                      .querySelectorAll(".game-board-squares");
    const board = gameBoard.getBoard();                                      

    gameBoardDisplaySquares.forEach((square, index) => {
      let marker;
      if (board[index] === undefined) {
        marker = "";
      } else {
        marker = board[index];
      }
      square.textContent = marker;
    })
  }

  function squareClicking (e) {
    const gameBoardDisplaySquare = e.target;
    if (gameBoardDisplaySquare.textContent === "") {
      gameController.takeTurn(gameBoardDisplaySquare.dataset.boardPosition);
    } else {
      gameBoardDisplaySquare.classList.add("wrong-squares");
    }
  }

  const getMoves = function () {
    const gameBoardDisplay = document.querySelector(".game-board");
    gameBoardDisplay.addEventListener("click", squareClicking);
    // To allow for future checks if event listener needs removed
    gameBoardDisplay.dataset.takingMoves = true;
  }

  const preventMoves = function () {
    const gameBoardDisplay = document.querySelector(".game-board");
    // Check if event listener exists
    if (gameBoardDisplay.getAttribute("data-taking-moves") === "true") {
      // Remove event listener
      gameBoardDisplay.removeEventListener("click", squareClicking);
      // Set false to keep up to date for later checks when starting games
      gameBoardDisplay.dataset.takingMoves = false;
    }
  }

  const listenForGameStart = function () {
    const startButton = document.querySelector(".start-game-button");
    startButton.addEventListener("click", () => {
      gameController.startNewGame();
      if (startButton.textContent = "Start") {
        startButton.textContent = "Restart"
      }
    })
  }

  const updateScoreDisplay = function (player1Score, player2Score, draws) {
    const scoreDisplay = document.querySelector(".game-score-display");
    const drawDisplay = document.querySelector(".game-draw-display");
    scoreDisplay.textContent = `${player1Score} : ${player2Score}`;
    drawDisplay.textContent = `Draws: ${draws}`;
  }

  const listenForNameChange = function () {
    const playerNameDisplays = document.querySelectorAll(".player-name-display");
    playerNameDisplays.forEach(display => {
      let displayParent = display.parentElement;
      display.addEventListener("keydown", e => {
        const maxChars = 12;
        const key = e.key;
    
        if (display.textContent.length === maxChars &&
            key !== "Backspace" &&
            key !== "Enter") {
          e.preventDefault();
          displayParent.classList.add("child-name-too-long");
        } else if (key === "Enter") {
          e.preventDefault();
          display.removeAttribute("contenteditable");
          displayParent.classList.remove("child-editing");
          // save name
          updatePlayerNameDisplay(display.textContent, display.dataset.playerPosition);
          gameController
            .updatePlayerName(display.dataset.player, display.textContent);
        }

        if (display.textContent.length === maxChars &&
            key === "Backspace" &&
            displayParent.classList.contains("child-name-too-long")
        ) {
          displayParent.classList.remove("child-name-too-long");
        }

      })

      // setting contenteditable like this allows the enter key to be used to
      // also save the player's name
      display.addEventListener("click", e => {
        display.setAttribute("contenteditable", "true");
        // Child editing class is to pass information on input back to user
        displayParent.classList.add("child-editing");
        display.focus();
        const originalText = display.textContent;

        // check click outside, undo changes instead
        document.addEventListener("click", function undoChanges(e) {
          if (display.hasAttribute("contenteditable")) {
            if (!display.contains(e.target)) {
              display.removeAttribute("contenteditable");
              displayParent.classList.remove("child-editing");
              // undo changes
              display.textContent = originalText;
              this.removeEventListener("click", undoChanges);
            }
          } else {
            this.removeEventListener("click", undoChanges);
          }
        })
      })
    })
  }

  const updatePlayerNameDisplay = function (name, playerPosition) {
    const displayNames = document.querySelectorAll(`.${playerPosition}-player-name-display`);
    displayNames.forEach(display => {
      display.textContent = name;
    })
  }

  const updateBoardAfterWin = function (winningPositions) {
    for (let position of winningPositions) {
      square = document.querySelector(`#square-${position}`);
      square.classList.add("winning-squares");

    }
  }

  const resetBoardDisplay = function () {
    squares = document.querySelectorAll(".game-board-squares");
    squares.forEach(square => square.classList.remove("winning-squares", "wrong-squares"));
  }
  
  return {renderBoard, getMoves, preventMoves, listenForGameStart,
    updateScoreDisplay, listenForNameChange, updateBoardAfterWin};
})();

const gameController = (function () {
  // Create players
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");

  let draws = 0;

  const getDraws = () => draws;
  const addDraw = () => {
    draws++;
  };

  let rounds = 9;
  let currentPlayer = player1;

  const takeTurn = function (position) {
    gameBoard.updateBoard(currentPlayer.marker, position);
    displayContoller.renderBoard();
    rounds--;

    if (checkForWin(currentPlayer)) {
      currentPlayer.addScore();
      endGame();
    }

    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }

    if (rounds === 0) {
      addDraw();
      endGame();
    }
  }

  const checkForWin = function (player) {
    const board = gameBoard.getBoard();
    const marker = player.marker;
    const winConditions = [
      [0,1,2],
      [0,3,6],
      [0,4,8],
      [1,4,7],
      [2,4,6],
      [2,5,8],
      [3,4,5],
      [6,7,8]
    ];
    // if player has made at least 3 moves (can't win with less)
    if (
      board.filter((currentMarker) => currentMarker === marker)
        .length > 2
    ) {

      for (let winCondition of winConditions) {
        let positionsMatched = winCondition
        .filter(winPosition => board[winPosition] === marker)
        if (positionsMatched.length === 3
        ) {;
          // call to disp. contr.? to change styles to alert for win (using positionsMatched)
          displayContoller.updateBoardAfterWin(positionsMatched);
          return true;
        }
      }
    }

    return false;
  }

  const endGame = function () {
    displayContoller.preventMoves();
    displayContoller.updateScoreDisplay(player1.getScore(), 
    player2.getScore(), getDraws());
    rounds = 9;
  }

  const startNewGame = function () {
    // Check not already taking input and remove if so
    displayContoller.preventMoves();
    // Start taking inputs
    displayContoller.getMoves();

    gameBoard.resetBoard();

    displayContoller.renderBoard();
  }

  const updatePlayerName = function (chosenPlayer, newName) {
    let player;
    if (chosenPlayer === "player1") {
      player = player1;
    } else {
      player = player2;
    }

    player.updateName(newName);
  }

  return {getDraws, takeTurn, startNewGame, updatePlayerName, player1};
})();

displayContoller.listenForGameStart();
displayContoller.listenForNameChange();