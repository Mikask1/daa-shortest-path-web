const map = Map.grid_map;

const queue = [];
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
	let goalCoord = [];
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
	return goalCoord;
}

async function getShortestPath() {
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
	}

	map[goalCoord[0]][goalCoord[1]] = Map.goal;
	map[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
	await render(map);
}

function printMap() {
	for (let index = 0; index < yLength; index++) {
		for (let indexs = 0; indexs < xLength; indexs++) {
			process.stdout.write(`${map[index][indexs]}\t`);
		}
		console.log("");
	}
}

getShortestPath();
