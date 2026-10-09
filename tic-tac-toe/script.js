// Winning combinations for a standard Tic-Tac-Toe board
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Select game elements from the DOM
const cells = [...document.querySelectorAll(".cell")];
const gameStatus = document.querySelector("#game-status");
const roundTime = document.querySelector("#round-time");
const newRoundButton = document.querySelector("#new-round");
const resetScoreButton = document.querySelector("#reset-score");
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draws: document.querySelector("#score-draws"),
};

// Keep track of the board state and current round status
let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let elapsedSeconds = 0;
let clockId = null;
const scores = { X: 0, O: 0, draws: 0 };

// Display the elapsed round time as MM:SS
function renderClock() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  roundTime.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  roundTime.dateTime = `PT${minutes}M${seconds}S`;
}

// Start the round timer once the first move is made
function startClock() {
  if (clockId !== null) return;
  clockId = window.setInterval(() => {
    elapsedSeconds += 1;
    renderClock();
  }, 1000);
}

// Stop the timer when a round ends
function stopClock() {
  window.clearInterval(clockId);
  clockId = null;
}

// Check whether either player has completed a winning line
function winningLine() {
  return winningLines.find(
    ([first, second, third]) =>
      board[first] &&
      board[first] === board[second] &&
      board[first] === board[third],
  );
}

// Update the score panel with the current tally
function renderScores() {
  scoreElements.X.textContent = scores.X;
  scoreElements.O.textContent = scores.O;
  scoreElements.draws.textContent = scores.draws;
}

// Finish the round and update the scoreboard
function finishRound(winnerLine) {
  gameOver = true;
  stopClock();
  cells.forEach((cell) => (cell.disabled = true));

  if (winnerLine) {
    winnerLine.forEach((index) => cells[index].classList.add("is-winner"));
    scores[currentPlayer] += 1;
    gameStatus.textContent = `Player ${currentPlayer} wins!`;
  } else {
    scores.draws += 1;
    gameStatus.textContent = "It's a draw!";
  }

  renderScores();
}

// Handle a player's click on an empty square
function playTurn(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);
  if (gameOver || board[index]) return;

  if (elapsedSeconds === 0) startClock();
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.dataset.mark = currentPlayer;
  cell.setAttribute(
    "aria-label",
    `${cell.getAttribute("aria-label").replace(", empty", ", ")}${currentPlayer}`,
  );

  const line = winningLine();
  if (line || board.every(Boolean)) {
    finishRound(line);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameStatus.textContent = `Player ${currentPlayer}'s turn.`;
}

// Reset the board for a fresh round
function startNewRound() {
  stopClock();
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  elapsedSeconds = 0;
  gameStatus.textContent = "Player X starts. Choose a square.";
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("is-winner");
    delete cell.dataset.mark;
    cell.setAttribute("aria-label", `Row ${row}, column ${column}, empty`);
  });
  renderClock();
}

// Wire up the game actions
cells.forEach((cell) => cell.addEventListener("click", playTurn));
newRoundButton.addEventListener("click", startNewRound);
resetScoreButton.addEventListener("click", () => {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  renderScores();
});
