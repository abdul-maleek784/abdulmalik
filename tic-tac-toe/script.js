// All possible winning lines on a 3x3 board.
// If any of these patterns matches, a player has won.
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

// Grab all the important elements from the HTML page.
// These are the clickable boxes, the status text, timer, score text, and buttons.
const cells = [...document.querySelectorAll(".cell")];
const gameStatus = document.querySelector("#game-status");
const roundTime = document.querySelector("#round-time");
const newRoundButton = document.querySelector("#new-round");
const resetScoreButton = document.querySelector("#reset-score");
const opponentMode = document.querySelector("#opponent-mode");
const scoreLabels = {
  X: document.querySelector("#label-x"),
  O: document.querySelector("#label-o"),
};
const scoreElements = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draws: document.querySelector("#score-draws"),
};

// Game state variables:
// - board holds the 9 cells as an array of empty, X, or O values
// - currentPlayer tracks whose turn it is
// - gameOver stops clicks when the round is finished
// - aiThinking prevents extra clicks while the AI is choosing a move
let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let aiThinking = false;
let elapsedSeconds = 0;
let clockId = null;
let aiMoveId = null;
const scores = { X: 0, O: 0, draws: 0 };

// Display the elapsed round time as MM:SS.
// This makes the timer easy to read and keeps it consistent with the UI.
function renderClock() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  roundTime.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  roundTime.dateTime = `PT${minutes}M${seconds}S`;
}

// Start the timer only once when the first move is made.
function startClock() {
  if (clockId !== null) return;
  clockId = window.setInterval(() => {
    elapsedSeconds += 1;
    renderClock();
  }, 1000);
}

// Stop the timer when a round ends.
function stopClock() {
  window.clearInterval(clockId);
  clockId = null;
}

// Check if either player has completed a winning line.
// The function accepts an optional board argument so we can test possible moves.
function winningLine(position = board) {
  return winningLines.find(
    ([first, second, third]) =>
      position[first] &&
      position[first] === position[second] &&
      position[first] === position[third],
  );
}

// Test a move on a temporary board and see if it creates a winning pattern.
// This is used by the AI to decide whether it should win immediately.
function findWinningMove(targetMark) {
  let winningMove = -1;
  board.forEach((mark, index) => {
    if (mark) return;
    board[index] = targetMark;
    if (winningLine()) winningMove = index;
    board[index] = "";
  });
  return winningMove;
}

// This is the medium-difficulty AI.
// It tries to win first, blocks the player if needed, and otherwise picks a smart square.
function chooseAiMove() {
  const winningMove = findWinningMove("O");
  if (winningMove !== -1) return winningMove;

  const blockingMove = findWinningMove("X");
  if (blockingMove !== -1 && Math.random() < 0.75) return blockingMove;

  const openMoves = board
    .map((mark, index) => (mark ? -1 : index))
    .filter((index) => index !== -1);

  // The center is usually the strongest opening move.
  if (board[4] === "" && Math.random() < 0.65) return 4;

  // Corners are also strong choices, especially when available.
  const openCorners = [0, 2, 6, 8].filter((index) => board[index] === "");
  if (openCorners.length && Math.random() < 0.65) {
    return openCorners[Math.floor(Math.random() * openCorners.length)];
  }

  // If nothing else works, play a random available square.
  return openMoves[Math.floor(Math.random() * openMoves.length)];
}

// Update the score panel with the current tally.
function renderScores() {
  scoreElements.X.textContent = scores.X;
  scoreElements.O.textContent = scores.O;
  scoreElements.draws.textContent = scores.draws;
}

// When the board has a winner or a full draw, stop the game and update the score.
function finishRound(winnerLine) {
  gameOver = true;
  stopClock();
  cells.forEach((cell) => (cell.disabled = true));

  if (winnerLine) {
    winnerLine.forEach((index) => cells[index].classList.add("is-winner"));
    const winner = board[winnerLine[0]];
    scores[winner] += 1;
    gameStatus.textContent =
      opponentMode.value === "ai"
        ? winner === "X"
          ? "You win!"
          : "The AI wins!"
        : `Player ${winner} wins!`;
  } else {
    scores.draws += 1;
    gameStatus.textContent = "It's a draw!";
  }

  renderScores();
}

// Place a mark in a clicked cell and then check for win/draw.
// This function is also used by the AI when it chooses a square automatically.
function playMove(index) {
  const cell = cells[index];
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

  // Switch turns after a valid move.
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // If the selected mode is AI and the turn has passed to O, wait a little then let the AI play.
  if (opponentMode.value === "ai" && currentPlayer === "O") {
    aiThinking = true;
    cells.forEach((boardCell) => (boardCell.disabled = true));
    gameStatus.textContent = "The AI is thinking...";
    aiMoveId = window.setTimeout(() => {
      aiThinking = false;
      playMove(chooseAiMove());
      if (!gameOver) {
        cells.forEach((boardCell, cellIndex) => {
          boardCell.disabled = Boolean(board[cellIndex]);
        });
        gameStatus.textContent = "Your turn (X).";
      }
      aiMoveId = null;
    }, 350);
  } else {
    gameStatus.textContent =
      opponentMode.value === "ai"
        ? "Your turn (X)."
        : `Player ${currentPlayer}'s turn.`;
  }
}

// Runs whenever a user clicks a square.
// It ignores invalid clicks like clicking a filled box or clicking while the AI is playing.
function handleCellClick(event) {
  const index = Number(event.currentTarget.dataset.cell);
  if (gameOver || aiThinking || board[index]) return;
  if (elapsedSeconds === 0) startClock();
  playMove(index);
}

// Reset the whole board for a new round.
// This clears the grid, resets turn order, and updates labels for AI vs human mode.
function startNewRound() {
  stopClock();
  window.clearTimeout(aiMoveId);
  aiMoveId = null;
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  aiThinking = false;
  elapsedSeconds = 0;
  gameStatus.textContent =
    opponentMode.value === "ai"
      ? "Your turn (X). Choose a square."
      : "Player X starts. Choose a square.";
  scoreLabels.X.textContent =
    opponentMode.value === "ai" ? "You (X)" : "Player X";
  scoreLabels.O.textContent =
    opponentMode.value === "ai" ? "AI (O)" : "Player O";
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

// Connect all buttons and cells to their event handlers.
// This is how the game starts listening for user input.
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
newRoundButton.addEventListener("click", startNewRound);
opponentMode.addEventListener("change", startNewRound);
resetScoreButton.addEventListener("click", () => {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  renderScores();
});

// Start the round immediately when the page loads.
startNewRound();
