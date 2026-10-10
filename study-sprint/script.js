// Study Sprint timer settings and state.
// A full focus session is 25 minutes, which is 1500 seconds.
const sessionSeconds = 25 * 60;

// Grab the important elements from the page.
const timerDisplay = document.querySelector("#focus-time");
const startButton = document.querySelector("#timer-start");
const resetButton = document.querySelector("#timer-reset");
const timerStatus = document.querySelector("#timer-status");

// Track how many seconds remain in the current session.
let secondsLeft = sessionSeconds;

// This stores the interval ID so we can start and stop the countdown.
let timerId = null;

// Update the displayed timer text in MM:SS format.
// Example: 25:00, 24:59, 00:30.
function showTime() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timerDisplay.dateTime = `PT${minutes}M${seconds}S`;
}

// Start, pause, or resume the focus timer.
startButton.addEventListener("click", () => {
  // If the timer is already running, pause it.
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = "Resume";
    timerStatus.textContent = "Timer paused.";
    return;
  }

  // If the session has already finished, restart it from a full 25 minutes.
  if (secondsLeft === 0) secondsLeft = sessionSeconds;
  startButton.textContent = "Pause";
  timerStatus.textContent = "Focus on one task at a time.";

  // Run the countdown every second.
  timerId = setInterval(() => {
    secondsLeft -= 1;
    showTime();

    // When the timer reaches zero, stop the countdown and change the status text.
    if (secondsLeft === 0) {
      clearInterval(timerId);
      timerId = null;
      startButton.textContent = "Start again";
      timerStatus.textContent = "Session complete. Take a short break.";
    }
  }, 1000);
});

// Reset the timer back to the full focus session.
resetButton.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  secondsLeft = sessionSeconds;
  startButton.textContent = "Start timer";
  timerStatus.textContent = "Ready when you are.";
  showTime();
});

// Show the initial timer state when the page loads.
showTime();
