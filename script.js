const gameBoard = (function () {
  const board = [...Array(9)];

  const updateBoard = function (player, position) {
    board.splice(position, 1, player);
  }

  const getBoard = () => board;

  return {updateBoard, getBoard};
})();
