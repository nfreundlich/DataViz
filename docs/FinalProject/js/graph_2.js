/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var flag = true;

var margin = { left:100, right:10, top:10, bottom:120 };

var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var g = d3.select("#chart-area-2")
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
	.attr("y", height + 40)
	.attr("font-size", "20px")
    .attr("text-anchor", "middle")
	.text("Month");

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

// x axis group (to be called with xAxisCall)
var xAxisGroup = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")");

// y axis group (to be called with yAxisCall)
var yAxisGroup = g.append("g")
	.attr("class", "y axis");

// read data
d3.json("data/revenues.json").then(function(data){
    console.log(data);

    // transform string data to integer
    data.forEach(function(d){
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

	d3.interval(function(){
		update(data);
		flag = !flag;
	}, 1000);

	update(data);
}).catch(function(error){
	console.log(error)
});

function update(data){
	var value = flag ? "revenue" : "profit";

	// x scale domain update
	x.domain(data.map(function(d){ return d.month; }));

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
	xAxisGroup.call(xAxisCall);

	var yAxisCall = d3.axisLeft(y)
		.tickFormat(function(d){
	        return "$" + d;
	    });
	yAxisGroup.call(yAxisCall);

	// update label
	var labelYText = flag ? "Revenue" : "Profit";
	labelY.text(labelYText)

	// declare transition
	var t = d3.transition().duration(750);

    // JOIN new data with old elements.
    var rects = g.selectAll("rect")
        .data(data);

    // EXIT old elements not present in new data.
    rects.exit()
        .attr("fill", function(d){return yCol(d[value])})
    	.transition(t)
    		.attr("y", y(0))
    		.attr("height", 0)
    		.remove();

	// UPDATE
	rects.transition(t)
		.attr("x", function(d, i){
			return x(d.month);
		})
		.attr("y", function(d){return y(d[value]);})
		.attr("height", function(d){
			return height - y(d[value]);
		})
		.attr("width", x.bandwidth)
		.attr("fill", function(d){return yColWarm(d[value])})
		.attr("fill-opacity", 1)
		.transition(t)
			.attr("fill-opacity", 1)
			.attr("fill", function(d){return yCol(d[value]);});

	// ENTER
	rects.enter()
		.append("rect")
			.attr("x", function(d, i){
				return x(d.month);
			})
			.attr("width", x.bandwidth)
			.attr("fill", function(d){return yColWarm(d[value])})
			.attr("fill-opacity", 1)
			.transition(t)
				.attr("y", function(d){return y(d[value]);})
				.attr("height", function(d){return height - y(d.revenue);})
				.attr("fill-opacity", 1)
				.attr("fill", function(d){return yCol(d[value]);});

};
