// ====== 顏色設定 ======
const COLORS = {
  red:'#ff6b6b', green:'#3bd671', blue:'#6ea8fe',
  yellow:'#ffcc66', purple:'#9b8cff', teal:'#36d0c6'
};

// ====== 關卡資料 ======
const LEVELS = [
  {id:1, palette:['red','green','blue','yellow'], target:'blue', moveLimit:15},
  {id:2, palette:['red','purple','yellow','blue'], target:'yellow', moveLimit:15},
  {id:3, palette:['teal','blue','green','yellow'], target:'teal', moveLimit:15},
  {id:4, palette:['red','green','blue','purple'], target:'purple', moveLimit:15},
  {id:5, palette:['red','yellow','blue','teal'], target:'teal', moveLimit:15},
  {id:6, palette:['red','green','blue','yellow','purple'], target:'red', moveLimit:15},
  {id:7, palette:['red','green','blue','yellow'], target:'green', moveLimit:15},
  {id:8, palette:['red','purple','yellow','blue'], target:'purple', moveLimit:15},
  {id:9, palette:['teal','blue','green','yellow'], target:'blue', moveLimit:15},
  {id:10,palette:['red','green','blue','purple'], target:'blue', moveLimit:15}
];

// ====== 全域狀態 ======
const state = {
  levelIndex:0,
  grid:[],
  moves:0,
  size:10
};

// ====== 初始化關卡 ======
function initLevel(containerId, levelIndex){
  const container = document.getElementById(containerId);
  const level = LEVELS[levelIndex];
  state.levelIndex = levelIndex;
  state.moves = 0;
  state.size = 10;
  state.grid = [];

  container.innerHTML='';
  container.style.display='grid';
  container.style.gridTemplateColumns = `repeat(${state.size}, 40px)`;
  container.style.gridGap='4px';

  // 隨機生成格子
  for(let i=0;i<state.size;i++){
    const row=[];
    for(let j=0;j<state.size;j++){
      const color = level.palette[Math.floor(Math.random()*level.palette.length)];
      row.push(color);

      const cell = document.createElement('div');
      cell.style.width='40px';
      cell.style.height='40px';
      cell.style.background=COLORS[color];
      cell.style.borderRadius='6px';
      cell.style.cursor='pointer';
      cell.dataset.i=i;
      cell.dataset.j=j;
      cell.dataset.color=color;
      cell.addEventListener('click',()=> onClickCell(i,j,container,level));
      container.appendChild(cell);
    }
    state.grid.push(row);
  }

  // 更新步數顯示
  const movesEl = document.getElementById('moves');
  if(movesEl) movesEl.textContent = state.moves;
  const limitEl = document.getElementById('move-limit');
  if(limitEl) limitEl.textContent = level.moveLimit;
  const targetEl = document.getElementById('target-name');
  if(targetEl) targetEl.textContent = level.target;
}

// ====== 點擊格子染色 ======
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];

function onClickCell(i,j,container,level){
  const fromColor = state.grid[i][j];
  const toColor = level.target; // 目標色為擴散方向

  pushHistory(); // 儲存歷史

  const needColor = fromColor; // 初始來源
  const q=[[i,j]];
  const seen=new Set([i+','+j]);

  while(q.length){
    const [x,y]=q.shift();
    for(const [dx,dy] of DIRS){
      const nx=x+dx, ny=y+dy;
      const key=nx+','+ny;
      if(nx<0||ny<0||nx>=state.size||ny>=state.size) continue;
      if(seen.has(key)) continue;
      if(state.grid[nx][ny]!==fromColor) continue;
      state.grid[nx][ny] = toColor;
      seen.add(key);
      q.push([nx,ny]);
      paintCell(nx,ny,container,toColor);
    }
  }

  state.moves++;
  const movesEl = document.getElementById('moves');
  if(movesEl) movesEl.textContent = state.moves;

  checkWin(container,level);
}

// ====== 更新格子顏色 ======
function paintCell(i,j,container,color){
  const idx = i*state.size + j;
  const cell = container.children[idx];
  if(cell) cell.style.background = COLORS[color];
}

// ====== 歷史復原 ======
state.history=[];
function pushHistory(){
  const snapshot = state.grid.map(r=>r.slice());
  state.history.push({grid:snapshot, moves:state.moves});
  if(state.history.length>40) state.history.shift();
}

function undo(container,level){
  if(!state.history.length) return;
  const last = state.history.pop();
  state.grid = last.grid.map(r=>r.slice());
  state.moves = last.moves;
  const movesEl = document.getElementById('moves');
  if(movesEl) movesEl.textContent = state.moves;
  for(let i=0;i<state.size;i++){
    for(let j=0;j<state.size;j++){
      paintCell(i,j,container,state.grid[i][j]);
    }
  }
}

// ====== 勝負判定 ======
function checkWin(container,level){
  const target = level.target;
  let won = true;
  for(let i=0;i<state.size;i++){
    for(let j=0;j<state.size;j++){
      if(state.grid[i][j]!==target){ won=false; break; }
    }
  }
  if(won){
    alert(`✅ 通關！關卡 ${level.id}`);
    return;
  }
  if(state.moves>=level.moveLimit){
    alert(`❌ 失敗！達到步數上限`);
  }
}

// ====== 提示 ======
function flashHint(container,level){
  alert('提示功能：建議點擊格子以擴散更多格子');
}

// ====== 全域按鈕事件 ======
document.addEventListener('DOMContentLoaded',()=>{
  const levelContainer = document.getElementById('puzzle');
  const levelIndex = 0; // 預設第一關
  initLevel('puzzle', levelIndex);

  const btnUndo = document.getElementById('btn-undo');
  if(btnUndo) btnUndo.addEventListener('click',()=> undo(levelContainer,LEVELS[levelIndex]));
  const btnHint = document.getElementById('btn-hint');
  if(btnHint) btnHint.addEventListener('click',()=> flashHint(levelContainer,LEVELS[levelIndex]));
});
