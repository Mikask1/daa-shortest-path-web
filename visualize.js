function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function render(map) {
	d3.select("#map")
		.html("")
		.append("svg")
		.attr("width", Map.xLength * 20)
		.attr("height", Map.yLength * 20)
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
			return i * 20;
		})
		.attr("y", function (d, i, j) {
			return j * 20;
		})
		.attr("height", 19)
		.attr("width", 19)
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
	await sleep(30);
}
