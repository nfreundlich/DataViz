/*
*    graph_2_compare.js
*    OCC & UT4M comparison - 2017
*/
var graph_2 = {
                  //dimensions
                  offset: { top:0, left:0 },
                  margin: { left:80, right:60, top:60, bottom:160 },
                  dimension: {width:0, height:0},

                  //the graph itself (aka d3.select(svg))
                  graph: '',

                  //scales
                  scale: {x:'', y:'', color:''},

                  //axis
                  xAxisCall:'', yAxisCall:'', xAxisGroup:'', yAxisGroup:'',

                  //labels
                  labelX:'',
                  labelY:'',

                  g:'',
                  data:'',
                  ut4m_2017:'',
                  occ_2017:'',
                  occ_ut4m_2017:'',
                  occ_ut4m_2017_simple_cropped:'',
                  filtered:'',
                  allcolumns:'',
                  min_slice: 0,
                  max_slice: 80,
                };

var area_width = parseInt(d3.select("#chart-area-graph2-comparison").style("width"), 10);

graph_2.dimension.width = area_width - graph_2.margin.left - graph_2.margin.right;
graph_2.dimension.height = 480 - graph_2.margin.top - graph_2.margin.bottom;

graph_2.graph = d3.select("#chart-area-2")
        .attr("width", graph_2.dimension.width + graph_2.margin.left + graph_2.margin.right)
        .attr("height", graph_2.dimension.height + graph_2.margin.top + graph_2.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + graph_2.margin.left
            + ", " + graph_2.margin.top + ")");

// label X
graph_2.labelX = graph_2.graph.append("text")
	.attr("class", "x axis-label")
	.attr("x", graph_2.dimension.width / 2)
	.attr("y", graph_2.dimension.height + 80)
	.attr("font-size", "14px")
    .attr("text-anchor", "middle")
	.text("Time (15' intervals)");

