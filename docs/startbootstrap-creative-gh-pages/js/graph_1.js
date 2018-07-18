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
                  data:'',
                  ut4m_2017:'',
                  occ_2017:'',
                  occ_2016:''};

var margin = { left:80, right:10, top:60, bottom:160 };

var height_test = parseInt(d3.select("#chart-area-1").style("height"), 10),
    width_test = parseInt(d3.select("#chart-area-1").style("width"), 10);

console.log("Got height and width: " + (height_test) + ", " + width_test);

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
function read_data(competition){
  d3.csv("../data/" + competition + "_hist.csv").then(function(data){
      var keys = data.columns.slice(4); //Men + Women columns

      console.log("Reading " + competition);

      // transform string data to integer
      data.forEach(function(d, i, columns){
          for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
          d.Total = +d.Total;
      });

      g1_params[competition] = data;

      // default
      if(competition == 'occ_2017'){
        g1_params.data = g1_params[competition];
        update_graph1(g1_params.data);
      }

  }).catch(function(error){
  	console.log(error)
  });
}


read_data('occ_2014');
read_data('occ_2015');
read_data('occ_2016');
read_data('occ_2017');
read_data('ut4m_2017');

$("#play-button-graph-1-2016")
  .on("click", function(){
    g1_params.data = g1_params['occ_2016'];
    update_graph1(g1_params.data);
  });
$("#play-button-graph-1-2017")
    .on("click", function(){
      g1_params.data = g1_params['occ_2017'];
      update_graph1(g1_params.data);
    });
$("#year-select")
    .on("change", function(){
        var competition = $("#year-select").val();
        g1_params.data = g1_params[competition];
        update_graph1(g1_params.data);
    })
$("#date-slider").slider({
    max: 2017,
    min: 2014,
    step: 1,
    value: 2017,
    slide: function(event, ui){
        var year = ui.value;
        $("#year")[0].innerHTML = year;
        var competition = "occ_" + year;
        g1_params.data = g1_params[competition];
        update_graph1(g1_params.data);
    }
})
//$("#date-slider").slider("value", +(time + 1800))

function update_graph1(){
  data = g1_params.data;

  var keys = data.columns.slice(4);

	// x scale domain update
	x.domain(data.map(function(d){ return d.TimeBin; }));

	// y scale domain update
	y.domain([0, d3.max(data, function(d){return d["Total"];})]).nice();

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

	// update label
  var labelYText = "Number of runners";
	labelY.text(labelYText)

	var t = d3.transition().duration(250);
  var rects = g_graph_1;

//TODO: REDOX ---->>>TOOLTIP
  var tip = d3.tip().attr("class", "d3-tip")
        .html(function(d){
          var text = "<span style='font-size: 11px'>Total: " + d.data.Total + "<br>";
          text += "Women: " + d.data.Women + "<br>";
          text += "Men: " + d.data.Men + "<br></span>";
          return text;
        });

  rects.call(tip);
//<<-----TOOLTIP

//--->>> GRAPH
    //Remove old elements.
    rects
      .selectAll("g")
      .selectAll("rect")
      .remove();
    //Append.
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
//<<----GRAPH

//--->LEGENDS
  var legend = rects.append("g")
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
