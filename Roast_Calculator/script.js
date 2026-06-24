/**
 * ROAST CALCULATOR & HIDDEN MINI-GAME
 * Mobile-Friendly Edition (Trigger code: 404 + '=')
 */

// --- STATE MANAGEMENT ---
const state = {
  userLevel: 1,
  expression: "",
  soundEnabled: true,
};

// Gen Z Roasts Array
const roasts = [
  "Seriously?",
  "Calculator khola hai ya tuition?",
  "Even your little cousin knows this.",
  "NASA Engineer? Really?",
  "My code runs faster than your brain.",
  "Are you sure you didn't mean to open TikTok?",
  "Bro is struggling with basic math 💀",
  "Did you skip 2nd grade?",
  "Your phone is too smart for you.",
];

// --- UI CONTROLLERS ---
const screens = {
  intro: document.getElementById("intro-screen"),
  calc: document.getElementById("calc-screen"),
  game: document.getElementById("game-screen"),
};

function switchScreen(screenName) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  setTimeout(() => {
    screens[screenName].classList.add("active");
  }, 50);
}

// Setup Level Selection
document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.id === "restart-btn" || e.target.id === "exit-game-btn")
      return;

    state.userLevel = parseInt(e.target.getAttribute("data-level"));
    document.getElementById("level-badge").innerText = e.target.innerText;
    switchScreen("calc");
  });
});

// Sound Toggle
document.getElementById("sound-toggle").addEventListener("click", (e) => {
  state.soundEnabled = !state.soundEnabled;
  e.target.innerText = state.soundEnabled ? "🔊" : "🔇";
});

// --- CALCULATOR LOGIC ---
const display = document.getElementById("calc-display");
const roastBox = document.getElementById("roast-box");

function updateDisplay(val) {
  display.value = val;
}

function handleInput(val) {
  roastBox.innerText = ""; // Clear previous roast

  if (val === "C") {
    state.expression = "";
  } else if (val === "DEL") {
    state.expression = state.expression.slice(0, -1);
  } else if (val === "=") {
    calculateResult();
    return;
  } else {
    // Prevent multiple operators
    const lastChar = state.expression.slice(-1);
    if (
      ["+", "-", "*", "/", "%"].includes(val) &&
      ["+", "-", "*", "/", "%"].includes(lastChar)
    ) {
      return;
    }
    state.expression += val;
  }
  updateDisplay(state.expression);
}

function calculateDifficulty(expr) {
  let score = 0;
  if (expr.includes("+") || expr.includes("-")) score = 1;
  if (expr.includes("*") || expr.includes("/")) score = 2;

  const numbers = expr.split(/[\+\-\*\/]/);
  const hasLargeNumbers = numbers.some((num) => parseFloat(num) > 50);
  if (hasLargeNumbers) score += 2;
  if (numbers.length > 2) score += 1;

  return score;
}

function calculateResult() {
  try {
    if (!state.expression) return;

    // --- MOBILE SECRET CODE TRIGGER ---
    // If user types 404 and presses '='
    if (state.expression === "404") {
      updateDisplay("Error404");
      roastBox.innerText = "You have unlocked the secret game";
      triggerGlitch();
      return;
    }

    // Assess difficulty BEFORE solving
    const diffScore = calculateDifficulty(state.expression);

    // Safe evaluation
    const result = new Function("return " + state.expression)();

    // Judgment Time
    if (state.userLevel > 2 && diffScore < 2) {
      roastBox.innerText = roasts[Math.floor(Math.random() * roasts.length)];
    } else if (state.userLevel >= 5 && diffScore < 4) {
      roastBox.innerText = "Too easy for a 'Genius'.";
    }

    state.expression = Number.isInteger(result)
      ? result.toString()
      : result.toFixed(4);
    updateDisplay(state.expression);
  } catch (error) {
    roastBox.innerText = "Math error. Brain not found.";
    state.expression = "";
    updateDisplay("Error");
  }
}

// Bind Calculator Buttons
document.querySelectorAll(".calc-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    handleInput(e.target.getAttribute("data-val"));
  });
});

// --- GLITCH EFFECT CONTROLLER ---
function triggerGlitch() {
  const app = document.getElementById("app-container");
  app.classList.add("glitch-mode");

  setTimeout(() => {
    app.classList.remove("glitch-mode");
    switchScreen("game");
    initGame();
  }, 2000);
}

// --- MINI GAME: BALLANCED & MOBILE OPTIMIZED ---
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let gameLoop, gameTime;
let isGameOver = false;

const player = { x: 135, y: 300, size: 20, speed: 6 };
let bugs = [];
let keys = { ArrowLeft: false, ArrowRight: false };

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Touch controls for mobile responsiveness
canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    let touchX = touch.clientX - rect.left;
    player.x = Math.max(
      0,
      Math.min(canvas.width - player.size, touchX - player.size / 2),
    );
  },
  { passive: false },
);

function spawnBug() {
  // Balanced spawn rates for a smooth difficulty ramp
  if (Math.random() < 0.025) {
    bugs.push({
      x: Math.random() * (canvas.width - 15),
      y: -20,
      size: 15,
      speed: 1.5 + Math.random() * 1.5,
    });
  }
}

function updateGame() {
  if (isGameOver) return;

  // Movement
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x < canvas.width - player.size)
    player.x += player.speed;

  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Player
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Update & Draw Bugs
  ctx.fillStyle = "#ef4444";
  for (let i = 0; i < bugs.length; i++) {
    let b = bugs[i];
    b.y += b.speed;
    ctx.fillRect(b.x, b.y, b.size, b.size);

    // Collision Check (AABB)
    if (
      player.x < b.x + b.size &&
      player.x + player.size > b.x &&
      player.y < b.y + b.size &&
      player.y + player.size > b.y
    ) {
      endGame();
    }
  }

  // Clean up off-screen bugs
  bugs = bugs.filter((b) => b.y < canvas.height);

  spawnBug();
  gameLoop = requestAnimationFrame(updateGame);
}

function initGame() {
  isGameOver = false;
  bugs = [];
  player.x = 135;
  gameTime = 0;

  // Hide panel completely on start/restart
  document.getElementById("game-over-panel").classList.add("hidden");
  document.getElementById("game-timer").innerText = "0s";

  // Timer
  const timerInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(timerInterval);
    } else {
      gameTime++;
      document.getElementById("game-timer").innerText = gameTime + "s";
    }
  }, 1000);

  updateGame();
}

function endGame() {
  isGameOver = true;
  cancelAnimationFrame(gameLoop);
  document.getElementById("final-score").innerText =
    `Survived: ${gameTime} seconds`;
  document.getElementById("game-over-panel").classList.remove("hidden");
}

// Game Over Panel Event Handling
document.getElementById("restart-btn").addEventListener("click", initGame);
document.getElementById("exit-game-btn").addEventListener("click", () => {
  switchScreen("calc");
  state.expression = "";
  updateDisplay("0");
});
