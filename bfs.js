let map = [];

let queue = [];
let parent = { [[2, 1]]: null };

// Start Node
queue.push([2, 1]);

function addNeighbors(coord) {
	checkNeighbor([coord[0] - 1, coord[1]], coord);

	checkNeighbor([coord[0], coord[1] + 1], coord);

	checkNeighbor([coord[0] + 1, coord[1]], coord);

	checkNeighbor([coord[0], coord[1] - 1], coord);
}

function checkNeighbor(coord, parentCoord) {
	const x = coord[1];
	const y = coord[0];

	// console.log(coord, queue);
	if (x >= Map.xLength) return false;
	if (x < 0) return false;
	if (y >= Map.yLength) return false;
	if (y < 0) return false;

	const coordValue = map[y][x];
	if (
		coordValue != Map.path &&
		coordValue != Map.goal &&
		coordValue != Map.open
	) {
		return false;
	}

	queue.push(coord);

	if (coordValue != Map.goal) {
		map[coord[0]][coord[1]] = Map.open;
	}
	parent[coord] = parentCoord;
}

async function run() {
	map = JSON.parse(JSON.stringify(Map.grid_map));
	queue = [];
	parent = { [[2, 1]]: null };

	// Start Node
	queue.push([2, 1]);
	goalCoord = [];

	await render(map);
	while (queue.length) {
		const currCoord = queue.shift();
		const currValue = map[currCoord[0]][currCoord[1]];

		if (currValue == Map.goal) {
			goalCoord = currCoord;
			break;
		}

		map[currCoord[0]][currCoord[1]] = Map.explored;
		await render(map);

		addNeighbors(currCoord);
	}

	map[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
	running = false;
	return goalCoord;
}

async function getShortestPathBFS() {
	var btns = document.getElementsByClassName("btn-fancy");

	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = true;
	}

	document.getElementById("shortest-type").innerText = "BFS";
	let path = [];
	const goalCoord = await run();

	let currCoord = goalCoord;
	while (currCoord) {
		path.push(currCoord);
		currCoord = parent[currCoord];
	}
	path.reverse();
	// Tandai path menjadi -2
	for (const coord of path) {
		map[coord[0]][coord[1]] = Map.shortest;
		await render(map);
	}

	map[goalCoord[0]][goalCoord[1]] = Map.goal;
	map[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
	await render(map);

	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = false;
	}
}
