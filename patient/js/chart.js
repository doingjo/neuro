var Browser = {chk : navigator.userAgent.toLowerCase()}
Browser = {ie : Browser.chk.indexOf('msie') != -1, ie6 : Browser.chk.indexOf('msie 6') != -1, ie7 : Browser.chk.indexOf('msie 7') != -1, ie8 : Browser.chk.indexOf('msie 8') != -1, ie9 : Browser.chk.indexOf('msie 9') != -1, ie10 : Browser.chk.indexOf('msie 10') != -1, ie11 : Browser.chk.indexOf('msie 11') != -1, opera : !!window.opera, safari : Browser.chk.indexOf('safari') != -1, safari3 : Browser.chk.indexOf('applewebkir/5') != -1, mac : Browser.chk.indexOf('mac') != -1, chrome : Browser.chk.indexOf('chrome') != -1, firefox : Browser.chk.indexOf('firefox') != -1}
var responCheck = Browser.ie7 || Browser.ie8;

// mobile case :: scroll size
var mobile = (/iphone|ipod|ipad|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
if (mobile) {
  $("html").addClass("mobile");
}

if (Browser.ie7) {
  $("html").addClass("ie7");
} else if(Browser.ie8){
  $("html").addClass("ie8");
} else if(Browser.ie9){
  $("html").addClass("ie9");
} else if(Browser.ie10){
  $("html").addClass("ie10");
} else {
  // mordern brow.
} function lowMsg(){
  //document.write('<div style="position:absolute; top:0; right:0; border:3px solid black">ie7/8</div>');
}

var chart = chart || {
    init:function() {

    },
    balanceChart:function($this, data){
      if($($this).length == 0){return}
      var box = $($this),
          boxWrap = box.closest('.chart_wrap'),
          dataSet = data,
          dataLength = data.length;
      box.css('width', dataLength*11.1111+'vw');
      var width = box.width(),
          height = box.height();
      var xScale = d3.scaleBand()
          .domain(dataSet.map(function(d){return d.day}))
          .range([0, width]);
      var yScale = d3.scaleLinear()
          .domain([1, 3])
          .range([(height/6)*4, 0]);
      var svg = d3.select($this).append('svg').attr('width', width).attr('height', height);
          g = svg.append('g').attr('transform', 'translate(0,'+(height/6)*1+')');
      // line chart
      var line = d3.line()
         .x(function(d){return xScale(d.day) + xScale.bandwidth() / 2})
         .y(function(d){return yScale(d.value)})
      g.append('path')
         .attr('class', function(d, i){return 'line'})
         .attr('d', line(dataSet));
      g.selectAll('rect')
          .data(dataSet)
          .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('cx', function(d){return xScale(d.day) + xScale.bandwidth() / 2})
          .attr('cy', function(d){return yScale(d.value)})
          .attr('r', '8');
      // calendar
      var _liHtml = '',
          weeklistArr = [];
      for(var idx = 0; idx < dataLength; idx++){
        _liHtml += '<li><em>'+dataSet[idx].week+'</em><span>'+dataSet[idx].day.substr(8, 2)+'</span></li>';
        weeklistArr.push({left:(width/dataLength)*idx, year:dataSet[idx].day.substr(0, 4), month:parseInt(dataSet[idx].day.substr(5, 2))});
      }
      box.append('<ul>'+_liHtml+'</ul>');
      // scroll check month
      var uniqueArr = weeklistArr.filter((thing, index, self) =>index === self.findIndex((t) => (t.month === thing.month)));
      boxWrap.parent().prepend('<div class="date">'+uniqueArr[0].year+'.'+uniqueArr[0].month+'</div>');
      var target = false;
      boxWrap.on('scroll', function(e){
        if(uniqueArr[1].left <= e.target.scrollLeft && !target){
          $('.date').html(uniqueArr[1].year+'.'+uniqueArr[1].month);
          target=true;
        }
        if(uniqueArr[1].left > e.target.scrollLeft && target && uniqueArr[0].left <= e.target.scrollLeft){
          $('.date').html(uniqueArr[0].year+'.'+uniqueArr[0].month);
          target=false;
        }
      });
      //event
      var _dateLi = box.find('li');
      _dateLi.on('click', function(e){
        var index = $(this).index();
        $(this).addClass('on').siblings().removeClass('on');
        box.find('.dot').eq(index).addClass('on').siblings().removeClass('on');
      });
      if(!_dateLi.hasClass('on')){ _dateLi.eq(0).trigger("click"); }

          //   $(".as_tab_wrap .as_tab_menu > li.active > a").trigger("click");
          // } else {
          //   $(".as_tab_wrap .as_tab_menu > li:first-child > a").trigger("click");
          // }

    },
    lineChart:function($this, data){
      if($($this).length == 0){return}
      var box = $($this),
          dataSet = data,
          boxWidth = box.width(),
          boxHeight = Math.round(boxWidth*.2461),
          margin = {top:Math.round(boxWidth*.0307), right:Math.round(boxWidth*.023), bottom:Math.round(boxWidth*.0423), left:Math.round(boxWidth*.0423)},
          width = boxWidth - (margin.left + margin.right),
          height = boxHeight - (margin.top + margin.bottom);
      var xScale = d3.scaleBand()
          .domain(dataSet.map(function(d){return d.date}))
          .range([0, width]);
      var yScale = d3.scaleLinear()
          .domain([0, Math.ceil( d3.max(dataSet, function(d){return d.value}))*2])
          .range([height, 0]);
      var svg = d3.select($this).append('svg').attr('width', boxWidth).attr('height', boxHeight);
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      // axis-x
      g.append('g')
       .attr('class', 'axis axis-x')
       .attr('transform', 'translate(0,' + height + ')')
       .call(d3.axisBottom(xScale))
       .call(g => g.select('.domain').remove())
       .call(g => g.selectAll('line').remove());
      // axis-y
      g.append('g')
       .attr('class', 'axis axis-y')
       .call(d3.axisLeft(yScale).ticks(4).tickSize(-width))
       .call(g => g.select('.domain').remove())
       .call(g => g.selectAll('line').style('stroke', '#ddd'));

      const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

      const area = d3.area()
        .x(d => xScale(d.date))
        .y0(yScale(0))
        .y1(d => yScale(d.value));

      const grad = g.append("defs").append("linearGradient")
        .attr("id", "grad")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");

      grad.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#68f2a3")
        .style("stop-opacity", .5);

      grad.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#3fb3ff")
         .style("stop-opacity", 0);

      var lineWrap = g.append('g')
                      .attr('class', 'line')
                      .attr('transform', 'translate('+ (width / dataSet.length)/2 +',0)');
      lineWrap.append("path")
        .datum(dataSet)
        .style("fill", "url(#grad)")
        .attr("d", line)
        .attr("d", area);

      lineWrap.append("path")
        .datum(dataSet)
        .attr("fill", "none")
        .attr("stroke", "#5280e2")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      svg.node();
    },
    pieChart: function($this, data){
        var box = $($this),
            dataSet = data,
            width = box.width(),
            height = Math.round(width*.559),
            innerR = width*.3863,
            outerR = width/2,
            circleR = (outerR - innerR) / 2;
        var percentI = ( dataSet.value <= 100 ) ? -(dataSet.value/200) : (dataSet.value/200)-0.5;
        var percentII = percentI + (dataSet.value/200);
        var arcData = [
            {startAngle:(Math.PI * -0.5), endAngle:(Math.PI*0.5), bgColor:'#21d0b3'},
            {startAngle:(Math.PI * 0), endAngle:Math.PI * percentI, bgColor:'#5280e2'},
        ];
        var circleData = [
            {idx: 1,label:'', startAngle:(Math.PI * -0.5), endAngle:(Math.PI * -0.5), bgColor:'#21d0b3'},
            {idx: 2,label:'', startAngle:(Math.PI * -0.5), endAngle:(Math.PI * 1.5), bgColor:'#21d0b3'},
            {idx: 3,label:'', startAngle:(Math.PI * 0), endAngle:(Math.PI * 0), bgColor:'#5280e2'},
            {idx: 4,label:'', startAngle:(Math.PI * 0), endAngle:Math.PI * (percentI*2), bgColor:'#5280e2'},
        ];
        //dot
        var list = '',
            percent = '',
            stand = 200/12;
        for(var i=1; i <= 12; i++){
          (stand*i > dataSet.value)? percent = 'off': percent = 'on';
          if(dataSet.value >= 100){ if(i <= 6){percent = 'off'} }
          list += '<li class="dot'+i+' '+percent+'"></li>';
        }
        box.append('<ul class="dot-list">'+list+'</ul>');
        box.append('<p class="pin"></p>');
        $pin = (dataSet.value <= 100)? -(dataSet.value*.9) : (dataSet.value-100)*.9;
        $val = (dataSet.value <= 100)? dataSet.value : dataSet.value-100;
        //box.append('<p class="txt_val">'+ $val +'</p>');
        box.find('.pin').css('-webkit-transform','rotate('+ $pin +'deg)');
        box.css("height", height);
        var svg = d3.select($this).append("svg").attr("width", width).attr("height", height);
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height-circleR) + ")");
        var arcGenerator = d3.arc()
            .innerRadius(innerR)
            .outerRadius(outerR);
        g.selectAll('path')
            .data(arcData)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .each(function(d) {
                d3.select(this)
                .attr("fill", d.bgColor)
            });
        var circleGp = g.selectAll('g').data(circleData)
              .enter().append("g");
        circleGp.append('circle')
            .each(function(d) {
                var centroid = arcGenerator.centroid(d);
                if( d.idx == 4 ){
                  d3.select(this)
                    .attr('cx', centroid[0])
                    .attr('cy', centroid[1])
                    .attr('r', (circleR-4))
                    .attr('style', 'stroke:'+d.bgColor+'; stroke-width:8; fill: #fff;')
                }else{
                    d3.select(this)
                    .attr('cx', centroid[0])
                    .attr('cy', centroid[1])
                    .attr('r', circleR)
                    .attr('style', 'fill:'+ d.bgColor)
                }
            });
        circleGp.append('text')
            .each(function(d) {
                var centroid = arcGenerator.centroid(d);
                if( d.idx == 1 || d.idx == 4 ){
                    d3.select(this)
                    .attr('style', 'display:none');
                }else{
                    d3.select(this)
                    .attr('x', centroid[0])
                    .attr('y', centroid[1])
                    .attr('dy', '0.33em')
                    .attr('style', 'fill:'+ d.bgColor)
                    .text(d.label);
                }
            });
    },
    walkChart: function($this, data){
      var box = $($this),
          averNo = data.find(x => x.name === '표준').stance,
          averHtml = `<span class="averline" style="left:${averNo}%"></span>`;
      box.append(`<div class="legend"><strong>입각기 <span>(Stance Phase)</span></strong><strong>유각기 <span>(Swing Phase)</span></strong></div>`);
      box.append(averHtml);
      for(var  index = 0; index < data.length; index++){
        var name = data[index].name,
            left = data[index].stance,
            right = data[index].swing,
            leftClass ='',
            color = '';
        if(left >= 92 && left < 97){leftClass='f'}else if(left >= 97){if(left == 100){leftClass='fff'}else{leftClass='ff'}}
        if(name == '왼발'){color='left'}else if(name == '오른발'){color='right'}else{color='aver'}
        var liHtml = `<div class="bar-wrap ${leftClass} ${color}"><span class="name">${name}</span><div class="bar"><span class="stance" style="width:${left}%"> </span></div><span class="stance_tx" style="left:${left}%">${left}</span><span class="swing_tx">${right}</span></div>`
        box.append(liHtml);
      }
    },
    analysisChart: function($this, data, type){
      var box = $($this),
          dataSet = data,
          valueTxt,
          averageTxt;
      if( type === 3 ){
        box.append('<div class="legend">'+ dataSet.value +'</div>').addClass('type3');
        averageTxt = dataSet.average;
      }else{
        if( type === 1 ){
          valueTxt = dataSet.value;
          averageTxt = dataSet.average;
        }else{
          valueTxt = dataSet.value +' : '+ (100 - dataSet.value);
          averageTxt = dataSet.average +' : '+ (100 - dataSet.average);
        }
        box.append('<div class="legend"><em>'+ dataSet.tit +'</em><strong>'+ valueTxt +'</strong></div>');
      }
      box.append('<div class="bar-wrap"><p class="average" style="left:'+ dataSet.average +'%;"><span>'+ dataSet.averageTxt +' '+ averageTxt +'</span></p><div class="bar" style="background-color:'+ dataSet.bgColor +';"><span style="width:'+ dataSet.value +'%; background-color:'+ dataSet.barColor +';"></span></div></div>');
    },
    achieveChart: function($this, data){
      var box = $($this),
          dataSet = data,
          barWRap = '',
          valueMax = dataSet.map(function(d){return d.value});
          valueMax = Math.max.apply(null, valueMax);
      for(var i = 0; i < dataSet.length; i++){
        (valueMax === dataSet[i].value)? max = 'max' : max = '';
        barWRap += '<p class="bar '+max+'"><em class="tick">'+ dataSet[i].day +'</em><span style="height:'+ dataSet[i].value +'%;"></span></p>'
      }
      box.append('<div class="legend"><p>100</p><p>75</p><p>50</p><p>25</p><p>0</p><p>달성도(%)</p></div>');
      box.append('<div class="bar-wrap">'+ barWRap +'</div>');
    },
    bearingBarChart: function($this, data){
      var box = $($this),
          dataSet = data,
          barWRap = '',
          valueMax = dataSet.map(function(d){return d.value});
          valueMax = Math.max.apply(null, valueMax);
          for(var i = 0; i < dataSet.length; i++){
            (valueMax === dataSet[i].value)? max = 'max' : max = '';
            var percent = dataSet[i].value / (valueMax /100);
            barWRap += '<div class="'+max+'"><p style="height:'+percent+'%;"><span>'+dataSet[i].value+'</span></p><strong>'+ (i+1) +'</strong></div>'
          }
          box.append(barWRap);
    },
    bearingLineChart:function($this, data){
      if($($this).length == 0){return}
      var box = $($this),
          dataSet = data,
          dataValue = [],
          width = box.width(),
          boxWidth = width,
          height = box.height(),
          max = dataSet.baseline*1.2,
          min = dataSet.baseline*.8;
      for(var i = 0; i < data.data.length; i++){
        if(data.data[i].value > max){
          data.data[i].value = max
        }else if(data.data[i].value < min){
          data.data[i].value = min
        }
        dataValue.push({value:data.data[i].value});
      }
      box.append('<p class="baseline">'+dataSet.baseLang+'</p>');
      var xScale = d3.scaleBand()
          .domain(dataValue.map(function(d, i){return i}))
          .range([0, boxWidth]);
      var yScale = d3.scaleLinear()
          .domain([min, max])
          .range([height, 0]);
      var svg = d3.select($this).append('svg').attr('width', boxWidth).attr('height', height);
          g = svg.append("g").attr("transform", "translate(0,0)");

      const line = d3.line()
        .x(function(d,i){return xScale(i)})
        .y(d => yScale(d.value));

      const area = d3.area()
        .x(function(d,i){return xScale(i)})
        .y0(yScale(dataSet.baseline))
        .y1(d => yScale(d.value));

      const grad = g.append("defs").append("linearGradient")
        .attr("id", "grad")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");

      grad.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#3fb3ff")
        .style("stop-opacity", 0);

      grad.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#3fb3ff")
         .style("stop-opacity", .5);

      var lineWrap = g.append('g')
                      .attr('class', 'line')
                      .attr('transform', 'translate('+ (width / dataValue.length)/2 +',0)');
      lineWrap.append("path")
        .datum(dataValue)
        .style("fill", "url(#grad)")
        .attr("d", line)
        .attr("d", area);

      lineWrap.append("path")
        .datum(dataValue)
        .attr("fill", "none")
        .attr("stroke", "#5280e2")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
      svg.node();
      box.append('<div class="tick"><span style="left:30%">04:00</span><span style="left:70%">12:00</span></div>');
      function time(seconds, i) {
        var seconds = seconds / 1000;
        var hour = parseInt(seconds/3600) < 10 ? '0'+ parseInt(seconds/3600) : parseInt(seconds/3600);
        var min = parseInt((seconds%3600)/60) < 10 ? '0'+ parseInt((seconds%3600)/60) : parseInt((seconds%3600)/60);
        var sec = seconds % 60 < 10 ? '0'+Math.round(seconds % 60) : Math.round(seconds % 60);
        $('.tick span').eq(i).text(min+":"+sec);
      }
      time(dataSet.totalTime*.3334, 0);
      time(dataSet.totalTime*.6667, 1);
    },
};
