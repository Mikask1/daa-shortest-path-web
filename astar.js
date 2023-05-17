// Euclidean distance
function heuristic(node, goal) {
	const [x1, y1] = node;
	const [x2, y2] = goal;
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

async function astarSearch() {
  var btns = document.getElementsByClassName("btn-fancy");

	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = true;
	}

	const startNode = [2, 1];
	const goalNode = [0, 15];
	const map = JSON.parse(JSON.stringify(Map.grid_map));
	const frontier = [];
	frontier.push([0, startNode]);
	const g = { [startNode]: 0 };
	const parrent = { [startNode]: null };

	while (frontier.length > 0) {
		const [currentCost, currentNode] = frontier.shift();

		if (currentNode[0] === goalNode[0] && currentNode[1] === goalNode[1]) {
			break;
		}

		const neighbors = getNeighbors(map, currentNode);
		for (const neighbor of neighbors) {
			const newCost =
				g[currentNode] + getEdgeWeight(currentNode, neighbor);
			if (!g[neighbor] || newCost < g[neighbor]) {
				g[neighbor] = newCost;
				const priority = newCost + heuristic(neighbor, goalNode);
				frontier.push([priority, neighbor]);
				parrent[neighbor] = currentNode;
			}
		}

		// Tandai node di closed list menjadi -1
		if (map[currentNode[0]][currentNode[1]] !== Map.goal) {
			map[currentNode[0]][currentNode[1]] = Map.explored;
		}

		// Tandai node di open list menjadi 4
		for (const [priority, node] of frontier) {
			map[node[0]][node[1]] = Map.open;
		}

		await render(map);
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
		map[node[0]][node[1]] = Map.shortest;
		await render(map);
	}

	map[goalNode[0]][goalNode[1]] = Map.goal;
	map[startNode[0]][startNode[1]] = Map.start;
	await render(map);
  
  for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = false;
	}

}

function getNeighbors(map, node) {
	let [x, y] = node;
	x = Number(x);
	y = Number(y);
	const neighbors = [];

	// Tambah node di atas sbg neighbor
	if (x > 0 && map[x - 1][y] !== 0) {
		neighbors.push([x - 1, y]);
	}

	// Tambah node di bawah sbg neighbor
	if (x < map.length - 1 && map[x + 1][y] !== 0) {
		neighbors.push([x + 1, y]);
	}
	// Tambah node di kiri sbg neighbor
	if (y > 0 && map[x][y - 1] !== 0) {
		neighbors.push([x, y - 1]);
	}
	// Tambah node di kanan sbg neighbor
	if (y < map[x].length - 1 && map[x][y + 1] !== 0) {
		neighbors.push([x, y + 1]);
	}

	return neighbors;
}

function getEdgeWeight(node1, node2) {
	return 1;
}
