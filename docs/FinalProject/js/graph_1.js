/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var flag = 0; //0,1,2 == Total, Men, Women

var margin = { left:100, right:10, top:10, bottom:160 };

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left
            + ", " + margin.top + ")");

// label X
var labelX = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width / 2)
	.attr("y", height + 80)
	.attr("font-size", "20px")
    .attr("text-anchor", "middle")
	.text("TimeBin");

// label Y
var labelY = g.append("text")
	.attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)");

// x scale
var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

// y scale
var y = d3.scaleLinear()
    .range([height, 0]);

// x axis group (to be called with xAxisCall) -- course 3.25
var xAxisGroup = g.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + height + ")");

// y axis group (to be called with yAxisCall)
var yAxisGroup = g.append("g")
	.attr("class", "y-axis");

// read data: Total,TimeBin,Women,Men
d3.csv("../data/ut4m_2017_mw.csv").then(function(data){
    console.log(data);

    // transform string data to integer
    data.forEach(function(d){
        d.Total = +d.Total;
        d.Men = +d.Men;
        d.Women = +d.Women;
    });

	d3.interval(function(){
		//var newData = flag ? data : data.slice(1);
		update(data);
		flag += 1;
    if(flag > 2) {flag = 0;};
	}, 1000);

	update(data);
}).catch(function(error){
	console.log(error)
});

function update(data){
  var value;
  switch(flag) {
    case 1:
        value = "Men";
        break;
    case 2:
        value = "Women";
        break;
    default:
        value = "Total";
    }
	// var value = flag ? "Total" : "Men";

	// x scale domain update
	x.domain(data.map(function(d){ return d.TimeBin; }));

	// y scale domain update
	y.domain([0, d3.max(data, function(d){return d[value];})]);

    // color scale (optional and useless from data pov)
	var yCol = d3.scaleSequential()
		.domain([0, d3.max(data, function(d){
            return d[value];
        })])
		.interpolator(d3.interpolateRainbow);
	var yColWarm = d3.scaleSequential()
		.domain([0, d3.max(data, function(d){return d[value];})])
		.interpolator(d3.interpolateWarm);


	var xAxisCall = d3.axisBottom(x);
	xAxisGroup.call(xAxisCall)
      .selectAll("text")
        .attr("y", "-5")
        .attr("x", "-10")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");

	var yAxisCall = d3.axisLeft(y)
		.tickFormat(function(d){
	        return d;
	    });
	yAxisGroup.call(yAxisCall);

	// update label
  var labelYText = value;
	labelY.text(labelYText)

	// declare transition
	var t = d3.transition().duration(250);

    // JOIN new data with old elements.
    var rects = g.selectAll("rect")
        .data(data, function(d){
        	return d.TimeBin;
        });

    // EXIT old elements not present in new data.
    rects.exit()
        .attr("fill", "red")
    .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

    // ENTER new elements present in new data...
    rects.enter()
        .append("rect")
            .attr("fill", function(d){return yColWarm(d[value])})
            .attr("y", y(0))
            .attr("height", 0)
            .attr("x", function(d){ return x(d.TimeBin) })
            .attr("width", x.bandwidth)
            // AND UPDATE old elements present in new data.
            .merge(rects)
            .transition(t)
                .attr("x", function(d){ return x(d.TimeBin) })
                .attr("width", x.bandwidth)
                .attr("y", function(d){ return y(d[value]); })
                .attr("height", function(d){ return height - y(d[value]); })
                .attr("fill", function(d){return yColWarm(d[value])});

};
