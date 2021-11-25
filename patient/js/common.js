  $(document).ready(function(){
    /* faq */
    $('.faq  a').on("click", function(e) {
      if($(this).hasClass("on")){
				$(this).removeClass("on").parent().find('.faq_view').slideUp();
			}else{
				$(this).addClass("on").parent().siblings().find('a').removeClass("on");
				$(this).parent().find('.faq_view').slideDown().parent().siblings().find('.faq_view').slideUp();
			}
      return false;
    });
    /* faq */
    /* 문답 내역 */
    $('.inquire_list  .tn').on("click", function(e) {
      if($(this).hasClass("on")){
				$(this).removeClass("on").parent().find('.cn').slideUp();
			}else{
				$(this).addClass("on").parent().siblings().find('a').removeClass("on");
				$(this).parent().find('.cn').slideDown().parent().siblings().find('.cn').slideUp();
			}
      return false;
    });
    /* 문답 내역 */

    /* 인풋박스 포커스 이벤트 */
    $('.input_default input, .input_default .form_select').focusin(function(){
      $(this).closest('.input_default').addClass('focus');
    }).focusout(function(){
      $(this).closest('.input_default').removeClass('focus');
    });
    /* 인풋박스 포커스 이벤트 */

    $('.form_select').change(function () {
      if($(this).val()==null || $(this).val()==''){
        $(this).addClass('dis');
      }else{
        $(this).removeClass('dis');
      }
    });

    /* 라디오 버튼 - 문진 정보 */
    $('.radio_mark input[type="radio"]').change(function () {
      if($(this).prop("checked")) { 
        $(this).closest('.radio_mark').addClass('on').parent().siblings().find('.radio_mark').removeClass("on");
      }
    });
    $('.radio_mark .input input').focusin(function(){
      $(this).closest('.radio_mark').addClass('on').find("input[type=radio]").prop("checked",true); 
      $(this).closest('.radio_mark').parent().siblings().find('.radio_mark').removeClass("on");
    });
    /* 라디오 버튼 - 문진 정보 */

    
    $('.check_mark input[type="checkbox"]').change(function () {
      if($(this).prop("checked")) { 
        $(this).closest('.check_mark').addClass('on').parent().siblings().find('.check_mark').removeClass("on");
        $(this).closest('.check_mark').find('.input').show();
      }else{
        $(this).closest('.check_mark').removeClass("on");
        $(this).closest('.check_mark').find('.input').hide();
      }
    });

    /* 탭메뉴 */
    $('.tab_default li > span').on("click", function(e) {
      var index = $(this).parent().index();
      $(this).addClass("on").parent().siblings().children().removeClass("on");
      $('.tab_cont > div').eq(index).show().siblings().hide();
      return false;
    });
    /* 탭메뉴 */

    /* 회원가입 개인정보 동의  */
    $("#agreeAll").click(function(){ 
      if($("#agreeAll").prop("checked")) { 
        $(".agree_list input[type=checkbox]").prop("checked",true); 
      } else { 
        $(".agree_list input[type=checkbox]").prop("checked",false); 
      } 
    });
    $(".agree_list input[type=checkbox]").click(function(){
      var lengths = $('.agree_list input[type=checkbox]').length -1;
      $('.agree_list input:checkbox[type=checkbox]:checked').each(function (index) {
        if(index==lengths){
          $("#agreeAll").prop("checked",true); 
        }else{
          $("#agreeAll").prop("checked",false); 
        }
      });
    });
    /* 회원가입 개인정보 동의  */

    /* 도움말 팝업 */
    $(".tip_icon").click(function(){ 
      $(this).toggleClass('on').parent().find('.tip_pop').toggleClass('on');
      return false;
    });
    /* 도움말 팝업 */

    /* 비밀번호 타입 변경 */    
    $('.pwshow').on('click', function () {
      var type = $(this).parents('.tixed').find('.pwinput'); 
      if(type.attr('type') == 'password'){
        type.attr('type', 'text');
        $(this).addClass("on");
      }else{
        type.attr('type', 'password');
        $(this).removeClass("on");
      }
      return false;
    });
    /* 비밀번호 타입 변경 */    

    /* 검색창 입력값 지우는 버튼 */
    $(".search_box input").on("propertychange change keyup paste input", function(){
      var currentVal = $(this).val();
      if(currentVal){
        $(this).parent().addClass('texton');
      }else{
        $(this).parent().removeClass('texton');
      }
    });
    $('.search_box .btn_cle').on("click", function(e) {
      $(this).parent().removeClass('texton').find('input').val('');
    });
    /* 검색창 입력값 지우는 버튼 */

    /* 서브 헤드 메뉴 */
    var selectHead = $('.page_head');
    $('.page_head .select').on("click", function(e) {
      if(selectHead.hasClass('on')){
        headSelect();
      }else{
        selectHead.addClass('on').addClass('bg');
        $('.default_page').prepend("<div class='dimbg'></div>");
        $('.dimbg').animate({opacity: "0.7"}, 500);
      }
    });
    $('.default_page').on("click",".dimbg", function(e) {headSelect()});
    function headSelect(){
      selectHead.removeClass('on');
      $('.dimbg').animate({opacity: "0"}, 500, function(){
        $(this).remove();
        selectHead.removeClass('bg');
      });
    }
    /* 서브 헤드 메뉴 */

    /* 페이지 헤드 스크롤에 따라 배경색 변경 */
    headbg();
    function headbg(){
      var scroll = $(window).scrollTop();
      if(scroll <= 200){
        $('.page_head .headbg').css({'opacity':scroll/200});
      }else{
        $('.page_head .headbg').css({'opacity':1});
      }  
    }      
    $(window).scroll(function() {headbg();});
    /* 페이지 헤드 스크롤에 따라 배경색 변경 */
    
    new Swiper(".category_tab .swiper", {
      slidesPerView: "auto",
      spaceBetween: 0,
    });
    new Swiper(".aotoswiper", {
      slidesPerView: "auto",
      spaceBetween: 0,
      observer: true,
      resizeObserver: true,
    });
    new Swiper(".aotoswiperc", {
      slidesPerView: "auto",
      spaceBetween: 0,
      centeredSlides: true,
      observer: true,
      resizeObserver: true,
      pagination: {
        el: ".aotoswiperc .swiper-pagination",
      },
    });
    if($('.day_week').length){
      var dayWeek = new Swiper(".day_week", {
        slidesPerView: 7,
        spaceBetween: 0,
      });
      dayWeek.slideTo($('.day_week .swiper-slide').length,0);
    }
    
    
    // console.log(weeklistArr)
    // $('#walk_tchart').scroll(function() {
    //   console.log($(this).scrollLeft())

      
    //   // if($(this).scrollLeft() == $('#weeklist li').scrollLeft()){
    //   //   console.log($('#weeklist li').scrollLeft())
    //   // }
    // });

    // $(window).resize( function() {
    //   // do somthing
    // ​});

});


