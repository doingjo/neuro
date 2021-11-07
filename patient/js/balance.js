function balance(data){
  var dataLength = data.length -1;
  var startDay = data[0].day;
  var endDay = data[dataLength].day;
  const ojstag = document.getElementById('balancesvg');
  ojstag.style.height = dataLength * 13 + "vw";
  const ojs = document.getElementById('balance');
  const width = ojs.offsetWidth;            
  const height = ojs.offsetHeight - 20;
  const yScale = d3.scaleLinear().domain([endDay, startDay]).range([30, height]);  
  const xScale = d3.scaleLinear().domain([6, 0]).range([width, 10]);          
  const yAxisSVG = d3.select("svg").append("g");
  const yAxis = d3.axisRight(yScale).tickSize(0).ticks(dataLength);
  yAxis(yAxisSVG);
  const linearGenerator = d3.line()
    .x(function(d, index) {
      if(d.value == null){
        if(index == dataLength){
          return xScale(data[index - 1].value)
        }else{
          return xScale(data[index + 1].value)
        }
      }else{
        return xScale(d.value)
      }
    })
    .y(function(d, index) {
      if(d.value == null){
        if(index == dataLength){
          return yScale(data[index - 1].day)
        }else{
          return yScale(data[index + 1].day)
        }
          return yScale(d.day)
      }else{
        return yScale(d.day)
      }
    });
  d3.select("svg").data(data).selectAll(".tick").attr('class', function(d) {
    var index = data.findIndex(i => i.day == d); 
    if(data[index].value == null){
      return "nodata";
    }else{
      return 'tick';
    }
  })
  d3.select("svg").append("path").attr("d", linearGenerator(data)).attr("fill", "none").attr("stroke-width", 3).attr("opacity", .1).attr("stroke", "#5280e3");
  d3.select("svg").selectAll("circle").data(data).enter().append("circle").attr("r", 10)
    .attr('cx', function(d, index) {
      if(d.value == null){
        if(index == dataLength){
          return xScale(data[index - 1].value)
        }else{
          return xScale(data[index + 1].value)
        }
      }else{
        return xScale(d.value)
      }
    }).attr('cy', function(d, index) {
      if(d.value == null){
        if(index == dataLength){
          return yScale(data[index - 1].day)
        }else{
          return yScale(data[index + 1].day)
        }
      }else{
        return yScale(d.day)
      }
    }).style("fill", "#fff").attr("stroke-width", 3).attr("stroke", "#5280e3");
}