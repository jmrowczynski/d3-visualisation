import * as d3 from "d3";
import generateData from "./generateData";
import mapValues from "./mapValues";

const buttons = document.querySelectorAll(".buttons button");

// 1. Set width, height and margin
// 2. Create svg parent
// 3. Create x and y scales (IMPORTANT! -> when setting domain for scaleLinear, remember about providing second argument which is callback returning proper data key) . If we want proper graph orientation (lowest values at the bottom, highest a the top) it is good to set scale range from highest value to the lowest.
// 4. Create x and y axis providing to them proper scales
// 5. Add axis(adding it inside another g element previously) into main svg element
// 6. Create our bars in out svg for example as rect elements and bounding them with data
// 7. Set their values(width, height, x, y) using our scales
////////ANIMATION/////////
// 1. Create update function
// 2. Sort data based on the corresponding data key
// 3. Update scale(s) domain
// 4. Update bars data with transition(optionally)
// 5. Update axes

// ADD ZOOM OPTION

const graph = () => {
  const data = generateData(Math.ceil(Math.random() * 26));
  const width = 500;
  const height = 500;
  const margin = { top: 20, right: 30, bottom: 20, left: 40 };

  const update = (action) => {
    const t = d3.transition().duration(600);

    switch (action) {
      case "alphabetic":
        data.sort((a, b) => d3.ascending(a.name, b.name));
        break;
      case "ascending":
        data.sort((a, b) => d3.ascending(a.value, b.value));
        break;
      case "descending":
        data.sort((a, b) => d3.descending(a.value, b.value));
        break;
      default:
        return;
    }

    x.domain(data.map((d) => d.name));
    y.domain([0, d3.max(data, (d) => d.value)]);

    bar
      .data(data, (d) => d.name)
      .join("rect")
      .order()
      .transition(t)
      .attr("x", (d) => x(d.name))
      .attr(
        "fill",
        (d) =>
          `hsl(260, 50%, ${mapValues(
            d.value,
            d3.max(data, (d) => d.value)
          )}%)`
      );

    gx.transition(t).call(xAxis).selectAll(".tick");
    gy.transition(t).call(yAxis).selectAll(".tick");
  };

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g
      .call(d3.axisBottom(x))
      .attr("transform", `translate(0, ${height - margin.bottom})`);

  const yAxis = (g) =>
    g.call(d3.axisLeft(y)).attr("transform", `translate(${margin.left}, 0)`);

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const bar = svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr(
      "fill",
      (d) =>
        `hsl(260, 50%, ${mapValues(
          d.value,
          d3.max(data, (d) => d.value)
        )}%)`
    )
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.value))
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.value));

  const gx = svg.append("g").call(xAxis);
  const gy = svg.append("g").call(yAxis);

  document.body.insertAdjacentElement("afterbegin", svg.node());

  buttons.forEach((button) =>
    button.addEventListener("click", function () {
      update(this.name);
    })
  );
};

export default graph;
