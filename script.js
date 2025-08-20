function initPuzzle(containerId, image, size = 3) {
  const container = document.getElementById(containerId);
  container.style.gridTemplateColumns = `repeat(${size}, 100px)`;

  let pieces = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.style.backgroundImage = `url(${image})`;
      piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
      piece.dataset.correct = `${row}-${col}`;
      pieces.push(piece);
    }
  }

  // 打亂拼圖
  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => container.appendChild(p));

  let first = null;
  container.addEventListener("click", e => {
    if (!e.target.classList.contains("piece")) return;
    if (!first) {
      first = e.target;
      first.style.outline = "2px solid yellow";
    } else {
      let second = e.target;
      let tmp = document.createElement("div");
      container.insertBefore(tmp, first);
      container.insertBefore(first, second);
      container.insertBefore(second, tmp);
      container.removeChild(tmp);
      first.style.outline = "none";
      first = null;

      checkWin(container, size);
    }
  });
}

function checkWin(container, size) {
  const pieces = [...container.children];
  let win = pieces.every((p, i) => {
    let row = Math.floor(i / size);
    let col = i % size;
    return p.dataset.correct === `${row}-${col}`;
  });
  if (win) {
    alert("🎉 完成拼圖！");
  }
}
