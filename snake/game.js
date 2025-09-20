const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const speedSelect = document.getElementById("speed");

const GRID_SIZE = 24; // 单元格大小
const CELL_COUNT = canvas.width / GRID_SIZE; // 棋盘每边格子数

const COLORS = {
  board: "#0f172a",
  snake: "#22d3ee",
  snakeHead: "#38bdf8",
  food: "#f97316",
  grid: "rgba(148, 163, 184, 0.12)",
};

let gameInterval = null;
let tickDelay = Number(speedSelect.value);
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let highScore = Number(localStorage.getItem("snake-high-score") ?? 0);
let isPaused = false;
let gameOver = false;

function init() {
  snake = [
    { x: 6, y: 10 },
    { x: 5, y: 10 },
    { x: 4, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  food = spawnFood();
  score = 0;
  gameOver = false;
  isPaused = false;
  updateScore();
  updateHighScore();
  hideMessage();

  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(gameLoop, tickDelay);
  draw();
}

function spawnFood() {
  while (true) {
    const x = Math.floor(Math.random() * CELL_COUNT);
    const y = Math.floor(Math.random() * CELL_COUNT);
    if (!snake.some((segment) => segment.x === x && segment.y === y)) {
      return { x, y };
    }
  }
}

function updateScore() {
  scoreEl.textContent = score.toString();
}

function updateHighScore() {
  highScore = Math.max(highScore, score);
  highScoreEl.textContent = highScore.toString();
  localStorage.setItem("snake-high-score", highScore);
}

function drawGrid() {
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 1; i < CELL_COUNT; i++) {
    const pos = i * GRID_SIZE;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
    ctx.stroke();
  }
}

function draw() {
  ctx.fillStyle = COLORS.board;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  ctx.fillStyle = COLORS.food;
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snake;
    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  });
}

function gameLoop() {
  if (gameOver || isPaused) {
    return;
  }
  direction = nextDirection;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (isCollision(head)) {
    return handleGameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScore();
    updateHighScore();
    food = spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function isCollision(position) {
  const hitWall =
    position.x < 0 ||
    position.y < 0 ||
    position.x >= CELL_COUNT ||
    position.y >= CELL_COUNT;

  const hitSelf = snake.some(
    (segment, index) => index !== 0 && segment.x === position.x && segment.y === position.y
  );

  return hitWall || hitSelf;
}

function handleGameOver() {
  gameOver = true;
  clearInterval(gameInterval);
  showMessage(`游戏结束！你的得分为 ${score}。点击“重新开始”再来一次吧！`);
}

function pauseGame() {
  isPaused = true;
  showMessage("游戏已暂停，按空格继续。");
}

function resumeGame() {
  isPaused = false;
  hideMessage();
}

function togglePause() {
  if (gameOver) return;
  isPaused ? resumeGame() : pauseGame();
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");
}

function hideMessage() {
  messageEl.classList.add("hidden");
  messageEl.textContent = "";
}

function changeDirection(x, y) {
  if (gameOver || isPaused) return;
  const isOpposite = direction.x + x === 0 && direction.y + y === 0;
  if (!isOpposite) {
    nextDirection = { x, y };
  }
}

function handleKeydown(event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      changeDirection(0, -1);
      break;
    case "ArrowDown":
    case "s":
    case "S":
      changeDirection(0, 1);
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      changeDirection(-1, 0);
      break;
    case "ArrowRight":
    case "d":
    case "D":
      changeDirection(1, 0);
      break;
    case " ":
    case "Spacebar":
      event.preventDefault();
      togglePause();
      break;
    default:
      break;
  }
}

function handleSpeedChange() {
  tickDelay = Number(speedSelect.value);
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(gameLoop, tickDelay);
}

restartBtn.addEventListener("click", init);
document.addEventListener("keydown", handleKeydown);
speedSelect.addEventListener("change", handleSpeedChange);

window.addEventListener("load", () => {
  updateHighScore();
  init();
});
