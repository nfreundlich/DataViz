/*
*    graph_2_compare.js
*    OCC and UT4M compare - 2017
*/
var graph3 = {
                  //labels
                  labels: { labelX:'', labelY:''},

                  //dimensions
                  dimensions: { width:0, height:0 },
                  margin: { left:120, right:20, top:0, bottom:60 },

                  //graph
                  graph:'',

                  //scales
                  scales: { x:'', y:'', color:'' },

                  //axis
                  axis: { xAxisGroup:'', yAxisGroup:'', xAxisCall:'', yAxisCall:'' },

                  g:'',
                  data:'',
                }

graph3.data = [  
            {"trailrace":"UT4M Belledonne","distance":45},
            {"trailrace":"UT4M Vercors","distance":44},
            {"trailrace":"UT4M Chartreuse","distance":42},
            {"trailrace":"OCC","distance":55},
            ];


var height_area_3 = parseInt(d3.select("#chart-area-graph3").style("height"), 10),
    width_area_3 = parseInt(d3.select("#chart-area-graph3").style("width"), 10);

// set the dimensions and margins of the graph
graph3.dimensions.width = width_area_3 - graph3.margin.left - graph3.margin.right,
graph3.dimensions.height = 120 - graph3.margin.top - graph3.margin.bottom;

// set the ranges
graph3.scales.y = d3.scaleBand()
          .range([graph3.dimensions.height, 0])
          .padding(0.3);

graph3.scales.x = d3.scaleLinear()
          .range([0, graph3.dimensions.width]);

graph3.graph = d3.select("#chart-area-3")
    .attr("width", graph3.dimensions.width + graph3.margin.left + graph3.margin.right)
    .attr("height", graph3.dimensions.height + graph3.margin.top + graph3.margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + graph3.margin.left + "," + graph3.margin.top + ")");

// useful ordinal color scale
graph3.scales.color = d3.scaleOrdinal()
                          .range([ "#fdbf6f", "#fb9a99", "#b2df8a" , "#a6cee3",] )
                          .domain([0, 1, 2, 3]);

  // format the data
  graph3.data.forEach(function(d) {
    d.distance = +d.distance;
  });

  // Scale the range of the data in the domains
  graph3.scales.x.domain([0, d3.max(graph3.data, function(d){ return d.distance; })])
  graph3.scales.y.domain(graph3.data.map(function(d) { return d.trailrace; }));

  // append the rectangles for the bar chart
  graph3.graph.selectAll(".bar")
      .data(graph3.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", function(d, i) {return graph3.scales.color(i); } )
      //.attr("x", function(d) { return x(d.distance); })
      .attr("width", function(d) {return graph3.scales.x(d.distance); } )
      .attr("y", function(d) { return graph3.scales.y(d.trailrace); })
      .attr("height", graph3.scales.y.bandwidth());

  // add the x Axis
  graph3.graph.append("g")
      .attr("transform", "translate(0," + graph3.dimensions.height + ")")
      .call(d3.axisBottom(graph3.scales.x));

  // add the y Axis
  graph3.graph.append("g")
      .call(d3.axisLeft(graph3.scales.y));


      // label X
graph3.labels.labelX = graph3.graph.append("text")
    .attr("class", "x axis-label")
    .attr("x", graph3.dimensions.width / 2)
    .attr("y", graph3.dimensions.height + 30)
    .attr("font-size", "12px")
      .attr("text-anchor", "middle")
    .text("Distance (km)");
