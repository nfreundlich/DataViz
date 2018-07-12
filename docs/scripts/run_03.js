function occ_graph()
{
  var svg = d3.selectAll("#nfr_occ_02"),
      margin = {top: 20, right: 20, bottom: 60, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#ff8c00"]);//"#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  //multi stack possible!
  d3.csv("data/ut4m_2017_mw.csv", function(d, i, columns) { //d3_stacked_data.csv
    for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.totalnfr = t;
    return d;
  }, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(2);

    //data.sort(function(a, b) { return b.totalnfr - a.totalnfr; });
    x.domain(data.map(function(d) { return d.TimeBin; }));
    y.domain([0, d3.max(data, function(d) { return d.totalnfr; })]).nice();
    z.domain(keys);

    g.append("g")
      //SOME TRANSFORM ???
      .selectAll("g")
      //ASSIGNING DATA 2 TIMES???
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      //ASSIGN REAL DATA????
      .data(function(d) { return d; })
      //ENTER
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.TimeBin); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());


//AXIS and LEGENDS
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
           .style("text-anchor", "end")
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("transform", "rotate(-90)");

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Runner count");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
}
