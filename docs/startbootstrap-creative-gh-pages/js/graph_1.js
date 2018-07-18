/*
*    graph_1.js
*    OCC 2014 - 2017
*/

var g1_params = { labelX:'',
                  labelY:'',
                  labelYText:'',
                  x:'',
                  y:'',
                  xAxisGroup:'',
                  yAxisGroup:'',
                  g:'',
                  data:''};

var margin = { left:80, right:10, top:60, bottom:160 };

var height_test = parseInt(d3.select("#chart-area-1").style("height"), 10),
    width_test = parseInt(d3.select("#chart-area-1").style("width"), 10);

console.log("Test height and width: " + (height_test) + ", " + width_test);

var width = width_test - margin.left - margin.right,//960 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;//480 - margin.top - margin.bottom;

var g_graph_1 = d3.select("#chart-area-1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left
            + ", " + margin.top + ")");

// label X
var labelX = g_graph_1.append("text")
	.attr("class", "x axis-label")
	.attr("x", width / 2)
	.attr("y", height + 80)
	.attr("font-size", "14px")
    .attr("text-anchor", "middle")
	.text("Time (15' intervals)");

// label Y
var labelY = g_graph_1.append("text")
	.attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -40)
	.attr("font-size", "14px")
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
var xAxisGroup = g_graph_1.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + height + ")");

// y axis group (to be called with yAxisCall)
var yAxisGroup = g_graph_1.append("g")
	.attr("class", "y-axis");

// read data: Total,TimeBin,Women,Men
//TODO: create a function for this with param for data
d3.csv("../data/ut4m_2017_hist_detailed_cats.csv").then(function(data){
    var keys = data.columns.slice(4); //Men + Women columns

    console.log("i have read the data - occ 2017");
    console.log(data);
    console.log(d3.stack().keys(keys)(data));

    // transform string data to integer
    data.forEach(function(d, i, columns){
        for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.Total = +d.Total;
    });

    g1_params.data = data;

	  update_graph1(data);

}).catch(function(error){
	console.log(error)
});

$("#play-button-graph-1")
  .on("click", function(){
    //alert("gonna change the data" + window.location.href);

    //TODO --- TOTAL REDOXXXXX // TODO:
    d3.csv("../data/ut4m_2014_hist_detailed_cats_fake.csv").then(function(data){
        var keys = data.columns.slice(4); //Men + Women columns

        console.log("i have read the data - occ 2014!!!");
        console.log(data);
        console.log(d3.stack().keys(keys)(data));

        // transform string data to integer
        data.forEach(function(d, i, columns){
            for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.Total = +d.Total;
        });

        g1_params.data = data;

        update_graph1(data);
      });
  });


function update_graph1(data){
  console.log("in update data");
  var keys = data.columns.slice(4);

	// x scale domain update
	x.domain(data.map(function(d){ return d.TimeBin; }));

	// y scale domain update
	y.domain([0, d3.max(data, function(d){return d["Total"];})]).nice();
  console.log(d3.max(data, function(d){return d["Total"];}));

  // useful ordinal color scale
  var yColorOrdinal = d3.scaleOrdinal(d3["schemePaired"]);

  // color scale (optional and useless from data pov)
	var yColorInterpolateRainbow = d3.scaleSequential()
		.domain([0, d3.max(data, function(d){
            return d["Total"];
        })])
		.interpolator(d3.interpolateRainbow);
	var yColorInterpolateWarm = d3.scaleSequential()
		.domain([0, d3.max(data, function(d){return d["Total"];})])
		.interpolator(d3.interpolateRainbow);
  // end of useless color scales, play with this later maybe

  var colorScale = yColorOrdinal;

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

  console.log("called the axis");

	// update label
  var labelYText = "Number of runners";
	labelY.text(labelYText)

  console.log("updated label text");

	// declare transition
	var t = d3.transition().duration(250);

    // JOIN new data with old elements.
    // REDOX - why is this not working?
    // var rects = g_graph_1.selectAll("rect")
    //     .data(data, function(d){
    //     	return d.TimeBin;
    //     });
    var rects = g_graph_1;

    //---->>>TOOLTIP
      var tip = d3.tip().attr("class", "d3-tip")
            .html(function(d){
              console.log(d);
              console.log(d.data);
              console.log(d.data.TimeBin);
              console.log(d.data.Men);
              var text = "<span style='font-size: 11px'>Total: " + d.data.Total + "<br>";
              text += "Women: " + d.data.Women + "<br>";
              text += "Men: " + d.data.Men + "<br></span>";
              return text;
            });

      rects.call(tip);

    //<<-----TOOLTIP

    // EXIT old elements not present in new data.
    rects.exit()
        .attr("fill", "red")
    .transition(t)
        .attr("y", y(0))
        .attr("height", 0)
        .remove();

//------->>>TO BE DELETED AND/OR REWORKED!!!
      rects.append("g")
        .selectAll("g")
          //MANAGE STACKING
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
          .attr("fill", function(d) { return colorScale(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          //setup transition
          .attr("y", y(0))
          .attr("height", 0)
          .attr("x", function(d){ return x(d.data.TimeBin) })
          .attr("width", x.bandwidth)
          //start transition
          .transition(t)
            .attr("x", function(d) { return x(d.data.TimeBin); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());
//<<-----TO BE DELETED

//--->LEGENDS
var legend = rects.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys.slice()) //.reverse() if you wish
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", colorScale);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });
//<<----LEGENDS
};
