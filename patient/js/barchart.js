function barchart(data){
  const width = document.getElementById('svg-area').offsetWidth;
  const height = document.getElementById('svg-area').offsetHeight;
  const x = d3.scaleBand().domain(data.map(d => d.name)).range([0, width]).padding(0.4);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([height, 0]);
  const xAxis = g => g.attr("class", "textname").call(g => g.select('.domain').remove()).call(g => g.selectAll('line').remove());
  const svg = d3.select('#svg-area').append('svg');
  var valdata = data.map(function(v){return v.value});
  valdata= Math.max.apply(null,valdata);
  svg.append('g').call(xAxis).selectAll('g').data(data).enter().append('g').append('text').text(function(d) {return d.name;});
  svg.append('g').selectAll('rect').data(data).enter().append('rect').attr("class", "ch").attr("rx", "20")
    .attr('y', function(d) {
        return (100 - (d.value - valdata + 100)) + '%';
    })
    .attr('height', function(d) {
        return (d.value - valdata + 85) + '%';
    }).attr('data-x', d => d.name).attr('data-y', d => d.value);
  svg.node();
  const rectEl = document.getElementsByTagName('rect');
  var tatgetTag = document.querySelector('.bar_tip');
  for (let index = 0; index < data.length; index++) {
    let element = document.createElement('li');
    let text = JSON.stringify(data[index].value).replace(/\"/gi, "");
    element.innerHTML = "<span>"+text+"회</span>";
    var atop = Math.floor(rectEl[index].getBoundingClientRect().y);
    element.style.top = atop + 'px';
    if(text == valdata){
      element.classList.add("on");
      $("#svg-area rect").eq(index).addClass("task0")
      $("#svg-area .textname g").eq(index).addClass("on")
    }
    tatgetTag.append(element);
  }          
  for(const el of rectEl) {
    el.addEventListener('mouseover', (event) => {
      const target = event.target;
      const index = Array.from(el.parentElement.children).indexOf(el)
      $("#svg-area .bar_tip li").eq(index).addClass("on").siblings().removeClass("on");
      $("#svg-area .textname g").eq(index).addClass("on").siblings().removeClass("on");
      $("#svg-area rect").attr("class", "");
      target.classList.add("task0");
    });
  }
}