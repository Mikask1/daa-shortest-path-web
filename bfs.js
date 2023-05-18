let bfsMap = [];

let bfsQueue = [];
let bfsParent = { [[2, 1]]: null };

// Start Node
bfsQueue.push([2, 1]);

function bfsAddNeighbors(coord) {
	bfsCheckNeighbor([coord[0] - 1, coord[1]], coord);

	bfsCheckNeighbor([coord[0], coord[1] + 1], coord);

	bfsCheckNeighbor([coord[0] + 1, coord[1]], coord);

	bfsCheckNeighbor([coord[0], coord[1] - 1], coord);
}

function bfsCheckNeighbor(coord, parentCoord) {
	const x = coord[1];
	const y = coord[0];

	// console.log(coord, bfsQueue);
	if (x >= Map.xLength) return false;
	if (x < 0) return false;
	if (y >= Map.yLength) return false;
	if (y < 0) return false;

	const coordValue = bfsMap[y][x];
	if (
		coordValue != Map.path &&
		coordValue != Map.goal &&
		coordValue != Map.open
	) {
		return false;
	}

	bfsQueue.push(coord);

	if (coordValue != Map.goal) {
		bfsMap[coord[0]][coord[1]] = Map.open;
	}
	bfsParent[coord] = parentCoord;
}

async function bfsRun() {
	bfsMap = JSON.parse(JSON.stringify(Map.grid_map));
	bfsQueue = [];
	bfsParent = { [[2, 1]]: null };

	// Start Node
	bfsQueue.push([2, 1]);
	goalCoord = [];

	await render(bfsMap);
	while (bfsQueue.length) {
		const currCoord = bfsQueue.shift();
		const currValue = bfsMap[currCoord[0]][currCoord[1]];

		if (currValue == Map.goal) {
			goalCoord = currCoord;
			break;
		}

		bfsMap[currCoord[0]][currCoord[1]] = Map.explored;
		await render(bfsMap);

		bfsAddNeighbors(currCoord);
	}

	bfsMap[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
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
	const goalCoord = await bfsRun();

	let currCoord = goalCoord;
	while (currCoord) {
		path.push(currCoord);
		currCoord = bfsParent[currCoord];
	}
	path.reverse();
	// Tandai path menjadi -2
	for (const coord of path) {
		bfsMap[coord[0]][coord[1]] = Map.shortest;
		await render(bfsMap);
	}

	bfsMap[goalCoord[0]][goalCoord[1]] = Map.goal;
	bfsMap[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
	await render(bfsMap);

	for (var i = 0; i < btns.length; i++) {
		btns[i].disabled = false;
	}
}