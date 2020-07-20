
let svgWidth = 780;
let svgHeight = 480;

let margin = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 20
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {

    //Read the data
    console.log(stateData);
    //convert data to numbers 
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });  
    // Scale functions   
    let xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    let yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    //Create axis  
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //append axis   
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

     let circleText= chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("text-anchor","middle")
    .attr("stroke","Black")
    .attr("stroke-width","1px")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare));

    //Create the circles 

    let circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "20")
    .attr("fill", "aquamarine")
    .attr("opacity", ".6");

    //tooltip function 

    let toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>poverty: ${d.poverty} % <br>Healthcare: ${d.healthcare} %`);
    });

    // Step 7: Create tooltip in the chart

    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


    
    // Create axes labels
    chartGroup.selectAll("circle")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare %");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
    .attr("class", "axisText")
    .text("Poverty %");





}).catch(function(error) {
    console.log(error);
  });












