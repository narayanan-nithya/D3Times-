//  @TODO: YOUR CODE HERE!    
var svgWidth = 960;
var svgHeight = 500;
var plotmargin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var plotwidth = svgWidth - plotmargin.left - plotmargin.right;
var plotheight = svgHeight - plotmargin.top - plotmargin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${plotmargin.left}, ${plotmargin.top})`);

  var selectedAxis = "poverty",
    anotherselection = "healthcare"

function x_axis_selection (data, selectedAxis) {
    var x = d3.scaleLinear().range([0, plotwidth]);
    
    x.domain(d3.extent(data, d => d[selectedAxis]));
    return x;
}
function x_axis_update (newscale, xaxis){
  var xaxis = d3.axisBottom(newscale);
  xaxis.transition()
    .duration(1000)
    .call(bottom_xaxis);
  return xaxis;
}
function showcircles(circlesGroup, newscale, selectedAxis,anotherselection){
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newscale(d[selectedAxis],d[anotherselection]));
  return circlesGroup;
}
function updateToolTip(selectedAxis,anotherselection, circlesGroup) {
  var label;

  if (selectedAxis === "poverty") {
    label = "Poverty:";
  }
  else if (anotherselection === "healthcare") {
    label = "Healthcare: ";
  }
  
  var tooltip = d3.tip()
    .attr("class", "d3-tip")  
    .offset([70, -50])
    .html(d => {
        return (`${d.state}<br>${d[selectedAxis]}<br>${d[anotherselection]}`)});
  
   
    //Step 7
  chartGroup.call(tooltip);
    //Step 8
  circlesGroup.on("mouseover", (data) => {
        tooltip.show(data);
       // alert('inside clic');
    })
    .on("mouseout", (data) =>{
        tooltip.hide(data);
      //  alert('outside of click');
    });
    return circlesGroup;
}
d3.csv("data.csv").then((data) => {
//Step 1
    data.forEach(plotdata => {
        plotdata.poverty = +plotdata.poverty;
        plotdata.healthcare = +plotdata.healthcare;
        plotdata.abbr = plotdata.abbr;
    });
  
  //Step 2 
   
    var x = x_axis_selection (data, selectedAxis, anotherselection);
    var y = d3.scaleLinear().range([plotheight, 0]);
    y.domain(d3.extent(data, d => d.income));
    //Step 3 
    var xaxis = d3.axisBottom(x);
    var yaxis = d3.axisLeft(y);
    //Step 4
    chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${plotheight})`)
    .call(xaxis);

    chartGroup.append("g")
    .call(yaxis);
    //Step 5 
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d[selectedAxis],d[anotherselection]))
    .attr("cy", d => y(d.income))
    .attr("r", "12")
    .attr("fill","orange")
    .attr("opacity", "0.7");
 
   var circlesGroup = updateToolTip(selectedAxis,anotherselection, circlesGroup);
  

   // Create axes labels
   chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - plotmargin.left + 25)
   .attr("x", 0 - (plotheight / 2))
   .attr("class", "axisText")
   .text("State");

   chartGroup.append("text")
   .attr("transform", `translate(${plotwidth / 2}, ${plotheight + plotmargin.top + 25})`)
   .attr("class", "axisText")
   .text("In Poverty (%) and Lack Of Healthcare (%)");
   
}).catch(function(error) {
 console.log(error);
});
