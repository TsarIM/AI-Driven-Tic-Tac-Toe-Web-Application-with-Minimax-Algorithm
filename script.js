const winning_combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

let current_board;
let human = '🍩';
let AI_bot = '🍌';

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  document.querySelector('.result').style.display = "none";
  document.querySelector('.result .text').innerText = "";
  document.querySelector('.choose-symbol').style.display = "block";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
  }
}

function chooseSymbol(symbol) {
  human = symbol;
  AI_bot = symbol === '🍩' ? '🍌' : '🍩';

  current_board = Array.from(Array(9).keys());

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', click_square, false);
  }
  if (AI_bot === '🍌') {
    play_move(bestSpot(), AI_bot);
  }
  document.querySelector('.choose-symbol').style.display = "none";
}

function click_square(square) {
  if (typeof current_board[square.target.id] === 'number') {
    play_move(square.target.id, human);
    if (!isWinner(current_board, human) && !checkTie())
      play_move(bestSpot(), AI_bot);
  }
}

function bestSpot() {
  return minimax(current_board, AI_bot).index;
}

function play_move(squareId, player) {
  current_board[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = isWinner(current_board, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function isWinner(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winning_combinations.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winning_combinations[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player === human ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', click_square, false);
  }
  declareWinner(gameWon.player === human ? "You win!" : "You lose");
}

function declareWinner(who) {
  document.querySelector(".result").style.display = "block";
  document.querySelector(".result .text").innerText = who;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (cell of cells) {
      cell.style.backgroundColor = "greenyellow";
      cell.removeEventListener('click', click_square, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function emptySquares() {
  return current_board.filter((elm, i) => i === elm);
}

function minimax(newBoard, player) {
  var availableSquares = emptySquares(newBoard);

  if (isWinner(newBoard, human)) {
    return { score: -1 };
  } else if (isWinner(newBoard, AI_bot)) {
    return { score: 1 };
  } else if (availableSquares.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (let i = 0; i < availableSquares.length; i++) {
    var move = {};
    move.index = newBoard[availableSquares[i]];
    newBoard[availableSquares[i]] = player;

    if (player === AI_bot)
      move.score = minimax(newBoard, human).score;
    else
      move.score = minimax(newBoard, AI_bot).score;
    newBoard[availableSquares[i]] = move.index;
    if ((player === AI_bot && move.score === 10) || (player === human && move.score === -10))
      return move;
    else
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === AI_bot) {
    bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}