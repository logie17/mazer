const maze = [];
for (let x = 0; x < 10; x++) {
  maze[x] = [];
  for (let y = 0; y < 10; y++) {
    maze[x][y] = {
      _visited: false,
      coords: [x, y],
      walls: { top: true, right: true, bottom: true, left: true },
    };
  }
}

let randomStartx;
let randomStarty;
let randomEndx;
let randomEndy;

export const buildMaze = () => {
  const _buildMaze = (cell) => {
    cell._visited = true;

    const neighbors = [
      [maze[cell.coords[0] - 1]?.[cell.coords[1]], "top"],
      [maze[cell.coords[0] + 1]?.[cell.coords[1]], "bottom"],
      [maze[cell.coords[0]]?.[cell.coords[1] - 1], "left"],
      [maze[cell.coords[0]]?.[cell.coords[1] + 1], "right"],
    ];

    const unvisitedNeighbors = [];
    for (const n of neighbors) {
      if (n && n[0] && !n[0]._visited) {
        unvisitedNeighbors.push(n);
      }
    }

    while (unvisitedNeighbors.length) {
      const idx = parseInt(Math.random() * unvisitedNeighbors.length);
      const neighbor = unvisitedNeighbors.splice(idx, 1)[0];
      const neighborCell = neighbor[0];
      const wall = neighbor[1];

      if (!neighborCell._visited) {
        const neighborWall = wall == "top" && "bottom" ||
          wall == "bottom" && "top" ||
          wall == "left" && "right" ||
          wall == "right" && "left";
        cell.walls[wall] = false;
        neighborCell.walls[neighborWall] = false;
        _buildMaze(neighborCell);
      }
    }
  };

  randomStartx = parseInt(Math.random() * maze.length);
  randomStarty = parseInt(Math.random() * maze[randomStartx].length);

  randomEndx = parseInt(Math.random() * maze.length);
  randomEndy = parseInt(Math.random() * maze[randomEndx].length);

  _buildMaze(maze[randomStartx][randomStarty]);
  return {
    maze,
    start: maze[randomStartx][randomStarty],
    end: maze[randomEndx][randomEndy],
  };
};

export const aStar = (start, goal, h, graph, maze) => {
  const openSet = new Set([start]);
  const closedSet = new Set();
  const cameFrom = new Map();

  start.g = 0;
  start.h = h(start, goal);
  start.parent = null;

  while (openSet.size > 0) {
    const current = Array.from(openSet).reduce((
      a,
      b,
    ) => (a.g + a.h < b.g + b.h ? a : b));

    if (
      current.coords[0] === goal.coords[0] &&
      current.coords[1] === goal.coords[1]
    ) {
      const path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom.get(temp);
      }
      return path.reverse();
    }

    openSet.delete(current);
    closedSet.add(current);

    for (
      const neighborCoords
        of graph[`[${current.coords[0]},${current.coords[1]}]`]
    ) {
      const neighborCoordsArray = JSON.parse(neighborCoords);
      const neighbor = maze[neighborCoordsArray[0]][neighborCoordsArray[1]];
      if (closedSet.has(neighbor)) {
        continue;
      }
      neighbor.g = current.g + 1; // Assuming uniform cost
      neighbor.h = h(neighbor, goal);
      neighbor.parent = current;

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
        cameFrom.set(neighbor, current);
      }
    }
  }
};

export const mazeToGraph = (maze) => {
  let graph = {};
  for (let x = 0; x < maze.length; x++) {
    for (let y = 0; y < maze[x].length; y++) {
      const cell = maze[x][y];
      const possibleNeighbors = {
        top: maze[cell.coords[0] - 1]?.[cell.coords[1]],
        bottom: maze[cell.coords[0] + 1]?.[cell.coords[1]],
        left: maze[cell.coords[0]]?.[cell.coords[1] - 1],
        right: maze[cell.coords[0]]?.[cell.coords[1] + 1],
      };
      for (const wall of Object.keys(cell.walls)) {
        if (cell.walls[wall]) {
          delete possibleNeighbors[wall];
        }
      }

      graph[`[${x},${y}]`] = [];
      for (const n of Object.values(possibleNeighbors)) {
        graph[`[${x},${y}]`].push(JSON.stringify(n.coords));
      }
    }
  }
  return graph;
};

export const renderMaze = (mazeEl, maze) => {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const cell = maze[x][y];
      const coords = cell.coords;

      const cellEl = document.createElement("div");
      const wallLeft = document.createElement("div");
      wallLeft.classList.add("wall-left");
      const wallTop = document.createElement("div");
      wallTop.classList.add("wall-top");
      wallLeft.style = `top: ${coords[0] * 50}px; left: ${coords[1] * 50}px;`;
      wallTop.style = `top: ${coords[0] * 50}px; left: ${coords[1] * 50}px;`;

      cellEl.classList.add("cell");
      cellEl.style.left = `${coords[1] * 50 + (x > 0 && y > 0 ? 1 : 0)}px`;
      cellEl.style.top = `${coords[0] * 50 + (x > 0 && y > 0 ? 1 : 0)}px`;
      cellEl.id = `cell-${x}-${y}`;

      if (randomStartx == x && randomStarty == y) {
        cellEl.innerHTML = "Start";
      }

      if (randomEndx == x && randomEndy == y) {
        cellEl.innerHTML = "End";
      }

      for (const [key, val] of Object.entries(cell.walls)) {
        if (key == "top" && !val) {
          wallTop.style.background = "none";
        }
        if (key == "left" && !val) {
          wallLeft.style.background = "none";
        }
      }
      mazeEl.appendChild(cellEl);
      if (x > 0) {
        mazeEl.appendChild(wallTop);
      }
      if (y > 0) {
        mazeEl.appendChild(wallLeft);
      }
    }
  }
};
