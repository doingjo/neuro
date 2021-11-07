function bubble(data){
  var diameter = 600,color = d3.scaleOrdinal(d3.schemeCategory20c);
  var bubble = d3.pack().size([diameter, diameter]).padding(5);
  var svg = d3.select('#bubble_chart').append('svg').attr('viewBox','0 0 ' + diameter + ' ' + diameter).attr('width', '100%').attr('height', '100%').attr('class', 'chart-svg');
  var root = d3.hierarchy(data).sum(function(d) { return d.value; }).sort(function(a, b) { return b.value - a.value; });
  bubble(root);
  var node = svg.selectAll('.node').data(root.children).enter().append('g').attr('class', 'node').attr('transform', function(d) { return 'translate(' + d.x + ' ' + d.y + ')'; }).append('g').attr('class', 'graph');
  node.append("circle").attr("r", function(d) { return d.r; }).style("fill", function(d) { 
    return d.data.color; 
  });
  node.append("text").attr("dy", ".3em").style("font-weight", "bold").style("text-anchor", "middle")
  .text(function(d) { 
    return d.data.value + '회'; 
  }).style("fill", "#ffffff").style("font-size", function(d) { return (d.r/10) + 'vw'; })
  var tatgetTag = document.querySelector('.bubble_texts');
  for (let index = 0; index < data.children.length; index++) {
    let element = document.createElement('li');
    let text = JSON.stringify(data.children[index].name).replace(/\"/gi, "");
    let color = JSON.stringify(data.children[index].color).replace(/\"/gi, "");
    element.innerHTML = "<span><i style='background:"+color+"'></i>"+text+"</span>";
    tatgetTag.append(element);
  }
}