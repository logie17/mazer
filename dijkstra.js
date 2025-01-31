export const findPath = (maze, start, end) => {
  let _queue = [];
  let distances = {};

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (start.x == x && start.y == y) {
        maze[x][y].dist = 0;
        maze[x][y].current = true;
        distances[`[${x},${y}]`] = 0;
      } else {
        maze[x][y].dist = Infinity;
        distances[`[${x},${y}]`] = Infinity;
      }
      maze[x][y].prev = undefined;
      maze[x][y]._visited = false;
      _queue.push(maze[x][y]);
    }
  }

  while (_queue.length || !_queue.find(c => c.dist == Infinity)) {
    _queue.sort((a, b) => a.dist - b.dist);
    const cell = _queue.pop();

    const neighbors = [
      [maze[cell.coords[0] - 1]?.[cell.coords[1]], 'top'],
      [maze[cell.coords[0] + 1]?.[cell.coords[1]], 'bottom'],
      [maze[cell.coords[0]]?.[cell.coords[1] - 1], 'left'],
      [maze[cell.coords[0]]?.[cell.coords[1] + 1], 'right'],
    ];

    const unvisitedNeighbors = neighbors.filter(n => {
      return !n[0]._visited && !cell.walls.include(n[1]);
    });

    for (const n of unvisitedNeighbors) {
      const newDist = cell.dist + 1;
      if (newDist < n.dist) {
        distances[`[${n[0].coords[0]},${n[0].coords[1]}]`] = n
      }
    }
    
    
  }

  
}
