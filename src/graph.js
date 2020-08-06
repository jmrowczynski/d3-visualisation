import * as d3 from "d3";
import generateData from "./generateData";
import mapValues from "./mapValues";

const buttons = document.querySelectorAll(".buttons button");

const graph = () => {
  let data = generateData(Math.ceil(Math.random() * 26));
  const width = 500;
  const height = 500;
  const margin = { top: 20, right: 30, bottom: 20, left: 40 };

  const t = d3.transition().duration(600);

  function zoom(svg) {
    const extent = [
      [margin.left, margin.top],
      [width - margin.right, height - margin.top],
    ];

    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed)
    );

    function zoomed() {
      x.range(
        [margin.left, width - margin.right].map((d) =>
          d3.event.transform.applyX(d)
        )
      );
      svg
        .selectAll("rect")
        .attr("x", (d) => x(d.name))
        .attr("width", x.bandwidth());

      gx.call(xAxis);
    }
  }

  const updateBars = (data) => {
    const bar = svg.selectAll("rect").data(data, (d) => d.name);
    bar
      .join("rect")
      .transition(t)
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
  };

  const update = (action) => {
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
      case "random":
        data = generateData(Math.ceil(Math.random() * 26));
        break;
      default:
        return;
    }

    x.domain(data.map((d) => d.name));
    y.domain([0, d3.max(data, (d) => d.value)]);

    updateBars(data);

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

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .call(zoom);

  updateBars(data);

  const gx = svg.append("g").call(xAxis);
  const gy = svg.append("g").call(yAxis);

  document.body.appendChild(svg.node());

  buttons.forEach((button) =>
    button.addEventListener("click", function () {
      update(this.name);
    })
  );
};

export default graph;
