let map = [];
let stack = [];
let parent = { [[2, 1]]: null };

// Start Node
stack.push([2, 1]);

function addNeighbors(coord) {
    checkNeighbor([coord[0] - 1, coord[1]], coord);

    checkNeighbor([coord[0], coord[1] + 1], coord);

    checkNeighbor([coord[0] + 1, coord[1]], coord);

    checkNeighbor([coord[0], coord[1] - 1], coord);
}

function checkNeighbor(coord, parentCoord) {
    const x = coord[1];
    const y = coord[0];

    if (x >= map.xLength) return false;
    if (x < 0) return false;
    if (y >= map.yLength) return false;
    if (y < 0) return false;

    const coordValue = map[y][x];
    if (
        coordValue !== map.path &&
        coordValue !== map.goal &&
        coordValue !== map.open
    ) {
        return false;
    }

    stack.push(coord);

    if (coordValue !== map.goal) {
        map[coord[0]][coord[1]] = map.open;
    }
    parent[coord] = parentCoord;
}

async function run() {
    map = JSON.parse(JSON.stringify(map.grid_map));
    stack = [];
    parent = { [[2, 1]]: null };

    // Start Node
    stack.push([2, 1]);
    let goalCoord = [];

    await render(map);
    while (stack.length) {
        const currCoord = stack.pop();
        const currValue = map[currCoord[0]][currCoord[1]];

        if (currValue === map.goal) {
            goalCoord = currCoord;
            break;
        }

        map[currCoord[0]][currCoord[1]] = map.explored;
        await render(map);

        addNeighbors(currCoord);
    }

    map[map.startCoord[0]][map.startCoord[1]] = map.start;
    running = false;
    return goalCoord;
}

async function getShortestPathDFS() {
    var btns = document.getElementsByClassName("btn-fancy");

    for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = true;
    }

    document.getElementById("shortest-type").innerText = "DFS";
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
        map[coord[0]][coord[1]] = map.shortest;
        await render(map);
    }

    map[goalCoord[0]][goalCoord[1]] = map.goal;
    map[map.startCoord[0]][map.startCoord[1]] = map.start;
    await render(map);

    for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = false;
    }
}
