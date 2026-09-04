const SCRIPT_URL = "GANTI_DENGAN_WEB_APP_URL_ANDA";

let currentUser = "";
let score = 0;
let gameInterval;
let isJumping = false;
let jumpVelocity = 0;
let playerY = 150;
let obstacleX = 600;

// Auth Functions
async function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "login", username: user, password: pass })
  });
  const result = await res.json();
  
  if (result.status === "success") {
    currentUser = user;
    document.getElementById("auth-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("player-name").innerText = currentUser;
    loadLeaderboard();
    startGame();
  } else {
    document.getElementById("auth-msg").innerText = result.message;
  }
}

async function register() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "register", username: user, password: pass })
  });
  const result = await res.json();
  document.getElementById("auth-msg").innerText = result.message;
}

// Leaderboard Functions
async function loadLeaderboard() {
  const res = await fetch(`${SCRIPT_URL}?action=getLeaderboard`);
  const result = await res.json();
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  
  result.leaderboard.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.username}: ${item.score}`;
    list.appendChild(li);
  });
}

async function saveScore(finalScore) {
  await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "saveScore", username: currentUser, score: finalScore })
  });
  loadLeaderboard();
}

// 2D Game Logic
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    isJumping = true;
    jumpVelocity = -12;
  }
});

function startGame() {
  score = 0;
  playerY = 150;
  obstacleX = 600;
  gameInterval = setInterval(updateGame, 1000 / 60);
}

function updateGame() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update Player (Jump Physics)
  if (isJumping) {
    playerY += jumpVelocity;
    jumpVelocity += 0.6; // gravitasi
    if (playerY >= 150) {
      playerY = 150;
      isJumping = false;
    }
  }

  // Draw Player (Kotak Biru)
  ctx.fillStyle = "#007bff";
  ctx.fillRect(50, playerY, 30, 30);

  // Update & Draw Obstacle (Kotak Merah)
  obstacleX -= 5;
  if (obstacleX < -20) {
    obstacleX = 600;
    score += 10;
    document.getElementById("score").innerText = score;
  }
  ctx.fillStyle = "#dc3545";
  ctx.fillRect(obstacleX, 150, 20, 30);

  // Collision Detection
  if (
    50 < obstacleX + 20 &&
    50 + 30 > obstacleX &&
    playerY + 30 > 150
  ) {
    clearInterval(gameInterval);
    alert(`Game Over! Skor Anda: ${score}`);
    saveScore(score);
    startGame();
  }
                            }
