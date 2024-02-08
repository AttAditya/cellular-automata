var speed = 500;
var mode = "edit";
var board = null;

var intervals = [];

function createGrid(w, h) {
    let grid = [];
    
    for (let y = 0; y < h; y++) {
        grid.push([]);

        for (let x = 0; x < w; x++) {
            grid[y].push(0);
        }
    }

    return grid;
}

function nextState(currentState, converter) {
    let nextState = createGrid(currentState[0].length, currentState.length);

    for (let y = 0; y < currentState.length; y++) {
        for (let x = 0; x < currentState[y].length; x++) {
            nextState[y][x] = converter(currentState, x, y);
        }
    }

    return nextState;
}

function countNeighbors(state, x, y) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
                continue;
            }

            if (state[(state.length + y + i) % state.length][(state[0].length + x + j) % state[0].length] == 1) {
                count++;
            }
        }
    }

    return count;
}

function habitability(state, x, y) {
    let neighbors = countNeighbors(state, x, y);

    if (state[y][x] == 0 && neighbors == 3) {
        return 1;
    }

    if (state[y][x] == 1 && (neighbors < 2 || neighbors > 3)) {
        return 0;
    }
    
    return state[y][x];
}

function draw() {
    let container = document.getElementById("board");
    container.innerHTML = "";

    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            let fillMode = board[y][x] == 1 ? "fa-solid" : "fa-regular";
            container.innerHTML += `<i class="${fillMode} fa-square" x="${x}" y="${y}"></i> `;
        }
        container.innerHTML += "<br>";
    }
}

function update() {
    board = nextState(board, (state, x, y) => habitability(state, x, y));
    draw();

    if (board.every((row) => row.every((cell) => cell == 0))) {
        mode = "edit";
        clearInterval(intervals[0]);
        intervals = [];
    }
}

function start() {
    mode = "play";
    draw();
    intervals.push(setInterval(() => {
        if (mode == "play") {
            update();
        }
    }, speed));
}

function pause() {
    mode = "edit";
    intervals.forEach((interval) => clearInterval(interval));
    intervals = [];
}

document.getElementById("board").addEventListener("click", (event) => {
    if (mode != "edit") {
        return;
    }
    
    if (!event.target.classList.contains("fa-square")) {
        return;
    }

    let x = event.target.getAttribute("x");
    let y = event.target.getAttribute("y");

    board[y][x] = board[y][x] == 1 ? 0 : 1;
    
    event.target.classList.toggle("fa-solid");
    event.target.classList.toggle("fa-regular");
});

