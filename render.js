function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

let speed = 30
async function render(map) {
	d3.select("#map")
		.html("")
		.append("svg")
		.attr("width", Map.xLength * 30)
		.attr("height", Map.yLength * 30)
		.selectAll("rect")
		.data(map)
		.enter()
		.append("g")
		.selectAll("rect")
		.data(function (d, i) {
			return d;
		})
		.enter()
		.append("rect")
		.attr("x", function (d, i) {
			return i * 30;
		})
		.attr("y", function (d, i, j) {
			return j * 30;
		})
		.attr("height", 29)
		.attr("width", 29)
		.attr("fill", (d) => {
			if (d == Map.wall) {
				return "gray";
			}

			if (d == Map.path) {
				return "lightgreen";
			}

			if (d == Map.start) {
				return "blue";
			}

			if (d == Map.goal) {
				return "red";
			}

			if (d == Map.explored) {
				return "lightgray";
			}

			if (d == Map.open) {
				return "green";
			}

			if (d == Map.shortest) {
				return "yellow";
			}
		});
	await sleep(speed);
}

render(Map.grid_map);

function setSpeed(spd){
	speed = spd
	document.getElementById("speed-value").innerText = `Speed = ${speed}ms`
}