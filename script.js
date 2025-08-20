const COLORS = ['red','green','blue','yellow','purple','teal'];
const COLOR_HEX = {
  red:'#ff6b6b', green:'#3bd671', blue:'#6ea8fe',
  yellow:'#ffcc66', purple:'#9b8cff', teal:'#36d0c6'
};
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];

function initLevel(containerId, size=10, palette=COLORS, targetColor='red') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${size}, 40px)`;

  // 初始化格子
  let grid = [];
  for(let i=0;i<size;i++){
    let row=[];
    for(let j=0;j<size;j++){
      const color = palette[Math.floor(Math.random()*palette.length)];
      row.push(color);
      const cell = document.createElement('div');
      cell.className='cell';
      cell.style.background=COLOR_HEX[color];
      cell.dataset.i=i;
      cell.dataset.j=j;
      container.appendChild(cell);
    }
    grid.push(row);
  }

  function paintCell(i,j,color){
    grid[i][j]=color;
    const idx = i*size+j;
    container.children[idx].style.background=COLOR_HEX[color];
  }

  container.addEventListener('click', e=>{
    if(!e.target.classList.contains('cell')) return;
    const i=parseInt(e.target.dataset.i);
    const j=parseInt(e.target.dataset.j);
    const fromColor = grid[i][j];
    const needColor = palette[(palette.indexOf(fromColor)+1)%palette.length];
    const seen = new Set();
    const q=[[i,j]]; seen.add(`${i},${j}`);
    while(q.length){
      const [x,y] = q.shift();
      for(const [dx,dy] of DIRS){
        const nx=x+dx, ny=y+dy;
        if(nx<0||ny<0||nx>=size||ny>=size) continue;
        const key=`${nx},${ny}`;
        if(seen.has(key)) continue;
        if(grid[nx][ny]===needColor){
          paintCell(nx,ny,fromColor);
          q.push([nx,ny]);
          seen.add(key);
        }
      }
    }
    paintCell(i,j,fromColor);
    checkWin();
  });

  function checkWin(){
    let done = grid.every(r=>r.every(c=>c===targetColor));
    if(done) alert('🎉 通關！');
  }
}
