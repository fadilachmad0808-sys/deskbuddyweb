// ===== util: notifikasi aman =====
const NotificationSafe = {
  isSupported: () => "Notification" in window,
  requestPermissionIfNeeded: async () => {
    if (!NotificationSafe.isSupported()) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    // modern browsers return a Promise
    try {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    } catch (e) {
      return false;
    }
  },
  notify: (title, body) => {
    if (!NotificationSafe.isSupported()) return;
    try {
      new Notification(title, { body });
    } catch (e) {
      console.warn("Notification failed:", e);
    }
  }
};

// minta izin sekali di awal (tapi jangan paksa user)
NotificationSafe.requestPermissionIfNeeded();

// ===== Eye break timer (repeatable) =====
let eyeIntervalMin = 20;
let eyeIntervalId = null;

const eyeStartBtn = document.getElementById("eye-start");
const eyeStopBtn = document.getElementById("eye-stop");
const eyeStatus = document.getElementById("eye-status");
document.getElementById("eye-interval-text").textContent = eyeIntervalMin;

function startEyeBreak() {
  if (eyeIntervalId) return; // sudah jalan
  eyeStatus.textContent = `Status: berjalan (${eyeIntervalMin} menit)`;
  // jalankan pertama kali setelah interval lalu ulang terus
  eyeIntervalId = setInterval(() => {
    NotificationSafe.notify("Istirahat Mata", "Istirahatkan mata 20 detik (20–20–20).");
  }, eyeIntervalMin * 60 * 1000);
}

function stopEyeBreak() {
  if (!eyeIntervalId) return;
  clearInterval(eyeIntervalId);
  eyeIntervalId = null;
  eyeStatus.textContent = "Status: berhenti";
}

eyeStartBtn.addEventListener("click", startEyeBreak);
eyeStopBtn.addEventListener("click", stopEyeBreak);

// ===== Hydration timer (repeatable) =====
let waterIntervalMin = 60;
let waterIntervalId = null;

const waterStartBtn = document.getElementById("water-start");
const waterStopBtn = document.getElementById("water-stop");
const waterStatus = document.getElementById("water-status");
document.getElementById("water-interval-text").textContent = waterIntervalMin;

function startHydration() {
  if (waterIntervalId) return;
  waterStatus.textContent = `Status: berjalan (${waterIntervalMin} menit)`;
  waterIntervalId = setInterval(() => {
    NotificationSafe.notify("Waktunya Minum", "Jangan lupa minum air ya!");
  }, waterIntervalMin * 60 * 1000);
}

function stopHydration() {
  if (!waterIntervalId) return;
  clearInterval(waterIntervalId);
  waterIntervalId = null;
  waterStatus.textContent = "Status: berhenti";
}

waterStartBtn.addEventListener("click", startHydration);
waterStopBtn.addEventListener("click", stopHydration);

// ===== Pomodoro simple =====
let pomoDefault = 25 * 60; // detik
let pomoTime = pomoDefault;
let pomoInterval = null;

const pomoTimerEl = document.getElementById("pomo-timer");
const pomoStart = document.getElementById("pomo-start");
const pomoPause = document.getElementById("pomo-pause");
const pomoReset = document.getElementById("pomo-reset");

function renderPomo() {
  let m = Math.floor(pomoTime / 60);
  let s = pomoTime % 60;
  pomoTimerEl.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function startPomodoro() {
  if (pomoInterval) return; // sudah jalan
  pomoInterval = setInterval(() => {
    if (pomoTime > 0) {
      pomoTime--;
      renderPomo();
    } else {
      clearInterval(pomoInterval);
      pomoInterval = null;
      NotificationSafe.notify("Pomodoro Selesai", "Waktunya istirahat!");
      pomoTime = pomoDefault;
      renderPomo();
    }
  }, 1000);
}

function pausePomodoro() {
  if (pomoInterval) {
    clearInterval(pomoInterval);
    pomoInterval = null;
  }
}

function resetPomodoro() {
  pausePomodoro();
  pomoTime = pomoDefault;
  renderPomo();
}

pomoStart.addEventListener("click", startPomodoro);
pomoPause.addEventListener("click", pausePomodoro);
pomoReset.addEventListener("click", resetPomodoro);
renderPomo();

// ===== To-Do List (LocalStorage) =====
const TODO_KEY = "deskbuddy_todos_v1";
let todos = JSON.parse(localStorage.getItem(TODO_KEY) || "[]");

const todoListEl = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-input");
const todoAddBtn = document.getElementById("todo-add");

function saveTodos() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function renderTodos() {
  todoListEl.innerHTML = "";
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t;
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.style.marginLeft = "8px";
    btn.onclick = () => {
      todos.splice(i, 1);
      saveTodos();
      renderTodos();
    };
    li.appendChild(btn);
    todoListEl.appendChild(li);
  });
}

todoAddBtn.addEventListener("click", () => {
  const v = todoInput.value.trim();
  if (!v) return;
  todos.push(v);
  todoInput.value = "";
  saveTodos();
  renderTodos();
});

renderTodos();

// ===== Safety: stop all timers when page unload (optional) =====
window.addEventListener("beforeunload", () => {
  if (eyeIntervalId) clearInterval(eyeIntervalId);
  if (waterIntervalId) clearInterval(waterIntervalId);
  if (pomoInterval) clearInterval(pomoInterval);
});
