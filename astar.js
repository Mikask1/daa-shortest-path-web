// Euclidean distance
function heuristic(node, goal) {
	const [x1, y1] = node;
	const [x2, y2] = goal;
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

async function astarSearch() {
	var btns = document.getElementsByClassName("btn-fancy");
	document.getElementById("shortest-type").innerText = "A*";

	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = true;
	}

	const startNode = [2, 1];
	const goalNode = [0, 15];
	const map = JSON.parse(JSON.stringify(Map.grid_map));

	// Set of discovered nodes that may need to be re-expanded.
	const frontier = [];
	frontier.push([0, startNode]);

	// For node n, g[n] is the cost of shortest path from start node to n
	const g = { [startNode]: 0 };
	// For node n, parrent[n] is the node just prior to n on the shortes path
	const parrent = { [startNode]: null };

	while (frontier.length > 0) {
		// Current node = node with the lowest F cost
		frontier.sort((a, b) => a[0] - b[0]);
		const currentNode = frontier.shift()[1];

		// Goal found, exit loop then print the path
		if (currentNode[0] === goalNode[0] && currentNode[1] === goalNode[1]) {
			break;
		}

		const neighbors = getNeighbors(map, currentNode);
		for (const neighbor of neighbors) {
			const newCost = g[currentNode] + getEdgeWeight(currentNode, neighbor);

			// If neighbor not yet visited (g[neighbor] not calculated)
			// or we found shorter path to node neighbor
			if (!g[neighbor] || newCost < g[neighbor]) {
				g[neighbor] = newCost;
				const priority = newCost + heuristic(neighbor, goalNode);
				frontier.push([priority, neighbor]);
				parrent[neighbor] = currentNode;
			}
		}

		// Mark the current node as visited
		map[currentNode[0]][currentNode[1]] = Map.explored;

		// Map the remaining nodes in the open list
		for (const [priority, node] of frontier) {
			map[node[0]][node[1]] = Map.open;
		}

		await render(map);
	}

	// Reconstruct path
	const path = [];
	let currentNode = goalNode;
	while (currentNode !== startNode) {
		path.push(currentNode);
		currentNode = parrent[currentNode];
	}
	path.push(startNode);
	path.reverse();

	// Mark the shortest path
	for (const node of path) {
		map[node[0]][node[1]] = Map.shortest;
		await render(map);
	}

	// Mark the start and goal node
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
