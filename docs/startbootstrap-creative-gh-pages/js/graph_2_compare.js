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

                  //labels
                  labelX:'',
                  labelY:'',
                  labelYText:'',
                  // x:'',
                  // y:'',
                  xAxisGroup:'',
                  yAxisGroup:'',
                  g:'',
                  data:'',
                  ut4m_2017:'',
                  occ_2017:'',
                  occ_ut4m_2017:'',
                  filtered:'',
                  allcolumns:'',
                  min_slice: 0,
                  max_slice: 41,
                };

var area_width = parseInt(d3.select("#chart-area-graph2-comparison").style("width"), 10);

graph_2.dimension.width = area_width - graph_2.margin.left - graph_2.margin.right;
graph_2.dimension.height = 480 - graph_2.margin.top - graph_2.margin.bottom;

graph_2.graph = d3.select("#chart-area-2")
        .attr("width", width + graph_2.margin.left + graph_2.margin.right)
        .attr("height", height + graph_2.margin.top + graph_2.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + graph_2.margin.left
            + ", " + graph_2.margin.top + ")");

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

read_data('occ_ut4m_2017');

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

      graph_2[competition] = data;

      // default
      if(competition == 'occ_ut4m_2017'){

        graph_2.data = graph_2[competition];
        console.log(graph_2.data);
        //g1_params.filtered = g1_params.data['columns'].slice(4);
        graph_2.allcolumns = graph_2.data['columns'].slice(4);
        graph_2.offset.left =  $("#chart-area-2").offset().left;
        graph_2.offset.top =  $("#chart-area-2").offset().top;
        update_graph_2();
        //graph_1_legend();

        // TODO: factorize this
        // annotation = d3.select("#annotation-chart-1");
        // annotation
        //   .style("opacity", 1)
        //   .style("left", 100 + "px")
        //   .style("top", 0 + "px")
        //   .html(create_annotation_g1(2017));
      }

  }).catch(function(error){
  	console.log(error)
  });
}

function update_graph_2()
{
  data = graph_2.data.slice(g1_params.min_slice, g1_params.max_slice + 1);

  var keys = filter_cat(filter_gender(graph_2.allcolumns));
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

	// y scale domain update
	graph_2.scale.y.domain([0, y_domain_max]).nice();

  //Append.
  graph_2.graph.append("g")
    .selectAll("g")
    //MANAGE STACKING
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) {
        return graph_2.scale.color(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      //setup transition
      .attr("y", y(0))
      .attr("height", 0)
      .attr("x", function(d){ return x(d.data.TimeBin) })
      .attr("width", x.bandwidth())

      //start transition
      .transition(t)
        .attr("x", function(d) { return x(d.data.TimeBin); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());
  }
