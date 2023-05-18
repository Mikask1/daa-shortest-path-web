let dfsMap = [];
let dfsStack = [];
let dfsParent = { [[2, 1]]: null };

// Start Node
dfsStack.push([2, 1]);

function addNeighbors(coord) {
    checkNeighbor([coord[0] - 1, coord[1]], coord);

    checkNeighbor([coord[0], coord[1] + 1], coord);

    checkNeighbor([coord[0] + 1, coord[1]], coord);

    checkNeighbor([coord[0], coord[1] - 1], coord);
}

function checkNeighbor(coord, parentCoord) {
    const x = coord[1];
    const y = coord[0];

    if (x >= Map.xLength) return false;
    if (x < 0) return false;
    if (y >= Map.yLength) return false;
    if (y < 0) return false;

    const coordValue = dfsMap[y][x];
    if (
        coordValue !== Map.path &&
        coordValue !== Map.goal &&
        coordValue !== Map.open
    ) {
        return false;
    }

    dfsStack.push(coord);

    if (coordValue !== Map.goal) {
        dfsMap[coord[0]][coord[1]] = Map.open;
    }
    dfsParent[coord] = parentCoord;
}

async function run() {
    dfsMap = JSON.parse(JSON.stringify(Map.grid_map));
    dfsStack = [];
    dfsParent = { [[2, 1]]: null };

    // Start Node
    dfsStack.push([2, 1]);
    let goalCoord = [];

    await render(dfsMap);
    while (dfsStack.length) {
        const currCoord = dfsStack.pop();
        const currValue = dfsMap[currCoord[0]][currCoord[1]];

        if (currValue === Map.goal) {
            goalCoord = currCoord;
            break;
        }

        dfsMap[currCoord[0]][currCoord[1]] = Map.explored;
        await render(dfsMap);

        addNeighbors(currCoord);
    }

    dfsMap[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
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
        currCoord = dfsParent[currCoord];
    }
    path.reverse();
    // Tandai path menjadi -2
    for (const coord of path) {
        dfsMap[coord[0]][coord[1]] = Map.shortest;
        await render(dfsMap);
    }

    dfsMap[goalCoord[0]][goalCoord[1]] = Map.goal;
    dfsMap[Map.startCoord[0]][Map.startCoord[1]] = Map.start;
    await render(dfsMap);

    for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = false;
    }
}
