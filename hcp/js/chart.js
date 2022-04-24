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
    init:function(){
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
            height = box.height(),
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
        box.css({'width': width, 'height': height});
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
          valueTxt = '';
      if( type === 3 ){
        box.append('<div class="legend">'+ dataSet.value +'</div>').addClass('type3');
      }else{
        ( type === 1 )? valueTxt = dataSet.value : valueTxt = dataSet.value +' : '+ (100-dataSet.value) ;
        box.append('<div class="legend"><em>'+ dataSet.tit +'</em><strong>'+ valueTxt +'</strong></div>');
      }
      box.append('<div class="bar-wrap"><p class="average" style="left:'+ dataSet.average +'%;"><span>'+ dataSet.averageTxt +' '+ dataSet.average +'</span></p><div class="bar" style="background-color:'+ dataSet.bgColor +';"><span style="width:'+ dataSet.value +'%; background-color:'+ dataSet.barColor +';"></span></div></div>');
    },
    achieveChart: function($this, data){
      var box = $($this),
          dataSet = data.data,
          barWRap = '',
          valueMax = dataSet.map(function(d){return d.value});
          valueMax = Math.max.apply(null, valueMax);
      for(var i = 0; i < dataSet.length; i++){
        (valueMax === dataSet[i].value)? max = 'max' : max = '';
        barWRap += '<p class="bar '+max+'"><strong class="tick">'+ dataSet[i].day +'</strong><span style="height:'+ dataSet[i].value +'%;"><em>'+ dataSet[i].times +'</em></span></p>'
      }
      box.append('<div class="legend"><p>100</p><p>75</p><p>50</p><p>25</p><p>0</p><p>'+data.tick+'</p></div>');
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
    vedioPlantar:{
        init: function(data){
            if($(".vedio_plantar").length == 0){return;}
            box = $(".vedio_plantar");
            _plantar = box.find('.plantar-wrap');
            _plantarChart = box.find('.plantar-wrap .chart');
            _pressureChart = box.find('.pressure-chart');
            _pressureFlow = box.find('.pressure-flow');
            _secVideo = box.find('.seg_video');
            dataSet = data;
            dataLength = dataSet.length;
            ele = '';
            rAF = '';
            renderCount = 0;
            this.build();
        },
        build: function(){
            if($(".vedio_plantar.build").length == 1){return;}
            //plantar-wrap
            for(var i=0; i<=7; i++){
                ele += '<p class="sensor_'+i+'_g"></p><p class="sensor_'+i+'_y"></p><p class="sensor_'+i+'_r"></p>';
            }
            _plantarChart.before('<p class="txt left">L <span><em>0</em>%</span></p><p class="txt right">R <span><em>0</em>%</span></p>');
            _plantarChart.append(ele);
            _plantarChart.after('<p class="bar left"><span></span></p><p class="bar right"><span></span></p>');
            //pressure-flow
            _pressureFlow.append('<p class="txt left">L <span>000</span></p><p class="txt right">R <span>000</span></p>');
            //video
            _secVideo.append('<div class="control-bar"><div class="slider"></div><p class="time"><span>00:00</span><span>00:00</span></p><button class="btn-player">play/pause</button></div>');
            this.video();
            this.copPath('.vedio_plantar .plantar-wrap .chart');
            this.pressureChart('.vedio_plantar .plantar-LR .chart', 0);
            this.pressureChart('.vedio_plantar .plantar-HT .chart', 1);
            box.addClass('build');
        },
        copPath: function($this){
            var box = $($this),
                width = box.width()*.75,
                height = box.height()*.4486,
                r = 5,
                chartData = [],
                x1 = width/2,
                y1 = height/2;
            for(var i=0; i<dataLength; i++){
                each = [];
                for(var j=0; j<=1; j++){
                    (j === 0) ? each.push(dataSet[i][10]*(width/100)) : each.push(dataSet[i][12]*(height/100)) ;
                }
                chartData.push(each);
            }
            //console.log(chartData)
            var lineGenerator = d3.line();
            var pathString = lineGenerator(chartData);
            //svg
            var svg = d3.select($this).append('svg').attr('width', width).attr('height', height).attr('padding', r);
                svg.append('path').attr('d', pathString).attr('style', 'fill:none;stroke:#888;stroke-width:2;');
            g = svg.selectAll('g').data(chartData).enter().append("g");
            g.append('line')
             .each(function(d, i){
                d3.select(this)
                  .attr('x1', x1)
                  .attr('y1', y1)
                  .attr('x2', chartData[i][0])
                  .attr('y2', chartData[i][1])
                  .attr('style', 'stroke:#26b2a2;stroke-width:2;')
                  x1 = chartData[i][0];
                  y1 = chartData[i][1];
            });
            g.append('circle')
             .each(function(d, i){
                d3.select(this)
                  .attr('cx', chartData[i][0])
                  .attr('cy', chartData[i][1])
                  .attr('r', r)
                  .attr('style', 'fill:#fff;')
            });
        },
        video: function(){
            var _wrap = this;
            var myVideo = document.getElementById('video');
            myVideo.load();
            myVideo.addEventListener('ended', (event) => {
                cancelAnimationFrame(rAF);
                renderCount = 0;
                box.find('.control-bar .btn-player').removeClass('paused').addClass('refresh');
                // console.log(dataLength)
                // console.log('fresh')
            });
            //video-control-bar
            _secVideo.find('.control-bar .time span').eq(1).text(this.getTime(dataSet[dataLength-1][0]))
            _secVideo.find('.slider').slider({
                range: 'min',
                animate: 'fast',
                max: dataLength,
                slide: function(event, ui) {
                    renderCount = ui.value;
                    myVideo.currentTime = dataSet[ui.value-1][0] / 1000;
                    _wrap.draw(ui.value)
                }
            });
            const animate = (cb) => {
                requestAnimationFrame(cb);
            };
            const makeCb = (duration, fps) => {
                let fpsInterval = 1000 / fps;
                let start;
                let then;
                return function cb(timestamp) {
                    if(start === undefined && then === undefined){
                        start = window.performance.now();
                        then = window.performance.now();
                    }
                    const totalElapsed = window.performance.now() - start;
                    if(totalElapsed > duration){
                        return;
                    }
                    const elapsed = timestamp - then;
                    if(elapsed >= fpsInterval){
                        // draw
                        then = timestamp - (elapsed % fpsInterval);
                        renderCount++;
                        _wrap.draw(renderCount)
                        console.log(renderCount+' : '+totalElapsed)
                    }
                    rAF = requestAnimationFrame(cb);
                };
            };
            box.find('.control-bar .btn-player').on('click', function(){
                var _fps = Math.floor(dataLength/(dataSet[dataLength-1][0]/1000));
                if (myVideo.paused){
                    animate(makeCb(dataSet[dataLength-1][0], _fps));
                    myVideo.play();
                    $(this).removeClass('refresh').addClass('paused');
                }else{
                    cancelAnimationFrame(rAF);
                    renderCount = renderCount;
                    myVideo.pause();
                    $(this).removeClass('paused');
                }
            });
            box.find('.btn_close').on('click', function(){
                cancelAnimationFrame(rAF);
                renderCount = 0;
                _wrap.draw('0');
                myVideo.currentTime = 0;
                myVideo.pause();
                box.find('.btn-player').removeClass('paused, refresh');
            });
        },
        pressureChart: function($this, ele){
            var box = $($this),
                chartData = [],
                width = (dataLength*3),
                height = box.height();
            if(ele == 0){ var vary = ['L','LEFT','R','RIGHT', 10, 'grad1','#b4ee42'] }else{ var vary = ['H','HILL','T','TOE', 12, 'grad2', '#f13e44'] }
            for (var i=0; i<dataLength; i++) {
                chartData.push(dataSet[i][vary[4]]);
            }
            var xScale = d3.scaleBand()
                .domain(chartData.map(function(d, i){return i}))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            var svg = d3.select($this).append('svg').attr('width', width).attr('height', height);
                g = svg.append("g").attr("transform", "translate(0,0)");
            const line = d3.line()
                        .x(function(d,i){return xScale(i)})
                        .y(d => yScale(d));
            const area = d3.area()
                        .x(function(d,i){return xScale(i)})
                        .y0(yScale(50))
                        .y1(d => yScale(d));
            var lineWrap = g.append('g')
                            .attr('class', 'line')
                            .attr('transform', 'translate('+ (width / chartData.length)/2 +',0)');
            lineWrap.append("path")
                    .datum(chartData)
                    .style("fill", "url(#"+vary[5]+")")
                    .attr("d", line)
                    .attr("d", area);
            lineWrap.append("path")
                    .datum(chartData)
                    .attr("fill", "none")
                    .attr("stroke", vary[6])
                    .attr("stroke-width", 2)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", line);
            const grad = g.append("defs").append("linearGradient")
                        .attr("id", vary[5])
                        .attr("x1", "0%")
                        .attr("x2", "0%")
                        .attr("y1", "0%")
                        .attr("y2", "100%");
            grad.append("stop")
                .attr("offset", "0%")
                .style("stop-color", vary[6])
                .style("stop-opacity", .8);
            grad.append("stop")
                .attr("offset", "50%")
                .style("stop-color", vary[6])
                .style("stop-opacity", 0);
            grad.append("stop")
                .attr("offset", "100%")
                .style("stop-color", vary[6])
                .style("stop-opacity", .8);
            box.append('<p class="tick1">'+vary[1]+'</p><p class="tick2">'+vary[3]+'</p><p class="hand"><span></span></p>')
            box.after('<div><p class="txt left">'+vary[0]+'<span><em>0</em>%</span></p><p class="txt right">'+vary[2]+'<span><em>0</em>%</span></p></div>')
        },
        draw: function(count){
            _secVideo.find('.slider').slider('value', count);
            if(count == '0'){
                _secVideo.find('.control-bar .time span').eq(0).text(this.getTime(dataSet[1][0]))
                //plantar-wrap
                for(var j=1; j<=8; j++){
                  (j == 1 || j == 5) ? alpha = (0/ 100.0) : alpha = (0/ 100.0) * 1.5;
                  this.getGYRAlphaValue(j-1, alpha)
                }
                _plantar.find('.txt.left em, .txt.right em').text(0);
                _plantar.find('.bar.left span, .bar.right span').css({'top':'50%','bottom':'50%'});
                //COP
                _plantarChart.find('svg g').hide();
                //pressure-chart
                _pressureChart.find('.plantar-LR .txt.left em, .plantar-LR .txt.right em, .plantar-HT .txt.left em, .plantar-HT .txt.right em').text(0);
                _pressureChart.find('.chart svg').css('left', '0px');
                _pressureChart.find('.plantar-LR .hand span, .plantar-HT .hand span').css('top', '50%');
                //pressure-flow
                _pressureFlow.find('.txt.left span, .txt.right span').text('000');
            }else{
                _secVideo.find('.control-bar .time span').eq(0).text(this.getTime(dataSet[count][0]))
                //plantar-wrap
                for(var j=1; j<=8; j++){
                  (j == 1 || j == 5) ? alpha = (dataSet[count][j]/ 100.0) : alpha = (dataSet[count][j]/ 100.0) * 1.5;
                  this.getGYRAlphaValue(j-1, alpha)
                }
                _plantar.find('.txt.left em').text(dataSet[count][9]);
                _plantar.find('.txt.right em').text(dataSet[count][10]);
                _plantar.find('.bar.left span').css({'top':50-dataSet[count][13]/2+'%','bottom':50-dataSet[count][14]/2+'%'});
                _plantar.find('.bar.right span').css({'top':50-dataSet[count][15]/2+'%','bottom':50-dataSet[count][16]/2+'%'});
                //COP
                _plantarChart.find('svg g:nth-child(n+'+count+'):nth-child(-n+'+dataLength+')').hide();
                _plantarChart.find('svg g:nth-child(-n+'+(count-1)+')').find('circle').hide();
                _plantarChart.find('svg g:nth-child(-n+'+count+')').show();
                _plantarChart.find('svg g:nth-child('+count+')').find('circle').show();
                //pressure-chart
                _pressureChart.find('.plantar-LR .txt.left em').text(dataSet[count][9]);
                _pressureChart.find('.plantar-LR .txt.right em').text(dataSet[count][10]);
                _pressureChart.find('.plantar-HT .txt.left em').text(dataSet[count][11]);
                _pressureChart.find('.plantar-HT .txt.right em').text(dataSet[count][12]);
                _pressureChart.find('.chart svg').css('left', '-'+(count*3)+'px');
                _pressureChart.find('.plantar-LR .hand span').css('top', dataSet[count][9]+'%');
                _pressureChart.find('.plantar-HT .hand span').css('top', dataSet[count][11]+'%');
                //pressure-flow
                var pressureL = parseInt(dataSet[count][1])+parseInt(dataSet[count][3])+parseInt(dataSet[count][4]);
                var pressureR = parseInt(dataSet[count][5])+parseInt(dataSet[count][7])+parseInt(dataSet[count][8]);
                _pressureFlow.find('.txt.left span').text(pressureL);
                _pressureFlow.find('.txt.right span').text(pressureR);
            }
        },
        getTime: function(i){
            const minutes = String(Math.floor((i  / (1000 * 60 )) % 60 )).padStart(2, "0");
            const second = String(Math.floor((i / 1000 ) % 60)).padStart(2, "0");
            return minutes+':'+second;
        },
        getGYRAlphaValue: function($this ,alpha){
            //현재 알파값으로 녹/노/빨 알파값을 구하는 함수
            var alphaGYRArray = [];
            var green = (alpha * 2);
                green = (green > 1.0) ? 1.0 : green;
            var yellow = alpha - 0.25;
                yellow = (yellow < 0.0) ? 0.0 : yellow;
                yellow = (yellow > 0.5) ? 0.5 : yellow;
                yellow *= 2.0;
            var red = alpha - 0.6;
                red = (red < 0.0) ? 0.0 : red;
                red = (red > 0.5) ? 0.5 : red;
                red *= 2.0;
            alphaGYRArray.push(green, yellow, red);
            alphaGYRArray.forEach(gyrArray)
            function gyrArray(element, index){
                idx = $this*3;
                _plantarChart.find('p').eq(idx+index).css('opacity',element)
            }
        }
    },
    plantarBearing:{
        init: function(align, standard, data){
            if($(".plantar_bearing").length == 0){return;}
            box = $(".plantar_bearing");
            _boxCont = box.find('.box_cnt');
            _plantar = box.find('.plantar-wrap');
            _plantarChart = box.find('.plantar-wrap .chart');
            _bearingChart = box.find('.bearing-wrap .chart');
            dataSet = data;
            dataLength = dataSet.length;
            _align = align;
            _standard = standard;
            bearPercent = [];
            ele = '';
            rAF = '';
            renderCount = 0;
            this.build();
        },
        build: function(){
            if($(".plantar_bearing.build").length == 1){return;}
            //plantar-wrap
            for(var i=0; i<=7; i++){
                ele += '<p class="sensor_'+i+'_g"></p><p class="sensor_'+i+'_y"></p><p class="sensor_'+i+'_r"></p>';
            }
            _plantarChart.before('<p class="txt left">L <span><em>0</em>%</span></p><p class="txt right">R <span><em>0</em>%</span></p>');
            _plantarChart.append(ele);
            _plantarChart.after('<p class="bar left"><span></span></p><p class="bar right"><span></span></p>');
            //control
            _boxCont.after('<div class="control-bar"><div class="slider"></div><p class="time"><span>00:00</span><span>00:00</span></p><button class="btn-player">play/pause</button></div>');
            this.player();
            this.copPath('.plantar_bearing .plantar-wrap .chart');
            this.bearingChart('.plantar_bearing .bearing-wrap .chart');
            box.addClass('build');
        },
        player: function(){
            var _wrap = this;
            //video-control-bar
            box.find('.control-bar .time span').eq(1).text(this.getTime(dataSet[dataLength-1][0]))
            box.find('.slider').slider({
                range: 'min',
                animate: 'fast',
                max: dataLength,
                slide: function(event, ui) {
                    renderCount = ui.value;
                    _wrap.draw(ui.value)
                    //console.log(ui.value)
                }
            });
            const animate = (cb) => {
              requestAnimationFrame(cb);
            };
            const makeCb = (duration) => {
              let fpsInterval = 1000 / 30;
              let start;
              let then;
              return function cb(timestamp) {
                if(start === undefined && then === undefined){
                  start = window.performance.now();
                  then = window.performance.now();
                }
                const elapsed = timestamp - then;
                if(elapsed >= fpsInterval){
                  // draw
                  then = timestamp - (elapsed % fpsInterval);
                  renderCount++;
                  _wrap.draw(renderCount)
                  //console.log(renderCount+' : '+timestamp)
                }
                rAF = requestAnimationFrame(cb);
                //const totalElapsed = window.performance.now() - start;
                if(renderCount >= duration){
                  cancelAnimationFrame(rAF);
                  renderCount = 0;
                  box.find('.control-bar .btn-player').removeClass('paused').addClass('refresh');
                }
              };
            };
            box.find('.control-bar .btn-player').on('click', function(){
                if(!$(this).hasClass('paused')){
                    animate(makeCb(dataLength-1));
                    $(this).removeClass('refresh').addClass('paused');
                }else{
                    cancelAnimationFrame(rAF);
                    renderCount = renderCount;
                    $(this).removeClass('paused');
                }
            });
            box.find('.btn_close').on('click', function(){
                cancelAnimationFrame(rAF);
                renderCount = 0;
                _wrap.draw('0');
                box.find('.btn-player').removeClass('paused, refresh');
            });
        },
        copPath: function($this){
            var box = $($this),
                width = box.width()*.75,
                height = box.height()*.4486,
                r = 5,
                chartData = [],
                x1 = width/2,
                y1 = height/2;
            for(var i=0; i<dataLength; i++){
                each = [];
                for(var j=0; j<=1; j++){
                    (j === 0) ? each.push(dataSet[i][10]*(width/100)) : each.push(dataSet[i][12]*(height/100));
                }
                chartData.push(each);
            }
            //console.log(chartData)
            var lineGenerator = d3.line();
            var pathString = lineGenerator(chartData);
            //svg
            var svg = d3.select($this).append('svg').attr('width', width).attr('height', height).attr('padding', r);
                svg.append('path').attr('d', pathString).attr('style', 'fill:none;stroke:#888;stroke-width:2;');
            g = svg.selectAll('g').data(chartData).enter().append("g");
            g.append('line')
             .each(function(d, i){
                d3.select(this)
                  .attr('x1', x1)
                  .attr('y1', y1)
                  .attr('x2', chartData[i][0])
                  .attr('y2', chartData[i][1])
                  .attr('style', 'stroke:#26b2a2;stroke-width:2;')
                  x1 = chartData[i][0];
                  y1 = chartData[i][1];
            });
            g.append('circle')
             .each(function(d, i){
                d3.select(this)
                  .attr('cx', chartData[i][0])
                  .attr('cy', chartData[i][1])
                  .attr('r', r)
                  .attr('style', 'fill:#fff;')
            });
        },
        bearingChart: function($this){
            var box = $($this),
                chartData = [],
                boxHeight = box.height(),
                margin = {top:10, bottom:10, left:30},
                width = (dataLength*3),
                height = boxHeight - (margin.top + margin.bottom),
                max = _standard*1.5,
                min = _standard*.5;
            for(var i=0; i<dataLength; i++){
                (_align === 'left') ? _sum = parseInt(dataSet[i][23]) + parseInt(dataSet[i][24]) + parseInt(dataSet[i][25]) + parseInt(dataSet[i][26]) : _sum = parseInt(dataSet[i][27]) + parseInt(dataSet[i][28]) + parseInt(dataSet[i][29]) + parseInt(dataSet[i][30]);
                if(_sum > max){
                  _sum = max
                }else if(_sum < min){
                  _sum = min
                }
                chartData.push(_sum);
                bearPercent.push(100 - (_sum - min)/((max-min)/100));
            }
            var xScale = d3.scaleBand()
                .domain(chartData.map(function(d, i){return i}))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([min, max])
                .range([height, 0]);
            var svg = d3.select($this).append('svg').attr('width', width).attr('height', boxHeight);
                g = svg.append('g').attr('transform', 'translate( 0,' + margin.top + ')');
                box.find('svg').wrap('<div></div>');
            // axis-y
            g.append('g')
             .attr('class', 'axis axis-y')
             .call(d3.axisLeft(yScale).ticks(4).tickSize(-width))
             .call(g => g.select('.domain').remove())
             .call(g => g.selectAll('line').style('stroke', '#222'));
            const line = d3.line()
                        .x(function(d,i){return xScale(i)})
                        .y(d => yScale(d));
            const area = d3.area()
                        .x(function(d,i){return xScale(i)})
                        .y0(yScale(_standard))
                        .y1(d => yScale(d));
            var lineWrap = g.append('g')
                            .attr('class', 'line')
                            .attr('transform', 'translate('+ (width / chartData.length)/2 +',0)');
            lineWrap.append("path")
                    .datum(chartData)
                    .style("fill", "url(#grad)")
                    .attr("d", line)
                    .attr("d", area);
            lineWrap.append("path")
                    .datum(chartData)
                    .attr("fill", "none")
                    .attr("stroke", "url(#grad)")
                    .attr("stroke-width", 1)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", line);
            const grad = g.append("defs").append("linearGradient")
                        .attr("id", "grad")
                        .attr("x1", "0%")
                        .attr("x2", "0%")
                        .attr("y1", "0%")
                        .attr("y2", "100%");
            grad.append("stop")
                .attr("offset", "0%")
                .style("stop-color", "#0ff79f")
                .style("stop-opacity", 1);
            grad.append("stop")
                .attr("offset", "100%")
                .style("stop-color", "#00acd9")
                .style("stop-opacity", 1);
            //tick
            var _li = [],
                _tick = box.find('.axis-y .tick');
                tickLength = _tick.length;
            for(var i=0; i<tickLength; i++){
                _y = _tick.eq(i).attr('transform').substring(12).split(")")[0];
                _li += '<li style="top:'+_y+'px">'+_tick.eq(i).text()+'</li>';
            }
            box.append('<ul>'+_li+'</ul>');
            box.append('<p class="hand"><span></span></p>');
        },
        draw: function(count){
            box.find('.slider').slider('value', count);
            if(count == '0'){
                box.find('.control-bar .time span').eq(0).text(this.getTime(dataSet[1][0]))
                //plantar-wrap
                for(var j=1; j<=8; j++){
                  (j == 1 || j == 5) ? alpha = (0/ 100.0) : alpha = (0/ 100.0) * 1.5;
                  this.getGYRAlphaValue(j-1, alpha)
                }
                _plantar.find('.txt.left em, .txt.right em').text(0);
                _plantar.find('.bar.left span, .bar.right span').css({'top':'50%','bottom':'50%'});
                //COP
                _plantarChart.find('svg g').hide();
                //bearingChart
                _bearingChart.find('svg').css('left', '0px');
            }else{
                box.find('.control-bar .time span').eq(0).text(this.getTime(dataSet[count-1][0]))
                //plantar-wrap
                for(var j=1; j<=8; j++){
                  (j == 1 || j == 5) ? alpha = (dataSet[count][j]/ 100.0) : alpha = (dataSet[count][j]/ 100.0) * 1.5;
                  this.getGYRAlphaValue(j-1, alpha)
                }
                _plantar.find('.txt.left em').text(dataSet[count][9]);
                _plantar.find('.txt.right em').text(dataSet[count][10]);
                _plantar.find('.bar.left span').css({'top':50-dataSet[count][13]/2+'%','bottom':50-dataSet[count][14]/2+'%'});
                _plantar.find('.bar.right span').css({'top':50-dataSet[count][15]/2+'%','bottom':50-dataSet[count][16]/2+'%'});
                //COP
                _plantarChart.find('svg g:nth-child(n+'+count+'):nth-child(-n+'+dataLength+')').hide();
                _plantarChart.find('svg g:nth-child(-n+'+(count-1)+')').find('circle').hide();
                _plantarChart.find('svg g:nth-child(-n+'+count+')').show();
                _plantarChart.find('svg g:nth-child('+count+')').find('circle').show();
                //bearingChart
                if(count <= 50){
                   _bearingChart.find('.hand').css('left', +(count*3)+30+'px')
                }else if(count > dataLength-50){
                    _bearingChart.find('.hand').css('left', +((count - (dataLength-50))*3)+180+'px')
                }else{
                    _bearingChart.find('svg').css('left', '-'+((count-50)*3)+'px');
                }
                _bearingChart.find('.hand span').css('top', bearPercent[count]+'%');
            }
        },
        getTime: function(i){
            const minutes = String(Math.floor((i  / (1000 * 60 )) % 60 )).padStart(2, "0");
            const second = String(Math.floor((i / 1000 ) % 60)).padStart(2, "0");
            return minutes+':'+second;
        },
        getGYRAlphaValue: function($this ,alpha){
            //현재 알파값으로 녹/노/빨 알파값을 구하는 함수
            var alphaGYRArray = [];
            var green = (alpha * 2);
                green = (green > 1.0) ? 1.0 : green;
            var yellow = alpha - 0.25;
                yellow = (yellow < 0.0) ? 0.0 : yellow;
                yellow = (yellow > 0.5) ? 0.5 : yellow;
                yellow *= 2.0;
            var red = alpha - 0.6;
                red = (red < 0.0) ? 0.0 : red;
                red = (red > 0.5) ? 0.5 : red;
                red *= 2.0;
            alphaGYRArray.push(green, yellow, red);
            alphaGYRArray.forEach(gyrArray)
            function gyrArray(element, index){
                idx = $this*3;
                _plantarChart.find('p').eq(idx+index).css('opacity',element)
            }
        }
    },
    plantar:{
        init: function(data){
            if($(".plantar").length == 0){return;}
            box = $(".plantar");
            _boxCont = box.find('.box_cnt');
            _plantar = box.find('.plantar-wrap');
            _plantarChart = box.find('.plantar-wrap .chart');
            dataSet = data;
            dataLength = dataSet.length;
            ele = '';
            rAF = '';
            renderCount = 0;
            this.build();
        },
        build: function(){
            if($(".plantar.build").length == 1){return;}
            //plantar-wrap
            for(var i=0; i<=7; i++){
                ele += '<p class="sensor_'+i+'_g"></p><p class="sensor_'+i+'_y"></p><p class="sensor_'+i+'_r"></p>';
            }
            _plantarChart.before('<p class="txt left">L <span><em>0</em>%</span></p><p class="txt right">R <span><em>0</em>%</span></p>');
            _plantarChart.append(ele);
            _plantarChart.after('<p class="bar left"><span></span></p><p class="bar right"><span></span></p>');
            //control
            _boxCont.after('<div class="control-bar"><div class="slider"></div><p class="time"><span>00:00</span><span>00:00</span></p><button class="btn-player">play/pause</button></div>');
            this.player();
            this.copPath('.plantar .plantar-wrap .chart');
            box.addClass('build');
        },
        player: function(){
            var _wrap = this;
            //video-control-bar
            box.find('.control-bar .time span').eq(1).text(this.getTime(dataSet[dataLength-1][0]))
            box.find('.slider').slider({
                range: 'min',
                animate: 'fast',
                max: dataLength,
                slide: function(event, ui) {
                    renderCount = ui.value;
                    _wrap.draw(ui.value)
                }
            });
            const animate = (cb) => {
              requestAnimationFrame(cb);
            };
            const makeCb = (duration) => {
              let fpsInterval = 1000 / 30;
              let start;
              let then;
              return function cb(timestamp) {
                if(start === undefined && then === undefined){
                  start = window.performance.now();
                  then = window.performance.now();
                }
                const elapsed = timestamp - then;
                if(elapsed >= fpsInterval){
                  // draw
                  then = timestamp - (elapsed % fpsInterval);
                  renderCount++;
                  _wrap.draw(renderCount);
                  //console.log(renderCount+' : '+timestamp)
                }
                rAF = requestAnimationFrame(cb);
                //const totalElapsed = window.performance.now() - start;
                if(renderCount >= duration){
                  cancelAnimationFrame(rAF);
                  renderCount = 0;
                  box.find('.control-bar .btn-player').removeClass('paused').addClass('refresh');
                }
              };
            };
            box.find('.control-bar .btn-player').on('click', function(){
                if(!$(this).hasClass('paused')){
                    animate(makeCb(dataLength-1));
                    $(this).removeClass('refresh').addClass('paused');
                }else{
                    cancelAnimationFrame(rAF);
                    renderCount = renderCount;
                    $(this).removeClass('paused');
                }
            });
            box.find('.btn_close').on('click', function(){
                cancelAnimationFrame(rAF);
                renderCount = 0;
                _wrap.draw('0');
                box.find('.btn-player').removeClass('paused, refresh');
            });
        },
        copPath: function($this){
            var box = $($this),
                width = box.width()*.75,
                height = box.height()*.4486,
                r = 5,
                chartData = [],
                x1 = width/2,
                y1 = height/2;
            for(var i=0; i<dataLength; i++){
                each = [];
                for(var j=0; j<=1; j++){
                    (j === 0) ? each.push(dataSet[i][10]*(width/100)) : each.push(dataSet[i][12]*(height/100)) ;
                }
                chartData.push(each);
            }
            //console.log(chartData)
            var lineGenerator = d3.line();
            var pathString = lineGenerator(chartData);
            //svg
            var svg = d3.select($this).append('svg').attr('width', width).attr('height', height).attr('padding', r);
                svg.append('path').attr('d', pathString).attr('style', 'fill:none;stroke:#888;stroke-width:2;');
            g = svg.selectAll('g').data(chartData).enter().append("g");
            g.append('line')
             .each(function(d, i){
                d3.select(this)
                  .attr('x1', x1)
                  .attr('y1', y1)
                  .attr('x2', chartData[i][0])
                  .attr('y2', chartData[i][1])
                  .attr('style', 'stroke:#26b2a2;stroke-width:2;')
                  x1 = chartData[i][0];
                  y1 = chartData[i][1];
            });
            g.append('circle')
             .each(function(d, i){
                d3.select(this)
                  .attr('cx', chartData[i][0])
                  .attr('cy', chartData[i][1])
                  .attr('r', r)
                  .attr('style', 'fill:#fff;')
            });
        },
        draw: function(count){
            box.find('.slider').slider('value', count);
            if(count == '0'){
                box.find('.control-bar .time span').eq(0).text(this.getTime(dataSet[1][0]))
                //plantar-wrap
                for(var j=1; j<=8; j++){
                  (j == 1 || j == 5) ? alpha = (0/ 100.0) : alpha = (0/ 100.0) * 1.5;
                  this.getGYRAlphaValue(j-1, alpha)
                }
                _plantar.find('.txt.left em, .txt.right em').text(0);
                _plantar.find('.bar.left span, .bar.right span').css({'top':'50%','bottom':'50%'});
                //COP
                _plantarChart.find('svg g').hide();
                //data
                _boxCont.find('.seg_data p span').text(0);
            }else{
                box.find('.control-bar .time span').eq(0).text(this.getTime(dataSet[count-1][0]))
                //plantar-wrap
                for(var j=1; j<=8; j++){
                  (j == 1 || j == 5) ? alpha = (dataSet[count][j]/ 100.0) : alpha = (dataSet[count][j]/ 100.0) * 1.5;
                  this.getGYRAlphaValue(j-1, alpha)
                }
                _plantar.find('.txt.left em').text(dataSet[count][9]);
                _plantar.find('.txt.right em').text(dataSet[count][10]);
                _plantar.find('.bar.left span').css({'top':50-dataSet[count][13]/2+'%','bottom':50-dataSet[count][14]/2+'%'});
                _plantar.find('.bar.right span').css({'top':50-dataSet[count][15]/2+'%','bottom':50-dataSet[count][16]/2+'%'});
                //COP
                _plantarChart.find('svg g:nth-child(n+'+count+'):nth-child(-n+'+dataLength+')').hide();
                _plantarChart.find('svg g:nth-child(-n+'+(count-1)+')').find('circle').hide();
                _plantarChart.find('svg g:nth-child(-n+'+count+')').show();
                _plantarChart.find('svg g:nth-child('+count+')').find('circle').show();
                //data
                _boxCont.find('.seg_data.left p').eq(0).find('span').text(dataSet[count][13]);
                _boxCont.find('.seg_data.left p').eq(1).find('span').text(dataSet[count][14]);
                _boxCont.find('.seg_data.right p').eq(0).find('span').text(dataSet[count][15]);
                _boxCont.find('.seg_data.right p').eq(1).find('span').text(dataSet[count][16]);
            }
        },
        getTime: function(i){
            const minutes = String(Math.floor((i  / (1000 * 60 )) % 60 )).padStart(2, "0");
            const second = String(Math.floor((i / 1000 ) % 60)).padStart(2, "0");
            return minutes+':'+second;
        },
        getGYRAlphaValue: function($this ,alpha){
            //현재 알파값으로 녹/노/빨 알파값을 구하는 함수
            var alphaGYRArray = [];
            var green = (alpha * 2);
                green = (green > 1.0) ? 1.0 : green;
            var yellow = alpha - 0.25;
                yellow = (yellow < 0.0) ? 0.0 : yellow;
                yellow = (yellow > 0.5) ? 0.5 : yellow;
                yellow *= 2.0;
            var red = alpha - 0.6;
                red = (red < 0.0) ? 0.0 : red;
                red = (red > 0.5) ? 0.5 : red;
                red *= 2.0;
            alphaGYRArray.push(green, yellow, red);
            alphaGYRArray.forEach(gyrArray)
            function gyrArray(element, index){
                idx = $this*3;
                _plantarChart.find('p').eq(idx+index).css('opacity',element)
            }
        }
    },
};