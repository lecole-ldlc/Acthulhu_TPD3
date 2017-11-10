function draw_barchart(data, element, total) {
    console.log("Barchart task loading");
      // Chart initialization
	$(element).html("");
  	var svg = d3.select(element),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + 	margin.top + ")");
        console.log(g);

  	// X axis
    var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  	// y axis
    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  	//load data
    var group_by;
    if(!total) {
        // Group by status
        group_by = 'status'
    }
    else {
        group_by = 'priority'
    }

    var nested_data = d3.nest()
            .key(function (d) {
                return d[group_by];
            })
             .rollup(function (leaves) {
                    return {
                        "total_cpt": leaves.length, // Compute the number of tasks in each groupe
                        // Compute the total time associated with the tasks in this group
                        "total_time": d3.sum(leaves, function (d) {
                            return parseFloat(d.time);
                        })
                    }
                })
            .entries(data);

      console.log(nested_data);

      // Color scale
      var z = d3.scaleOrdinal(d3.schemeCategory10);

      // Set domains of axes scales
      x.domain(nested_data.map(function(d) { return d.key; }));
      y.domain([0, d3.max(nested_data, function(d) { return d.value.total_time; })]);
      z.domain(nested_data.map(function(d) { return d.key; }))

      // Draw rect
      g.selectAll("rect")
    	.data(nested_data)
    	.enter().append("rect")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value.total_time); })
      .attr("height", function(d) { return height - y(d.value.total_time);})
      .attr("width", x.bandwidth())
      //.attr("fill", "red")
      .attr("fill", function(d,i) { return z(d.key); })



      // Draw x axis
      g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      // Draw y axis
  		g.append("g")
      	.attr("class", "axis")
      	.call(d3.axisLeft(y).ticks(null, "s"))

}


