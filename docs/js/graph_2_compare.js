/*
*    graph_2_compare.js
*    OCC and UT4M compare - 2017
*/
var graph2 = {
                  //labels
                  labels: { labelX:'', labelY:''},

                  //dimensions
                  dimensions: { width:0, height:0 },
                  margin: { left:80, right:60, top:60, bottom:160 },

                  //graph
                  graph:'',

                  //scales
                  scales: { x:'', y:'', color:'' },

                  //axis
                  axis: { xAxisGroup:'', yAxisGroup:'', xAxisCall:'', yAxisCall:'' },

                  g:'',
                  data:'',
                  ut4m_2017:'',
                  occ_ut4m_2017_simple_cropped:'',
                  occ_2016:'',
                  occ_2015:'',
                  occ_2014:'',
                  filtered:'',
                  allcolumns:'',
                  min_slice: 0,
                  max_slice: 46,
                  offset: {
                    top:0,
                    left:0
                  },

                  //transition
                  t:'',
                };


var height_area_2 = parseInt(d3.select("#chart-area-graph2-comparison").style("height"), 10),
    width_area_2 = parseInt(d3.select("#chart-area-graph2-comparison").style("width"), 10);

graph2.dimensions.width = width_area_2 - graph2.margin.left - graph2.margin.right, //960 - graph2.margin.left - graph2.margin.right,
graph2.dimensions.height = 480 - graph2.margin.top - graph2.margin.bottom;       //480 - graph2.margin.top - graph2.margin.bottom;

graph2.graph = d3.select("#chart-area-2")
    // .append("svg")
        .attr("width", graph2.dimensions.width + graph2.margin.left + graph2.margin.right)
        .attr("height", graph2.dimensions.height + graph2.margin.top + graph2.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + graph2.margin.left
            + ", " + graph2.margin.top + ")");

// label X
graph2.labels.labelX = graph2.graph.append("text")
	.attr("class", "x axis-label")
	.attr("x", graph2.dimensions.width / 2)
	.attr("y", graph2.dimensions.height + 80)
	.attr("font-size", "14px")
    .attr("text-anchor", "middle")
	.text("Time (15' intervals)");

// label Y
graph2.labels.labelY = graph2.graph.append("text")
	.attr("class", "y axis-label")
    .attr("x", - (graph2.dimensions.height / 2))
    .attr("y", -40)
	.attr("font-size", "14px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)");

