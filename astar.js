grid_map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 2, 1, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Euclidean distance
function heuristic(node, goal) {
  const [x1, y1] = node;
  const [x2, y2] = goal;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function astarSearch(startNode, goalNode) {
  const frontier = [];
  frontier.push([0, startNode]);
  const g = { [startNode]: 0 };
  const parrent = { [startNode]: null };

  while (frontier.length > 0) {
    const [currentCost, currentNode] = frontier.shift();

    if (currentNode[0] === goalNode[0] && currentNode[1] === goalNode[1]) {
      break;
    }

    const neighbors = getNeighbors(currentNode);
    for (const neighbor of neighbors) {
      const newCost = g[currentNode] + getEdgeWeight(currentNode, neighbor);
      if (!g[neighbor] || newCost < g[neighbor]) {
        g[neighbor] = newCost;
        const priority = newCost + heuristic(neighbor, goalNode);
        frontier.push([priority, neighbor]);
        parrent[neighbor] = currentNode;
      }
    }

    // Tandai node di closed list menjadi -1
    grid_map[currentNode[0]][currentNode[1]] = 5;

    // Tandai node di open list menjadi 4
    for (const [priority, node] of frontier) {
      grid_map[node[0]][node[1]] = 4;
    }

    // Log perubahan grid_map
    // console.log("Grid Map:");
    // console.log(grid_map);
  }

  const path = [];
  let currentNode = goalNode;
  while (currentNode !== startNode) {
    path.push(currentNode);
    currentNode = parrent[currentNode];
  }
  path.push(startNode);
  path.reverse();

  // Tandai path menjadi -2
  for (const node of path) {
    grid_map[node[0]][node[1]] = -2;
  }

  return path;
}

function getNeighbors(node) {
  const [x, y] = node;
  const neighbors = [];

  // Tambah node di atas sbg neighbor
  if (x > 0 && grid_map[x - 1][y] !== 0) {
    neighbors.push([x - 1, y]);
  }

  // Tambah node di bawah sbg neighbor
  if (x < grid_map.length - 1 && grid_map[x + 1][y] !== 0) {
    neighbors.push([x + 1, y]);
  }
  // Tambah node di kiri sbg neighbor
  if (y > 0 && grid_map[x][y - 1] !== 0) {
    neighbors.push([x, y - 1]);
  }
  // Tambah node di kanan sbg neighbor
  if (y < grid_map[x].length - 1 && grid_map[x][y + 1] !== 0) {
    neighbors.push([x, y + 1]);
  }

  return neighbors;
}

function getEdgeWeight(node1, node2) {
  return 1;
}

// Node asal dan tujuan
const startNode = [2, 1];
const goalNode = [20, 9];

const path = astarSearch(startNode, goalNode);
console.log("Path:", path);
