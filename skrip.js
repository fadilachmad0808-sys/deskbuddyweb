// --- Notifikasi Browser ---
function notify(msg) {
    if (Notification.permission === "granted") {
        new Notification(msg);
    }
}

// Minta izin notifikasi
Notification.requestPermission();

// --- Eye Break Timer ---
function startEyeBreak() {
    setTimeout(() => {
        notify("Istirahatkan mata 20 detik!");
        document.getElementById("eye-status").textContent = "Next break: 20 menit lagi";
    }, 20 * 60000);
}

// --- Hydration Reminder ---
function startHydration() {
    setTimeout(() => {
        notify("Waktunya minum air!");
        document.getElementById("water-status").textContent = "Next drink: 60 menit lagi";
    }, 60 * 60000);
}

// --- Pomodoro ---
let pomoTime = 25 * 60;
let pomoInterval;

function startPomodoro() {
    pomoInterval = setInterval(() => {
        pomoTime--;
        let min = Math.floor(pomoTime / 60);
        let sec = pomoTime % 60;
        document.getElementById("pomo-timer").textContent = 
            `${min}:${sec.toString().padStart(2, '0')}`;

        if (pomoTime <= 0) {
            clearInterval(pomoInterval);
            notify("Selesai! Waktunya istirahat.");
            pomoTime = 25 * 60;
        }
    }, 1000);
}

function resetPomodoro() {
    clearInterval(pomoInterval);
    pomoTime = 25 * 60;
    document.getElementById("pomo-timer").textContent = "25:00";
}

// --- To-Do List ---
let todos = JSON.parse(localStorage.getItem("todos") || "[]");

function loadTodos() {
    const ul = document.getElementById("todo-list");
    ul.innerHTML = "";
    todos.forEach((t, i) => {
        ul.innerHTML += `<li>${t} <button onclick="delTodo(${i})">X</button></li>`;
    });
}

function addTodo() {
    let text = document.getElementById("todo-input").value;
    if (text) {
        todos.push(text);
        localStorage.setItem("todos", JSON.stringify(todos));
        loadTodos();
    }
}

function delTodo(i) {
    todos.splice(i, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    loadTodos();
}

loadTodos();
