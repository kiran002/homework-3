function draw(data,j) {
    var scale = d3.scale.linear()
        .domain([0, 50])
        .range([0, 100]);

    var bars = d3.select("#work_queues_chart")
        .selectAll("div")
        .attr("id","work_queues_chart")
        .data(data);
     
    // enter selection
    bars
        .enter().append("div");

// these are for the labels of the bar chart
	var texts = ["Voted Up","Voted Down"];
	var values = [25-j,j];    
	// update selection
		bars.transition().duration(1000)
        .style("width", function (d) {return d * 10 + "px";})
        .text(function (d,i) {return texts[i] +  "  "  + values[i] + " : " + Math.round(d) + "%";});
    
    // exit selection
    bars
        .exit().remove();
};

