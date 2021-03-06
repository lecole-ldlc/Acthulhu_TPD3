function barcharttask() {
    console.log("Barchart task loading");
      // Chart initialization
  	var svg = d3.select("#barcharttask"),
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
    d3.csv("data/data_task_100.csv", function(data){
     	console.log(data);

      // Group by status
      var nested_data = d3.nest()
				.key(function(d) { return d.status; })
      	.rollup(function(d){
          return d3.sum(d, function(g){
            return g.time
          })
        })
				.entries(data);

      nested_data.forEach(function(d){
        d.status = d.key;
        d.sumtime = d.value;
      });
      console.log(nested_data);
      //console.log(nested_data);

      // Color scale
      var z = d3.scaleOrdinal(d3.schemeCategory10);

      // Set domains of axes scales
      x.domain(nested_data.map(function(d) { return d.key; }));
      y.domain([0, d3.max(nested_data, function(d) { return d.sumtime; })]);
      z.domain(nested_data.map(function(d) { return d.key; }))

      // Draw rect
      g.selectAll("rect")
    	.data(nested_data)
    	.enter().append("rect")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.sumtime); })
      .attr("height", function(d) { return height - y(d.sumtime);})
      .attr("width", x.bandwidth())
      //.attr("fill", "red")
      .attr("fill", function(d,i) { return z(d.key); })
      .on("mouseover", function() { tooltip.style("display", null); })
  		.on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
    		var xPosition = d3.mouse(this)[0] - 0;
    		var yPosition = d3.mouse(this)[1] - 25;
    		tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    		tooltip.select("text").text(d.sumtime);
       });


      // Draw x axis
      g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      // Draw y axis
  		g.append("g")
      	.attr("class", "axis")
      	.call(d3.axisLeft(y).ticks(null, "s"))



    });
		// Prep the tooltip bits, initial display is hidden
		var tooltip = svg.append("g")
  		.attr("class", "tooltip")
  		.style("display", "none");

		tooltip.append("rect")
  		.attr("width", 30)
  		.attr("height", 20)
  		.attr("fill", "white")
  		.style("opacity", 0.5);

		tooltip.append("text")
  		.attr("x", 15)
  		.attr("dy", "1.2em")
  		.style("text-anchor", "middle")
  		.attr("font-size", "12px")
  		.attr("font-weight", "bold");
}