// label Y
graph_2.labelY = graph_2.graph.append("text")
	.attr("class", "y axis-label")
    .attr("x", - (graph_2.dimension.height / 2))
    .attr("y", -40)
	.attr("font-size", "14px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
  .text("Number of runners");

// x scale
graph_2.scale.x = d3.scaleBand()
    .range([0, graph_2.width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

// y scale
graph_2.scale.y = d3.scaleLinear()
    .range([graph_2.height, 0]);

// useful ordinal color scale
graph_2.scale.color = d3.scaleOrdinal(d3["schemePaired"]).domain(graph_2.allcolumns);

// x axis group (to be called with xAxisCall)
graph_2.xAxisGroup = graph_2.graph.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + graph_2.dimension.height + ")");

// y axis group (to be called with yAxisCall)
graph_2.yAxisGroup = graph_2.graph.append("g")
	.attr("class", "y-axis");

read_data('occ_ut4m_2017_simple_cropped');

// read data: Total,TimeBin,Women,Men
function read_data(competition){
  d3.csv("../data/" + competition + "_hist.csv").then(function(data){
      console.log("Reading " + competition);

      // transform string data to integer
      data.forEach(function(d, i, columns){
          for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
          d.Total = +d.Total;
      });

      graph_2[competition] = data;
      console.log(data);

      // default
      // if(competition == 'occ_ut4m_2017_simple_cropped'){

        graph_2.data = graph_2[competition];
        console.log(graph_2.data);
        //graph_2.filtered = graph_2.data['columns'].slice(4);
        graph_2.allcolumns = graph_2.data['columns'].slice(2);
        graph_2.offset.left =  $("#chart-area-2").offset().left;
        graph_2.offset.top =  $("#chart-area-2").offset().top;
        //update_graph_2();
        //graph_1_legend();

        console.log('All columns g2:');
        console.log(graph_2.allcolumns);
        // TODO: factorize this
        // annotation = d3.select("#annotation-chart-1");
        // annotation
        //   .style("opacity", 1)
        //   .style("left", 100 + "px")
        //   .style("top", 0 + "px")
        //   .html(create_annotation_g1(2017));

        update_graph_2();
      // }

  }).catch(function(error){
  	console.log(error)
  });
}

function update_graph_2(){
  data = graph_2.data.slice();//graph_2.min_slice, graph_2.max_slice + 1);

  var keys = graph_2.allcolumns;//filter_cat(filter_gender(graph_2.allcolumns));
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
	graph_2.scale.x.domain(data.map(function(d){ return d.TimeBin; }));
  console.log(data[0].TimeBin);

	// y scale domain update
	graph_2.scale.y.domain([0, y_domain_max]).nice();

  // useful ordinal color scale
  graph_2.colorScale = d3.scaleOrdinal(d3["schemePaired"]).domain(graph_2.allcolumns);

	graph_2.xAxisCall = d3.axisBottom(graph_2.scale.x);
	graph_2.xAxisGroup.call(graph_2.xAxisCall)
      .selectAll("text")
        .attr("y", "-5")
        .attr("x", "-10")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");

	graph_2.yAxisCall = d3.axisLeft(graph_2.scale.y)
		.tickFormat(function(d){
	        return d;
	    });
	graph_2.yAxisGroup.call(graph_2.yAxisCall);

	// update label
  var labelYText = "Number of runners";
	graph_2.labelY.text(labelYText)

	var t = d3.transition().duration(250);
  var rects = graph_2.graph;

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
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) {
          return graph_2.colorScale(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        //setup transition
        .attr("y", y(0))
        .attr("height", 0)
        .attr("x", function(d){ return graph_2.scale.x(d.data.TimeBin) })
        .attr("width", graph_2.scale.x.bandwidth())

        //start transition
        .transition(t)
          .attr("x", function(d) { return graph_2.scale.x(d.data.TimeBin); })
          .attr("y", function(d) { return graph_2.scale.y(d[1]); })
          .attr("height", function(d) { return graph_2.scale.y(d[0]) - graph_2.scale.y(d[1]); })
          .attr("width", graph_2.scale.x.bandwidth());
//<<----GRAPH
};

// function update_graph_2()
// {
//   console.log('in update graph 2');
//   data = graph_2.data;//.slice(graph_2.min_slice, graph_2.max_slice + 1);
//
//   var keys = graph_2.allcolumns;//filter_cat(filter_gender(graph_2.allcolumns));
//   console.log("local keys: " + keys);
//   console.log(data);
//
//   var y_domain_max = d3.max(data, function(d){
//     total = 0;
//     keys.forEach(function(element){
//       total = total + (+d[element]);
//     });
//     return total;
//   });
//   console.log("Ydomainmax:" + y_domain_max);
// 	// x scale domain update
// 	graph_2.scale.x.domain(data.map(function(d){ return d.TimeBin; }));
//   console.log('x scale domain');
//   console.log(data[0].TimeBin);
// 	// y scale domain update
// 	graph_2.scale.y.domain([0, y_domain_max]).nice();
//
//   // call the scales
//   graph_2.xAxisCall = d3.axisBottom(graph_2.scale.x);
//
//   graph_2.xAxisGroup.call(graph_2.xAxisCall)
//       .selectAll("text")
//         .attr("y", "-5")
//         .attr("x", "-10")
//       .attr("text-anchor", "end")
//       .attr("transform", "rotate(-90)");
//
//   // graph_2.yAxisCall = d3.axisLeft(graph_2.scale.y)
//   //   .tickFormat(function(d){
//   //         return d;
//   //     });
//   // graph_2.yAxisGroup.call(graph_2.yAxisCall);
//
//   var t = d3.transition().duration(250);
//
//   //Append.
//   graph_2.graph.append("g")
//     .selectAll("g")
//     .data(d3.stack().keys(keys)(data))
//     .enter().append("g")
//       .attr("fill", function(d) {
//         return graph_2.scale.color(d.key); })
//     .selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       //setup transition
//       .attr("y", y(0))
//       .attr("height", 0)
//       .attr("x", function(d){ return x(d.data.TimeBin) })
//       .attr("width", x.bandwidth())
//
//       //start transition
//       .transition(t)
//         .attr("x", function(d) { return x(d.data.TimeBin); })
//         .attr("y", function(d) { return y(d[1]); })
//         .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//         .attr("width", x.bandwidth());
//   }
