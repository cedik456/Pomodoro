document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const startPauseBtn = document.getElementById("startPause");
  const resetButton = document.getElementById("reset");
  const tabs = document.querySelectorAll(".tab");

  let timer;
  let isRunning = false;
  let seconds = 30 * 60;
  let currentMode = "pomodoro";

  const timeSettings = {
    pomodoro: 30 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  // Will Create an audio element

  function requestNotificationPermission() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.error("Notification Permission Denied");
        }
      });
    }
  }

  function showNotification(title, options) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  }

  function updateDisplay() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  function startTimer() {
    if (!isRunning) {
      timer = setInterval(() => {
        if (seconds <= 0) {
          clearInterval(timer);
          isRunning = false;
          startPauseBtn.textContent = "Start";

          if (currentMode === "pomodoro") {
            switchMode("shortBreak");
          } else if (currentMode == "shortBreak") {
            switchMode("pomodoro");
          } else if (currentMode == "longBreak") {
            switchMode("pomodoro");
          }

          showNotification("Pomodoro:", {
            body: "Times UP! Starting your break",
          });
          return;
        }
        seconds--;
        updateDisplay();
      }, 1000);
      isRunning = true;
      startPauseBtn.textContent = "Pause";
    } else {
      clearInterval(timer);
      isRunning = false;
      startPauseBtn.textContent = "Start";
    }
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    seconds = timeSettings[currentMode];
    updateDisplay();
    startPauseBtn.textContent = "Start";
  }

  function switchMode(mode) {
    currentMode = mode;
    seconds = timeSettings[mode];
    resetTimer();
    tabs.forEach((tab) => tab.classList.remove("active"));
    document.getElementById(mode).classList.add("active");
  }

  updateDisplay();

  requestNotificationPermission();

  startPauseBtn.addEventListener("click", startTimer);
  resetButton.addEventListener("click", resetTimer);
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      switchMode(e.target.id);
    });
  });
});