/* 모달 팝업창 */
function modals_close(id){
  $('#'+id).removeClass('show');
  setTimeout(() => {
    $('#'+id).removeClass('on');
  }, 500);
}
function modals_show(id){
  $('#'+id).addClass('on');
  setTimeout(() => {
    $('#'+id).addClass('show');
  }, 200);
}
/* 모달 팝업창 */


function resize(obj) {
  obj.style.height = "1px";
  obj.style.height = (12+obj.scrollHeight)+"px";
}



function mainBalanceData(data){
  var overall_data = $('.overall_data');
  var result = 100/data.all*data.value;
  var chart = '<svg viewBox="0 0 32 32"><circle class="circle" r="16" cx="16" cy="16" style="stroke-dasharray: 10 100" /></svg>';
  overall_data.find('.pie').html(chart).find('.circle').css('stroke-dasharray', result + ' 100');
  overall_data.find('.num span').html(data.all)
  overall_data.find('.num strong').html(data.value)
}

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
  }).style("fill", "#ffffff").style("font-size", function(d) { return (d.r/11) + 'vw'; })
  var tatgetTag = document.querySelector('.bubble_texts');
  for (let index = 0; index < data.children.length; index++) {
    let element = document.createElement('li');
    let text = JSON.stringify(data.children[index].name).replace(/\"/gi, "");
    let color = JSON.stringify(data.children[index].color).replace(/\"/gi, "");
    element.innerHTML = "<span><i style='background:"+color+"'></i>"+text+"</span>";
    tatgetTag.append(element);
  }
}

function barchart(data, id, aver){
  const bar_chart = document.getElementById(id)
  var valdata = data.map(function(v){return v.value});
  valdata= Math.max.apply(null,valdata);
  for (let index = 0; index < data.length; index++) {
    const element = data[index].value;
    if(aver){
      var liHtml = `<li><strong>${data[index].value}점</strong><div class="b"><div class="r" style="height:${data[index].value}%"></div></div><span>${data[index].name}</span></li>`
      bar_chart.innerHTML += liHtml;
    }else{
      const ratio = Math.floor(100/valdata*element)
      var liHtml = `<li class=${ratio==100?'on':''}><strong>${data[index].value}회</strong><div class="b"><div class="r" style="height:${ratio}%"></div></div><span>${data[index].name}</span></li>`
      bar_chart.innerHTML += liHtml;
    }
    const r = $('#'+id+' .b').eq(index).find('.r');
    const ojli = $('#'+id+' li');
    if(aver){
      aver >= element+1 ? r.css("background-color","#e67700") : r.css("background-color","#5280e2");
      if(data.length > 7){
        const liwidth = ojli.outerWidth(true);
        $('#'+id).width(liwidth*data.length);
        $( window ).resize( function() {
          const liwidth = ojli.outerWidth(true);
          $('#'+id).width(liwidth*data.length);
        });
      }
      const height = ojli.find('.b').height();
      const top = ojli.position().top;
      $('#'+id).parents('.averchart').find('.averline').height(height).css({'top':top+'px'}).find('.line').css({'bottom':aver+'%'}).parent().find('.tx').css({'bottom':aver+'%'});
      $( window ).resize( function() {
        const height = ojli.find('.b').height();
        const top = ojli.position().top;
        $('#'+id).parents('.averchart').find('.averline').height(height).css({'top':top+'px'}).find('.line').css({'bottom':aver+'%'}).parent().find('.tx').css({'bottom':aver+'%'});
      });
    }else{
      const elementTop = r.position().top;
      ojli.eq(index).find('strong').css({'top':elementTop+'px'});
    }
  }
  $('#'+id+' .b').on("click", function(e) {
    $('#'+id+' li').removeClass("on");
    $(this).parent().addClass("on")
  }); 
}

function probar(e, id, box){
  sportsPoints = e/100,
  svgSportsPath = document.getElementById(id);
  var sports = new ProgressBar.Path(svgSportsPath, {
    duration: 1000,
    text: { value: '0' }
  });
  sports.set(sportsPoints);
  var onebgHtml = `<div class="onebg"><div class="one"></div></div>`
  var pinHtml = `<div class="pin"></div>`
  var ruHtml = `<div class="ru"><ul></ul></div>`
  $("#"+box).append(onebgHtml).append(pinHtml).append(ruHtml);
  var per;
  e < 60 ? per = e/10: per = e/10 + 1;
  var perclass;
  for (let index = 0; index < 12; index++) {
    index - 1 < per ? perclass = 'on': perclass = 'off';
    $("#"+box).find('.ru ul').append(`<li class="${perclass}"></li>`)
  }
  $("#"+box).find('.onebg').css('-webkit-transform','rotate('+e*1.8+'deg)'); 
  $("#"+box).find('.pin').css('-webkit-transform','rotate('+e*1.8+'deg)'); 
}


function barCycle(data, id){
  const bar_chart = document.getElementById(id);
  var averNo = data.find(x => x.name === '표준').stance;
  var averHtml = `<span class="averline" style="left:${averNo}%"></span>`
    bar_chart.innerHTML += averHtml;
  for (let index = 0; index < data.length; index++) {
    var name = data[index].name, left = data[index].stance, right = data[index].swing, leftClass ='', color = '';
    if(left >= 92 && left < 97){leftClass='f'}else if(left >= 97){leftClass='ff'}
    if(name == '왼발'){color='left'}else if(name == '오른발'){color='right'}else{color='aver'}
    var liHtml = `<div class="chart ${leftClass}  ${color}"><div class="bar"><span class="stance" style="width:${left}%"> </span></div><span class="stance_tx" style="left:${left}%">${left}</span><span class="swing_tx">${right}</span><span class="name">${name}</span></div>`
    bar_chart.innerHTML += liHtml;
  }
}

function balance(data){
  var dataLength = data.length ;
  var startDay = data[0].day -1;
  var endDay = data[dataLength - 1].day;
  const ojstag = document.getElementById('balancesvg');
  ojstag.style.height = dataLength * 13 + "vw";
  const ojs = document.getElementById('balance');
  const width = ojs.offsetWidth;            
  const height = ojs.offsetHeight - 20;
  //function resizer(){
  const yScale = d3.scaleLinear().domain([endDay, startDay]).range([10, height]);  
  const xScale = d3.scaleLinear().domain([6, 0]).range([width, 10]);      
  const yAxisSVG = d3.select("svg").append("g")//.select('text');
  const yAxis = d3.axisRight(yScale).tickSize(0).ticks(dataLength);
  yAxis(yAxisSVG);
  const linearGenerator = d3.line()
    .x(function(d, index) {
      if(d.value == null || d.value == ''){
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
      if(d.value == null || d.value == ''){
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
    if(index<0){return;}
    if(data[index].value == null || data[index].value == ''){
      return "nodata";
    }else{
      return 'tick';
    }
  }).selectAll("text").text(function(d) {
    return (d < 10) ? ("0" + d) : d;
})

  d3.select("svg").append("path").attr("d", linearGenerator(data)).attr("fill", "none").attr("stroke-width", 4).attr("opacity", .1).attr("stroke", "#5280e3");
  d3.select("svg").selectAll("circle").data(data).enter().append("circle").attr("r", 7)
    .attr('cx', function(d, index) {
      if(d.value == null || d.value == ''){
        if(index == dataLength){
          return xScale(data[index - 1].value)
        }else{
          return xScale(data[index + 1].value)
        }
      }else{
        return xScale(d.value)
      }
    }).attr('cy', function(d, index) {
      if(d.value == null || d.value == ''){
        if(index == dataLength){
          return yScale(data[index - 1].day)
        }else{
          return yScale(data[index + 1].day)
        }
      }else{
        return yScale(d.day)
      }
    }).style("fill", "#fff").attr("stroke-width", 4).attr("stroke", "#5280e3");
  // };
  //   window.addEventListener('resize', resizer);
  //   resizer();
}

function bachart(data, id){
  const bachart = document.getElementById(id);
  for (let index = data.length -1; index >= 0; index--) {
    var nodata = ''
    if(data[index].left == '' || data[index].left == null){ nodata='nodata'}
    var liHtml = `<div class="ba_chart clear ${nodata}"><div class="day">${data[index].day}</div><div class="left bar"><span style="width:${data[index].left}%"></span></div><div class="right bar"><span style="width:${data[index].right}%"></span></div></div>`
    bachart.innerHTML += liHtml;
  }
}

function walk_tdata(data){
  var weeklistArr = [];
  var dataLength = data.length ;
  //var startDay = data[0].day.getDate() - 1;
  var startDay = new Date(data[0].day.getFullYear(), data[0].day.getMonth(), data[0].day.getDate() - 1);
  var endDay = new Date(data[dataLength - 1].day.getFullYear(), data[dataLength - 1].day.getMonth(), data[dataLength - 1].day.getDate() + 1);
  //var endDay = data[dataLength - 1].day.getDate()+2;
  const ojstag = document.getElementById('walkTchart');
  ojstag.style.width = dataLength * 11.5 + "vw";
  const ojs = document.getElementById('walk_tchart');
  const width = ojstag.offsetWidth;            
  const height = ojs.offsetHeight;
  const xScale = d3.scaleTime().domain([startDay, endDay]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 3.3]).range([height - 50, 0]);
  const xAxisSVG = d3.select("svg").append("g").attr("transform", "translate(0, "+height+")").attr('class', 'day'); 
  const xAxis = d3.axisBottom(xScale).tickSize(1).tickFormat(d3.timeFormat("%d")).tickValues(data.map(d=>d.day));
  xAxis(xAxisSVG);
  d3.select("svg").selectAll(".domain").remove();
  d3.select("svg").selectAll(".tick").attr('class', 'days');
  d3.select("svg").call(d => d.selectAll('line').remove());
  const linearGenerator = d3.line().x(d=>xScale(d.day)).y(d=>yScale(d.value))
  d3.select("svg").append("path").attr("d", linearGenerator(data)).attr("fill", "none").attr("stroke-width", 4).attr("stroke", "#5280e2").attr("stroke-linecap", "round");
  d3.select("svg").selectAll("circle").data(data).enter().append("circle").attr('class', 'cir').attr("r", 8).attr("cx", d=>xScale(d.day)).attr("cy", d=>yScale(d.value)).style("fill", "#5280e2").attr("stroke-width", 3).attr("stroke", "#fff")
  const bar_chart = document.getElementById('weeklist')
  for (let index = 0; index < data.length; index++) {
    var leftx = $('.days').eq(index).attr('transform').replaceAll("translate","").replace(/\)/g,'').replace(/\(/g,'').slice(0, -2);
    var liHtml = `<li style="transform:translateX(${leftx}px)" yearName="${data[index].day.getFullYear()}" monthName="${data[index].day.getMonth()+1}"><span class="liwa">${data[index].week}</span><span class="liday">${data[index].day.getDate()}</span></li>`
    bar_chart.innerHTML += liHtml;
    weeklistArr.push({left:leftx, year:data[index].day.getFullYear(), month:data[index].day.getMonth()+1 })
  }
  let uniqueArr = weeklistArr.filter((thing, index, self) =>index === self.findIndex((t) => (t.month === thing.month)))
  ojs.onscroll = logScroll;
  let target = false;
  load()
  function load(){
    $('.walk_wr .ti .year').html(uniqueArr[0].year);
    $('.walk_wr .ti .month').html(uniqueArr[0].month);
    target=false;
  }
  function logScroll(e) {
    idx = weeklistArr.indexOf(e.target.scrollLeft)
    if(uniqueArr[1].left <= e.target.scrollLeft && !target){
      $('.walk_wr .ti .year').html(uniqueArr[1].year);
      $('.walk_wr .ti .month').html(uniqueArr[1].month);
      target=true;
    }
    if(uniqueArr[1].left > e.target.scrollLeft && target && uniqueArr[0].left <= e.target.scrollLeft){
      load()
    }
  }
}

function walk_on(index){
  $('#weeklist li').eq(index).addClass("on").siblings().removeClass("on");
  $('.cir').eq(index).addClass("on").siblings().removeClass("on");
}

function linechat(data, id, tx, index){
  var dataLength = data.length ;
  var startDay = data[0].day - 0.5;
  var endDay = data[dataLength - 1].day + 0.5;
  var valdata = data.map(function(v){return v.value});
  valdata= Math.max.apply(null,valdata);
  const ojstag = document.getElementById(id);
  ojstag.style.width = dataLength * 11.5 + "vw";
  const width = ojstag.offsetWidth;            
  const height = ojstag.offsetHeight -30;
  var svgoj = d3.select("#"+id).append("svg")
  const xScale = d3.scaleLinear().domain([startDay, endDay]).range([0, width]);                
  const yScale = d3.scaleLinear().domain([-5, valdata + 5]).range([height, 0]);
  const xAxisSVG = svgoj.append("g").attr("transform", "translate(0, "+height+")");
  const xAxis = d3.axisBottom(xScale).tickSize(1).ticks(dataLength);
  xAxis(xAxisSVG);
  svgoj.selectAll(".domain").remove();
  svgoj.selectAll(".tick").attr('class', 'days');
  svgoj.call(d => d.selectAll('line').remove());
  const linearGenerator = d3.line().x(d=>xScale(d.day)).y(d=>yScale(d.value));
  const linear = d3.line().x(d=>xScale(d.day));
  svgoj.append("path").attr("d", linearGenerator(data)).attr("fill", "none").attr("stroke-width", 4).attr("stroke", "#e9ecef").attr("stroke-linecap", "round");
  svgoj.append("g").selectAll("circle").data(data).enter().append("circle").attr('class', 'cir').attr("r", 6).attr("cx", d=>xScale(d.day)).attr("cy", d=>yScale(d.value)).style("fill", "#fff").attr("stroke-width", 3).attr("stroke", "#5280e2")

  for (let index = 0; index < data.length; index++) {
    const element = data[index].value;
    var leftx = $('#'+id+' .days').eq(index).attr('transform').replaceAll("translate","").replace(/\)/g,'').replace(/\(/g,'').slice(0, -2);
    var topx = $('#'+id+' .cir').eq(index).attr('cy');
    var liHtml = `<li style="transform:translateX(${leftx}px)"><span class="liday"><span>${data[index].day}</span></span></li>`
    var liHtml1 = `<li style="transform:translate(${leftx}px, ${topx}px)"><span>${data[index].value}${tx}</span></li>`
    $('#'+id+' .linechatli').append(liHtml)
    $('#'+id+' .bar_tip').append(liHtml1)
  }
  $('#'+id+' .cir').on("click", function(e) {
    var index = $(this).index();
    lineclick(index)
  }); 
  $('#'+id+' .linechatli li').on("click", function(e) {
    var index = $(this).index();
    lineclick(index)
  }); 
  lineclick(index);
  function lineclick(index){
    $('#'+id+' .bar_tip li').eq(index).addClass("on").siblings().removeClass("on");
  }
}