const gameBoard = (function () {
  const board = [...Array(9)];

  const updateBoard = function (playerMarker, position) {
    if (marker !== "X" && marker !== "O") {
      console.log("Unsupported marker");
      return;
    }
    board.splice(position, 1, playerMarker);
  }

  const resetBoard = function () {
    board.splice(0, 9, undefined);
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

const gameController = (function (gameBoard) {
  // Create players
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");


})();