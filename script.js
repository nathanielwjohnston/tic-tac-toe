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

const gameController = (function () {
  // Create players
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");

  let draws = 0;

  const getDraws = () => draws;
  const addDraw = () => draws++;

  const takeTurn = function (player) {
    let position;

    while (true) {
      position = parseInt(prompt(`Player's move:`));
      const board = gameBoard.getBoard();

      if (position < 9 && board[position] === undefined) {
        console.log("approved move");
        break;
      }

      console.log("not approved, try again");
    }

    gameBoard.updateBoard(player.marker, position);
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
    // if players has made at least 3 moves (can't win with less)
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


  const playRound = function () {
    const totalTurns = 9;

    for (let i = 0; i < totalTurns; i++) {
      let currentPlayer;
      if (i % 2 === 0) {
        currentPlayer = player1;
      } else {
        currentPlayer = player2;
      }

      // pick square
      takeTurn(currentPlayer);

      // check for win
      if (checkForWin(currentPlayer)) {
        break;
      };

      // for draw
      if (i === (totalTurns - 1)) {
        addDraw();
      }
    }

    // end round
    gameBoard.resetBoard();
  }

  return {playRound, getDraws};
})();

const displayContoller = (function () {
  const renderBoard = function () {
    const gameBoardDisplay = document.querySelector(".game-board");
    const gameBoardDisplaySquares = gameBoardDisplay
                                      .querySelectorAll(".game-board-squares");
    const board = gameBoard.getBoard();                                      

    gameBoardDisplaySquares.forEach((square, index) => {
      let marker;
      if (board[index] === undefined) {
        marker = " ";
      } else {
        marker = board[index];
      }
      square.textContent = marker;
    })
  }

  

  return {renderBoard};
})();