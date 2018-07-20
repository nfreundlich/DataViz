/*
*    graph_1.js
*    OCC 2014 - 2017
*/
var g1_params = { flag:1,
                  labelX:'',
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
                  occ_2016:'',
                  occ_2015:'',
                  occ_2014:'',
                  filtered:'',
                  allcolumns:'',
                  min_slice: 0,
                  max_slice: 41,
                };

var margin = { left:80, right:10, top:60, bottom:160 };

var height_test = parseInt(d3.select("#chart-area-1").style("height"), 10),
    width_test = parseInt(d3.select("#chart-area-1").style("width"), 10);

var width = width_test - margin.left - margin.right, //960 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;       //480 - margin.top - margin.bottom;

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
        console.log(g1_params.data);
        g1_params.filtered = g1_params.data['columns'].slice(4);
        g1_params.allcolumns = g1_params.data['columns'].slice(4);
        update_graph1(g1_params.data);
        graph_1_legend();
      }

  }).catch(function(error){
  	console.log(error)
  });
}

read_data('occ_2014');
read_data('occ_2015');
read_data('occ_2016');
read_data('occ_2017');
// read_data('ut4m_2017');

//ESH,ESF,SEH,SEF,V1H,V1F,V2H,V2F,V3H,V3F,V4H,V4F
$("#play-button-graph-1-2017") //age filter test temp
    .on("click", function(){
      console.log(g1_params.data.slice(3,8));
      g1_params.data = g1_params.data.slice(3,8)

      update_graph1();
    });
$("#button-reset")
    .on("click", function(){
      g1_params.filtered = g1_params.allcolumns;
      g1_params.data = g1_params.occ_2017;
      g1_params.min_slice = 0;
      g1_params.max_slice = 41;
      $("#occ-gender-select").val("occ_gender_all");
      $("#occ-cat-select").val("occ_cat_all");
      update_graph1();
    });
$("#occ-gender-select")
    .on("change", function(){
        update_graph1();
    });
$("#occ-cat-select")
    .on("change", function(){
        update_graph1();
    });

//gender -- cat
function filter_gender(columns)
{
  gender = $("#occ-gender-select").val();
  console.log('Filter on gender: ' + gender);

  // TODO: REDOX - apply cleaner mapping, eg:
  // filteredDistances = distances.filter(item => item.distance < 10000)
  // g1_params.allcolumns.filter(item => oo);

  return columns.filter(function(d){
    if(gender == "occ_gender_women"){
      if (["ESF", "SEF", "V1F", "V2F", "V3F", "V4F"].includes(d)){return d;};
    }
    else if (gender == "occ_gender_men") {
      if(["ESH", "SEH", "V1H", "V2H", "V3H", "V4H"].includes(d)){return d;};
    }
    else{
      return columns;
    }
  });
}
function filter_cat(columns)
{
  var cat = $("#occ-cat-select").val();
  return columns.filter(function(d){
    if(cat == "occ_cat_es"){
      if(["ESF", "ESH"].includes(d)){return d;};
    }
    else if (cat == "occ_cat_se") {
      if(["SEF", "SEH"].includes(d)){return d;};
    }
    else if (cat == "occ_cat_ve1") {
      if(["V1F", "V1H"].includes(d)){return d;};
    }
    else if (cat == "occ_cat_ve2") {
      if(["V2F", "V2H"].includes(d)){return d;};
    }
    else if (cat == "occ_cat_ve3") {
      if(["V3F", "V3H"].includes(d)){return d;};
    }
    else if (cat == "occ_cat_ve4") {
      if(["V4F", "V4H"].includes(d)){return d;};
    }
    else{
      return columns;
    }
  });
}
// Compute sum of array for dynamic scaling
function getSum(total, num) {
    return total + num;
}

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
});
$("#minutes-slider").slider({
    range: true,
    max: 900,
    min: 300,
    step: 15,
    values: [300, 900],
    slide: function(event, ui){
        console.log('minslider: ' + ui.values[ 0 ] + " - " + ui.values[ 1 ]);
        g1_params.min_slice = (ui.values[ 0 ] - 300) / 15;
        g1_params.max_slice = (ui.values[ 1 ] - 300) / 15;
        console.log(g1_params.min_slice + "-->" + g1_params.max_slice);
        $("#minutes")[0].innerHTML = ui.values[0] + " - " + ui.values[1];
        update_graph1();
    }
});


function update_graph1(){
  data = g1_params.data.slice(g1_params.min_slice, g1_params.max_slice + 1);

  var keys = filter_cat(filter_gender(g1_params.allcolumns));
  console.log("keys: " + keys);
  console.log(data);

  var y_domain_max = d3.max(data, function(d){
    local_total = 0;
    keys.forEach(function(element){
      local_total = local_total + (+d[element]);
    });
    return local_total;
  });

	// x scale domain update
	x.domain(data.map(function(d){ return d.TimeBin; }));

	// y scale domain update
	y.domain([0, y_domain_max]).nice();

  // useful ordinal color scale
  var yColorOrdinal = d3.scaleOrdinal(d3["schemePaired"]).domain(g1_params.allcolumns);
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
    //TODO: REDOX
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
        .attr("fill", function(d) {
          console.log('key: ' + d.key + 'color: ' + colorScale(d.key));
          return colorScale(d.key); })
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
};

function graph_1_legend()
{
  // useful ordinal color scale
  var yColorOrdinal = d3.scaleOrdinal(d3["schemePaired"]).domain(g1_params.allcolumns);
  var colorScale = yColorOrdinal;

  var legend = g_graph_1.append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(g1_params.allcolumns) //.reverse() if you wish
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
      .attr("cx", width - 19)
      .attr("r", 5)
      // .attr("width", 19)
      // .attr("height", 19)
      .attr("fill", colorScale)
      .attr('transform', 'translate(' + 2 + ',' + 9 + ')');

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
}
