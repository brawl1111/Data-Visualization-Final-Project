globalData = [];
var globalXScale;
var svgWidth = 1000;
var svgHeight = 600;

d3.csv("candy.csv", function(csv) {
	//console.log(csv);
	var headerNames = d3.keys(csv[0]);
	var keys = []; 	//this holds all the names of the yummy candies
	for (i = 6; i < 53; i++) {
		keys.push(headerNames[i]);
	}

	var realData = []; //holds objects {key: candy name as string, value: its score as int}

	keys.forEach(function(element, index) {
		var sum = d3.sum(csv.map(function (d) {
			if (d[element] === "JOY") return 1;
			else if (d[element] === "MEH") return 0;
			else return -1;	
		}));

		var obj = {
			key: element,
			value: sum
		}
		realData.push(obj);
	});

	realData.splice(26,1); //removed mint kisses because i couldnt find a picture
	realData.splice(13,1); //removed jolly_rancher_good_flavor because it didn't make sense
	//console.log(realData);
	globalData = realData;


	var svg = d3.select("#swarmgraph")
	var margin = {top: 20, right: 20, bottom: 20, left: 20};
	var width = svg.attr("width") - margin.left - margin.right;
	console.log(width);
	var height = svg.attr("height") - margin.top - margin.bottom;
	var swarmG = svg.append("g").attr("id", "actualGraph");

    console.log(d3.extent(realData.map(d => d.value)));

    var xScale = d3.scaleLinear()
	    .domain(d3.extent(realData.map(d => d.value)))
	    .range([margin.left + 20, width - 40]);
	
	var ratingsScale = d3.scaleOrdinal()
		.domain(["DESPAIR!", "MEH...", "JOY!"])
		.range([margin.left + 20, width/2, width -40]);

	var xAxis = d3.axisBottom().scale(ratingsScale)
		.tickSize(20)
		.ticks(3)
		.tickPadding(15);

    globalXScale = xScale;


    svg.append('g').attr("id", "images").selectAll("defs")
    	.data(realData)
    	.enter()
    	.append("pattern")
    	.attr("id", d => d.key)
    	.attr('patternUnits', 'userSpaceOnUse')
    	.attr('width', 60)
        .attr('height', 60)
       .append("image")
        .attr("xlink:href", function(d) {return "pics/" + d.key + ".jpg"})
        .attr('width', 60)
        .attr('height', 60);

    var simulation = d3.forceSimulation(realData)
      .force("x", d3.forceX(function(d) { return xScale(d.value); }).strength(5))
      .force("y", d3.forceY("230"))
      .force("collision", d3.forceCollide().radius(d => 28))
      .force('charge', d3.forceManyBody().strength(5))
      .on('tick', ticked);
      console.log(globalData);

      swarmG // appends axis
		.append("g") // create a group node
		.attr("class", "whiteAxis")
		.attr("transform", `translate(0, ${svgHeight - 120})`)
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x",29)
		.attr("y", 40)
		.style("font-size","100px");

	var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "#965ba5")
        .style("border-radius", "6px")
        .style("text-align", "center")
        .style("font-family", "sans-serif")
        .style("width", "200px")
        .style("font-weight", "bold")
        .text("");


	swarmG.selectAll("circle")
    	.data(realData)
    	.enter()
    	.append("circle")
    	.attr("r", 28)
    	.attr("fill", function(d) {return "url(#" + d.key + ")"})
    	.on("mouseover", function(d) {
                tooltip.html(d.key);
                return tooltip.style("visibility", "visible").style("opacity", 0.9);
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").style("opacity", 0.9);
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
    	.attr("cx", d=>d.x)
    	.attr("cy", d=>d.y);



    
});

// var simulation = d3.forceSimulation(globalData)
//   .force('charge', d3.forceManyBody().strength(5))
//   .force('x', d3.forceX().x(function(d) {
//     return xScale(d.value);
//   }))
//   .force('y', d3.forceY().y(function(d) {
//     return 0;
//   }))
//   .force('collision', d3.forceCollide().radius(function(d) {
//     return 5;
//   }))
//   .on('tick', ticked);


  function ticked(realData) {
  	//console.log("tick");

  	/*var tooltip = globalSVG
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "400px")
            .text("");*/



    var swarmG = d3.select("#swarmgraph").select("g").selectAll("circle")
    	.data(globalData);

    	swarmG.enter()
    	.append("circle")
    	.attr("r", 28)
    	.attr("fill", function(d) {return "url(#" + d.key + ")"})
    	/*.on("mouseover", function(d) {
                tooltip.html(d.key + "<br>" + d.value);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })*/
    	.merge(swarmG)
    	.transition()
    	.ease(d3.easeBounceOut)
    	.duration(120)
    	.attr("cx", d=>d.x)
    	.attr("cy", d=>d.y)
    	
    swarmG.exit().remove();





	}

    /*


    for (var i=0; i<csv.length; ++i) {
		csv[i].GPA = Number(csv[i].GPA);
		csv[i].SATM = Number(csv[i].SATM);
		csv[i].SATV = Number(csv[i].SATV);
		csv[i].ACT = Number(csv[i].ACT);
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });    

    
    var satExtents = {
	"SATM": satmExtent,
	"SATV": satvExtent
    }; 


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);
 
    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);
     
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
  
    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);

    //Create SVGs and <g> elements as containers for charts
    var chart1G = d3.select("#chart1")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


    var chart2G = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height)
                    .append('g');


	 //add scatterplot points

	 var currentlySelected = -1;
	 //var currentlySelectedACT = 0;

     var temp1= chart1G.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return i;} )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale(d.SATM); })
	   .attr("cy", function(d) { return yScale(d.SATV); })
	   .attr("r", 5)
	   .on("click", function(d,i){
	   		d3.select("#chart2")
	   		.select('[id="' + this.id + '"]') 
	   		.classed("selected", true);

	   		d3.select("#chart2")
	   		.select('[id="' + currentlySelected + '"]') 
	   		.classed("selected", false);

			d3.select("#chart1")
	   		.select('[id="' + currentlySelected + '"]') 
	   		.classed("selected", false);

	   		currentlySelected = this.id;


	   		d3.select("#satm")
	   		.text("" + d.SATM);
	   		d3.select("#satv")
	   		.text("" + d.SATV);
	   		d3.select("#act")
	   		.text("" + d.ACT);
	   		d3.select("#gpa")
	   		.text("" + d.GPA);
       });

    var temp2= chart2G.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return i;} )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale2(d.ACT); })
	   .attr("cy", function(d) { return yScale2(d.GPA); })
	   .attr("r", 5)
	   .on("click", function(d,i){ 
	   		d3.select("#chart1")
	   		.select('[id="' + this.id + '"]') 
	   		.classed("selected", true);

	   		d3.select("#chart1")
	   		.select('[id="' + currentlySelected + '"]') 
	   		.classed("selected", false);

	   		d3.select("#chart2")
	   		.select('[id="' + currentlySelected + '"]') 
	   		.classed("selected", false);
	   		currentlySelected = this.id;

	   		d3.select("#satm")
	   		.text("" + d.SATM);
	   		d3.select("#satv")
	   		.text("" + d.SATV);
	   		d3.select("#act")
	   		.text("" + d.ACT);
	   		d3.select("#gpa")
	   		.text("" + d.GPA);
       });
    


    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("SATM");

    chart1G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("SATV");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis2)
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("ACT");

    chart2G // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis2)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA");
	});
	*/


