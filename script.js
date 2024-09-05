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

  let score = 0;

  const getScore = () => score;
  // addScore also returns the updated score - obviously shouldn't be used
  // just for getting score
  const addScore = () => score++;

  return {marker, getScore, addScore};
}

const displayContoller = (function () {
  const renderBoard = function () {
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
      alert("can't place there");
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
    })
  }

  const updateScoreDisplay = function (player1Score, player2Score) {
    const scoreDisplay = document.querySelector(".game-score-display");
    scoreDisplay.textContent = `${player1Score} : ${player2Score}`;
  }
  
  return {renderBoard, getMoves, preventMoves, listenForGameStart,
    updateScoreDisplay};
})();

const gameController = (function () {
  // Create players
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");

  let draws = 0;

  const getDraws = () => draws;
  const addDraw = () => draws++;

  let rounds = 9;
  let currentPlayer = player1;

  const takeTurn = function (position) {
    gameBoard.updateBoard(currentPlayer.marker, position);
    displayContoller.renderBoard();
    rounds--;

    if (checkForWin(currentPlayer)) {
      displayContoller.preventMoves();
    }

    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }

    if (rounds === 0) {
      addDraw();
      displayContoller.preventMoves();
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
        if (winCondition
          .filter(winPosition => board[winPosition] === marker)
          .length === 3
        ) {
          player.addScore();
          console.log("won");
          return true;
        }
      }
    }

    return false;
  }

  const startNewGame = function () {
    // Check not already taking input and remove if so
    displayContoller.preventMoves();
    // Start taking inputs
    displayContoller.getMoves();

    gameBoard.resetBoard();

    displayContoller.renderBoard();
  }

  return {getDraws, takeTurn, startNewGame};
})();

displayContoller.listenForGameStart();