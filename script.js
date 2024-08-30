const gameBoard = (function () {
  const board = [...Array(9)];

  const updateBoard = function (player, position) {
    board.splice(position, 1, player);
  }

  const getBoard = () => board;

  return {updateBoard, getBoard};
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
