const canvas = document.getElementsByClassName("sandCanvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

const cellSize = 4;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);
const grid = [];

let currentColor = "black"
let brushSize = 1;

for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = 0;
    }
  }
  

const brushSlider = document.getElementById("brushSize");
const brushValue = document.getElementById("brushValue");

brushSlider.addEventListener("input", () => {
    brushSize = parseInt(brushSlider.value);
    brushValue.textContent = brushSize;
});


document.querySelectorAll(".colors").forEach(btn => {
    btn.addEventListener("click", () => {
        currentColor = btn.style.backgroundColor;
    });
});


const clearbutton=document.getElementsByClassName("clear")[0];
clearbutton.addEventListener("click",()=>{
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          grid[y][x] = null;
        }
      }
})

let isDrawing = false;

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    updateMouse(event);
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("mousemove", (event) => {
    updateMouse(event);
});

function updateMouse(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}




function renderGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x]) {
          ctx.fillStyle = grid[y][x].color;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
}

function updateGrid() {
    for (let y = rows - 2; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
            const cell = grid[y][x];
            if (!cell) continue;

            cell.vy += 0.2;
            cell.vy = Math.min(cell.vy, 3);
            const fall = Math.floor(cell.vy);

            let targetY = y;
            for (let i = 1; i <= fall; i++) {
                const ny = y + i;
                if (ny >= rows || grid[ny][x]) break;
                targetY = ny;
            }

            if (targetY !== y) {
                grid[targetY][x] = cell;
                grid[y][x] = null;
                continue; 
            }

            const dirs = Math.random() < 0.5 ? [1, -1] : [-1, 1];
            for (let dx of dirs) {
                const nx = x + dx;
                const ny = y + 1;
                if (
                    nx >= 0 && nx < cols &&
                    ny < rows &&
                    !grid[ny][nx] &&
                    grid[ny][x] 
                ) {
                    grid[ny][nx] = cell;
                    grid[y][x] = null;
                    break;
                }
            }
        }
    }
}


function loop() {
    if (isDrawing) {
        const cellX = Math.floor(mouseX / cellSize);
        const cellY = Math.floor(mouseY / cellSize);

        const half = Math.floor(brushSize / 2);
        
        for (let dy = -half; dy <= half; dy++) {
            for (let dx = -half; dx <= half; dx++) {
                const px = cellX + dx;
                const py = cellY + dy;
                if (px >= 0 && px < cols && py >= 0 && py < rows) {
                    if(!grid[py][px]){
                    grid[py][px] = {
                        color: currentColor,
                        vy: 0
                      };
                    }
                }
            }
        }

    }

    
    updateGrid();    
    renderGrid();     
    requestAnimationFrame(loop); 
}
loop(); 
