const sessionSeconds = 25 * 60;
const timerDisplay = document.querySelector("#focus-time");
const startButton = document.querySelector("#timer-start");
const resetButton = document.querySelector("#timer-reset");
const timerStatus = document.querySelector("#timer-status");

let secondsLeft = sessionSeconds;
let timerId = null;

function showTime() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerDisplay.dateTime = `PT${minutes}M${seconds}S`;
}

startButton.addEventListener("click", () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = "Resume";
    timerStatus.textContent = "Timer paused.";
    return;
  }

  if (secondsLeft === 0) secondsLeft = sessionSeconds;
  startButton.textContent = "Pause";
  timerStatus.textContent = "Focus on one task at a time.";

  timerId = setInterval(() => {
    secondsLeft -= 1;
    showTime();

    if (secondsLeft === 0) {
      clearInterval(timerId);
      timerId = null;
      startButton.textContent = "Start again";
      timerStatus.textContent = "Session complete. Take a short break.";
    }
  }, 1000);
});

resetButton.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  secondsLeft = sessionSeconds;
  startButton.textContent = "Start timer";
  timerStatus.textContent = "Ready when you are.";
  showTime();
});

showTime();
