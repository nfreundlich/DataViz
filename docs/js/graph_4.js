/*
*    graph_2_compare.js
*    OCC and UT4M compare - 2017
*/
var graph4 = {
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

graph4.data = [
            {"trailrace":"UT4M Belledonne","distance":45},
            {"trailrace":"UT4M Vercors","distance":44},
            {"trailrace":"UT4M Chartreuse","distance":42},
            {"trailrace":"OCC","distance":55},
            ];

/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area-4")
    // .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

// Y Label
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");


// X Scale
var x = d3.scaleBand()
    .domain(graph4.data.map(function(d){ return d.trailrace }))
    .range([0, width])
    .padding(0.2);

// Y Scale
var y = d3.scaleLinear()
    .domain([0, d3.max(graph4.data, function(d) { return d.distance })])
    .range([height, 0]);

// X Axis
var xAxisCall = d3.axisBottom(x);
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")
    .call(xAxisCall);

// Y Axis
var yAxisCall = d3.axisLeft(y)
    .tickFormat(function(d){ return "$" + d; });
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

// Bars
var rects = g.selectAll("rect")
    .data(graph4.data)

rects.enter()
    .append("rect")
        .attr("y", function(d){ return y(d.distance); })
        .attr("x", function(d){ return x(d.trailrace) })
        .attr("height", function(d){ return height - y(d.distance); })
        .attr("width", x.bandwidth)
        .attr("fill", "steelblue");