// x scale
graph2.scales.x = d3.scaleBand()
    .range([0, graph2.dimensions.width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

// y scale
graph2.scales.y = d3.scaleLinear()
    .range([graph2.dimensions.height, 0]);

// x axis group (to be called with xAxisCall) -- course 3.25
graph2.axis.xAxisGroup = graph2.graph.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + graph2.dimensions.height + ")");

// y axis group (to be called with yAxisCall)
graph2.axis.yAxisGroup = graph2.graph.append("g")
	.attr("class", "y-axis");

// read data: Total,TimeBin,Women,Men
function read_data_graph_2(competition){
  d3.csv("./data/" + competition + "_hist.csv").then(function(data){
      console.log("Reading " + competition);

      // transform string data to integer
      data.forEach(function(d, i, columns){
          for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
          d.Total = +d.Total;
      });

      graph2[competition] = data;

      // default
      if(competition == 'occ_ut4m_2017_simple_cropped'){
        graph2.data = graph2[competition];
        console.log(graph2.data);
        graph2.filtered = graph2.data['columns'].slice(2);
        graph2.allcolumns = graph2.data['columns'].slice(2);
        graph2.offset.left =  $("#chart-area-graph2-comparison").offset().left;
        graph2.offset.top =  $("#chart-area-graph2-comparison").offset().top;
        update_graph_2(graph2.data);
        graph_2_legend();

        // TODO: factorize this
        // annotation = d3.select("#annotation-chart-1");
        // annotation
        //   .style("opacity", 1)
        //   .style("left", 100 + "px")
        //   .style("top", 0 + "px")
        //   .html(create_annotation_g2(2017));
        // // console.log(graph2.offset.left , graph2.offset.top)
      }

  }).catch(function(error){
  	console.log(error)
  });
}
//
// read_data_graph_2('occ_2014');
// read_data_graph_2('occ_2015');
// read_data_graph_2('occ_2016');
read_data_graph_2('occ_ut4m_2017_simple_cropped');
// read_data_graph_2('ut4m_2017');

// //ESH,ESF,SEH,SEF,V1H,V1F,V2H,V2F,V3H,V3F,V4H,V4F
// $("#play-button-graph-1-2017") //age filter test temp
//     .on("click", function(){
//       console.log(graph2.data.slice(3,8));
//       graph2.data = graph2.data.slice(3,8)
//
//       update_graph_2();
//     });
// $("#button-reset")
//     .on("click", function(){
//       graph2.filtered = graph2.allcolumns;
//       graph2.data = graph2.occ_ut4m_2017_simple_cropped;
//       graph2.min_slice = 0;
//       graph2.max_slice = 41;
//       $("#occ-gender-select").val("occ_gender_all");
//       $("#occ-cat-select").val("occ_cat_all");
//       update_graph_2();
//     });
// $("#occ-gender-select")
//     .on("change", function(){
//         update_graph_2();
//     });
// $("#occ-cat-select")
//     .on("change", function(){
//         update_graph_2();
//     });
//
// //gender -- cat
// function filter_gender(columns)
// {
//   gender = $("#occ-gender-select").val();
//   console.log('Filter on gender: ' + gender);
//
//   // TODO: REDOX - apply cleaner mapping, eg:
//   // filteredDistances = distances.filter(item => item.distance < 10000)
//   // graph2.allcolumns.filter(item => oo);
//
//   return columns.filter(function(d){
//     if(gender == "occ_gender_women"){
//       if (["ESF", "SEF", "V1F", "V2F", "V3F", "V4F"].includes(d)){return d;};
//     }
//     else if (gender == "occ_gender_men") {
//       if(["ESH", "SEH", "V1H", "V2H", "V3H", "V4H"].includes(d)){return d;};
//     }
//     else{
//       return columns;
//     }
//   });
// }
// function filter_cat(columns)
// {
//   var cat = $("#occ-cat-select").val();
//   return columns.filter(function(d){
//     if(cat == "occ_cat_es"){
//       if(["ESF", "ESH"].includes(d)){return d;};
//     }
//     else if (cat == "occ_cat_se") {
//       if(["SEF", "SEH"].includes(d)){return d;};
//     }
//     else if (cat == "occ_cat_ve1") {
//       if(["V1F", "V1H"].includes(d)){return d;};
//     }
//     else if (cat == "occ_cat_ve2") {
//       if(["V2F", "V2H"].includes(d)){return d;};
//     }
//     else if (cat == "occ_cat_ve3") {
//       if(["V3F", "V3H"].includes(d)){return d;};
//     }
//     else if (cat == "occ_cat_ve4") {
//       if(["V4F", "V4H"].includes(d)){return d;};
//     }
//     else{
//       return columns;
//     }
//   });
// }

// $("#date-slider").slider({
//     max: 2017,
//     min: 2014,
//     step: 1,
//     value: 2017,
//     slide: function(event, ui){
//         var year = ui.value;
//         $("#year")[0].innerHTML = year;
//         var competition = "occ_" + year;
//         graph2.data = graph2[competition];
//
//         // // TODO: annotation factorize this
//         // annotation = d3.select("#annotation-chart-1");
//         // annotation
//         //   .style("opacity", 1)
//         //   .style("left", 100 + "px")
//         //   .style("top", 0 + "px")
//         //   .html(create_annotation_g2(year));
//         console.log(annotation.html);
//         update_graph_2(graph2.data);
//     }
// });
// $("#minutes-slider").slider({
//     range: true,
//     max: 900,
//     min: 300,
//     step: 15,
//     values: [300, 900],
//     slide: function(event, ui){
//         console.log('minslider: ' + ui.values[ 0 ] + " - " + ui.values[ 1 ]);
//         graph2.min_slice = (ui.values[ 0 ] - 300) / 15;
//         graph2.max_slice = (ui.values[ 1 ] - 300) / 15;
//         console.log(graph2.min_slice + "-->" + graph2.max_slice);
//         $("#minutes")[0].innerHTML = ui.values[0] + " - " + ui.values[1];
//         update_graph_2();
//     }
// });
//
// function create_annotation_g2(year){
//   var distance = 0;
//   var uphill = 0;
//
//   if(year == 2014){distance = 44.5; uphill = 2100;}
//   if(year == 2015){distance = 45; uphill = 2600;}
//   if(year == 2016){distance = 47; uphill = 2500;}
//   if(year == 2017){distance = 43; uphill = 2700;}
//
//   text = " Distance: " + distance + "km<br> Uphill: "+ uphill + "m";
//   return text;
// };

function update_graph_2(){
  data = graph2.data.slice(graph2.min_slice, graph2.max_slice + 1);

  var keys = graph2.allcolumns;//filter_cat(filter_gender(graph2.allcolumns));
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
	graph2.scales.x.domain(data.map(function(d){ return d.TimeBin; }));

	// y scale domain update
	graph2.scales.y.domain([0, y_domain_max]).nice();

  // useful ordinal color scale
  graph2.scales.color = d3.scaleOrdinal(d3["schemePaired"]).domain(graph2.allcolumns);

	graph2.axis.xAxisCall = d3.axisBottom(graph2.scales.x);
	graph2.axis.xAxisGroup.call(graph2.axis.xAxisCall)
      .selectAll("text")
        .attr("y", "-5")
        .attr("x", "-10")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)");

	graph2.axis.yAxisCall = d3.axisLeft(graph2.scales.y)
		.tickFormat(function(d){
	        return d;
	    });
	graph2.axis.yAxisGroup.call(graph2.axis.yAxisCall);

	// update label
	graph2.labels.labelY.text("Number of runners")

	graph2.t = d3.transition().duration(250);
  var rects = graph2.graph;

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
          return graph2.scales.color(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        //tooltip
        // TODO: IMPORTANT CHECK WHY THIS IS NOT NICE!!! VERY IMPORTANT!!!
        .on("mouseover", function(d) {

          // TODO: update the text based on filters
          var text = "<span style='font-size: 11px'>Total: " + d.data.Total + "<br>";
          text += "Espoir Men: " + d.data.ESH + "<br>";
          text += "Espoir Women: " + d.data.ESF + "<br>";

          text += "</span>";
          console.log(graph2.graph.style("top"));

          // TODO: REDOX factorize offset and change chart name
          tooltipx = d3.select("#tooltip-chart-1");
          tooltipx
            .style("opacity", 0.8)
            .style("left", (d3.event.pageX - graph2.offset.left) + "px")
            .style("top", (d3.event.pageY - graph2.offset.top) + "px")
            .html(text);
          console.log("on mouse in");
        })
        .on("mouseout", function(d) {
          tooltipx = d3.select("#tooltip-chart-1");
          tooltipx
            .style("opacity", 0);
          console.log("on mouse out");
        })
        //setup transition
        .attr("y", graph2.scales.y(0))
        .attr("height", 0)
        .attr("x", function(d){ return graph2.scales.x(d.data.TimeBin) })
        .attr("width", graph2.scales.x.bandwidth())

        //start transition
        .transition(graph2.t)
          .attr("x", function(d) { return graph2.scales.x(d.data.TimeBin); })
          .attr("y", function(d) { return graph2.scales.y(d[1]); })
          .attr("height", function(d) { return graph2.scales.y(d[0]) - graph2.scales.y(d[1]); })
          .attr("width", graph2.scales.x.bandwidth());
//<<----GRAPH
};

function graph_2_legend()
{
  // useful ordinal color scale
  var cathegory_text = [
    "OCC, W",
    "OCC, M",
    "UT4M, W",
    "UT4M, M",
  ];
  graph2.scales.color = d3.scaleOrdinal(d3["schemePaired"]).domain(cathegory_text);//graph2.allcolumns);

  var legend = graph2.graph.append("g")
      .attr("font", "Arial")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(cathegory_text)//graph2.allcolumns) //.reverse() if you wish
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
      .attr("cx", graph2.dimensions.width + 50)//)//- 19)
      .attr("r", 5)
      // .attr("width", 19)
      // .attr("height", 19)
      .attr("fill", graph2.scales.color)
      .attr('transform', 'translate(' + 2 + ',' + 9 + ')');

  legend.append("text")
      .attr("x", graph2.dimensions.width + 44)//- 6)//- 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
}
