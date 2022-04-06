// var plantar = plantar || {
//     init:function() {
//         $.ajax({
//             url: '../data/1644630973338.csv',
//             dataType: 'text',
//         }).done(successFunction);
//         console.log('11a')
//         this.successFunction();

//     },
//
// };
// window.onload = function(){
//     plantar.init();
//     console.log('1a')
// };

var plantar = plantar || {
    init:function() {
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
            _wrap = this;
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
                        //console.log(renderCount+' : '+totalElapsed)
                    }
                    rAF = requestAnimationFrame(cb);
                };
            };
            box.find('.control-bar .btn-player').on('click', function(){
                _fps = Math.floor(dataLength/(dataSet[dataLength-1][0]/1000));
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
            _wrap = this;
            //video-control-bar
            box.find('.control-bar .time span').eq(1).text(this.getTime(dataSet[dataLength-1][0]))
            box.find('.slider').slider({
                range: 'min',
                animate: 'fast',
                max: dataLength,
                slide: function(event, ui) {
                    renderCount = ui.value;
                    _wrap.draw(ui.value)
                    console.log(ui.value)
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
                  //console.log(renderCount+' : '+timestamp)
                  _wrap.draw(renderCount)
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
            _wrap = this;
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
                  console.log(renderCount+' : '+timestamp)
                  _wrap.draw(renderCount)
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
                console.log(dataLength)
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
    vedioPlantar2:function(data){
        if($(".vedio_plantar").length == 0){return;}
        var _plantar = $('.plantar-wrap .chart'),
            dataSet = data,
            ele = '';
        for(var i=0; i<=7; i++){
            ele += '<p class="sensor_'+i+'_g"></p><p class="sensor_'+i+'_y"></p><p class="sensor_'+i+'_r"></p>';
        }
        _plantar.before('<p class="txt left">L <span>0%</span></p><p class="txt right">R <span>0%</span></p>');
        _plantar.append(ele);
        _plantar.after('<p class="bar left"><span></span></p><p class="bar right"><span></span></p>');
        var player = videojs('video', {
            //poster: "[이미지 주소 등록]",
            preload: "auto",
            controls: true,
            playsinline : true,
            controlBar: {
                playToggle : true,
                progressControl : true,
                remainingTimeDisplay : false,
                //pictureInPictureToggle: false,
            }
        });


        var stopMsec = 0;
        $('.vjs-big-play-button').on('click', function(){

            player.on('timeupdate', function(){
                msec = String(Math.round(player.currentTime()*100));
                sec1 = msec.substr(0,msec.length-2);
                sec2 = msec.substr(msec.length-2,2);
                tensUp = sec1*30;
                currentNum = 0;
                //progressbar 이용하는 방법
                // var left = $('.vjs-progress-control .vjs-progress-holder').attr('aria-valuenow');
                console.log(msec)
                if(msec >= stopMsec){
                    if(sec2 <= 25){tens = 1; tensLength = 7;}else if(sec2 >= 26 && sec2 <= 50){tens = 8; tensLength = 8;}else if(sec2 >= 51 && sec2 <= 75){tens = 16; tensLength = 7;}else if(sec2 >= 76 && sec2 <= 99){tens = 23; tensLength = 8;}
                    for(var i=0; i<tensLength; i++){
                        console.log( tensUp+(tens+i) );
                        currentNum = tensUp+(tens+i);
                        $('.txt.left span').text(dataSet[currentNum][9] +'%');
                        $('.txt.right span').text(dataSet[currentNum][10] +'%');
                        $('.bar.left span').css('height', dataSet[currentNum][9] +'%');
                        $('.bar.right span').css('height', dataSet[currentNum][10] +'%');
                    }
                }else{
                    if(sec2 <= 25){tens = 8; tensLength = 7;}else if(sec2 >= 26 && sec2 <= 50){tens = 16; tensLength = 8;}else if(sec2 >= 51 && sec2 <= 75){tens = 22; tensLength = 7;}else if(sec2 >= 76 && sec2 <= 99){tens = 30; tensLength = 8;}
                    for(var i=0; i<tensLength; i++){
                        console.log( tensUp+(tens-i) );
                        currentNum = tensUp+(tens-i);
                        $('.txt.left span').text(dataSet[currentNum][9] +'%');
                        $('.txt.right span').text(dataSet[currentNum][10] +'%');
                        $('.bar.left span').css('height', dataSet[currentNum][9] +'%');
                        $('.bar.right span').css('height', dataSet[currentNum][10] +'%');
                    }
                }
                for(var j=1; j<=8; j++){
                    (j == 1 || j == 5) ? alpha = (dataSet[currentNum][j]/ 100.0) : alpha = (dataSet[currentNum][j]/ 100.0) * 1.5;
                    getGYRAlphaValue(j-1, alpha)
                }
            });

            player.on('pause', function(){
                stopMsec = String(Math.round(player.currentTime()*100));
            });
        });
        $('.vjs-progress-control').on('click', function(){
          player.pause();
        });
        //현재 알파값으로 녹/노/빨 알파값을 구하는 함수
        function getGYRAlphaValue($this ,alpha){
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
                _plantar.find('p').eq(idx+index).css('opacity',element)
            }
        }
    },//vedioPlantar
};

window.onload = function(){
    plantar.init();
};