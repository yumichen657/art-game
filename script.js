const paletteDiv = document.getElementById("palette");
const board = document.getElementById("board");
const status = document.getElementById("status");
const stepsLeft = document.getElementById("steps");
const nextBtn = document.getElementById("next");

let selectedColor = null;
let currentLevel = 0;
let steps = 0;
let cells = [];
let size = 5; // 預設 5x5

// 多關卡資料
const levels = [
  {
    grid: [
      "red","red","blue","blue","green",
      "yellow","yellow","blue","green","green",
      "red","yellow","blue","blue","green",
      "red","red","red","yellow","yellow",
      "green","green","blue","yellow","red"
    ],
    colors: ["red","blue","green","yellow"],
    steps: 8,
    final: "yellow"
  },
  {
    grid: [
      "green","green","green","blue","blue",
      "red","red","yellow","blue","blue",
      "red","yellow","yellow","yellow","blue",
      "green","green","red","red","red",
      "yellow","yellow","blue","blue","yellow"
    ],
    colors: ["red","blue","green","yellow"],
    steps: 10,
    final: "red"
  }
];

// 建立調色盤
function buildPalette(colors) {
  paletteDiv.innerHTML = "";
  colors.forEach(c => {
    const btn = document.createElement("button");
    btn.classList.add("color");
    btn.style.background = c;
    btn.dataset.color = c;
    btn.addEventListener("click", () => {
      if (steps <= 0) return;
      floodFill(c); // 一鍵染色
    });
    paletteDiv.appendChild(btn);
  });
}

// 建立關卡
function buildLevel(level) {
  board.innerHTML = "";
  cells = [];
  steps = level.steps;
  stepsLeft.textContent = `剩餘步數：${steps}`;
  status.textContent = "開始染色吧！";

  buildPalette(level.colors);

  board.style.gridTemplateColumns = `repeat(${size}, 60px)`;

  level.grid.forEach((color, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.style.background = color;
    div.dataset.color = color;
    div.dataset.index = i;
    board.appendChild(div);
    cells.push(div);
  });
}

// 一鍵整片染色（類似鳴潮玩法）
function floodFill(newColor) {
  const oldColor = cells[0].dataset.color;
  if (oldColor === newColor) return;
  if (steps <= 0) return;

  const queue = [0];
  const visited = new Set();

  while (queue.length) {
    const index = queue.shift();
    if (visited.has(index)) continue;
    visited.add(index);

    const cell = cells[index];
    if (cell.dataset.color !== oldColor) continue;

    cell.dataset.color = newColor;
    cell.style.background = newColor;
    cell.classList.add("colored");

    const x = index % size;
    const y = Math.floor(index / size);

    // 上下左右
    const neighbors = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y]
    ];

    neighbors.forEach(([nx, ny]) => {
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        queue.push(ny * size + nx);
      }
    });
  }

  steps--;
  stepsLeft.textContent = `剩餘步數：${steps}`;
  checkWin(levels[currentLevel]);
}

// 檢查過關條件
function checkWin(level) {
  const allFinal = cells.every(c => c.dataset.color === level.final);

  if (allFinal && steps >= 0) {
    status.textContent = `✅ 通關！最終顏色：${level.final}`;
    nextBtn.style.display = "inline-block";
  } else if (steps === 0 && !allFinal) {
    status.textContent = "❌ 失敗！步數用完了";
  }
}

// 下一關
nextBtn.addEventListener("click", () => {
  currentLevel++;
  if (currentLevel < levels.length) {
    buildLevel(levels[currentLevel]);
    nextBtn.style.display = "none";
  } else {
    status.textContent = "🎉 所有關卡完成！";
    nextBtn.style.display = "none";
  }
});

// 初始化第一關
buildLevel(levels[currentLevel]);
