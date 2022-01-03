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

var admin = admin || {
    init:function() {
      admin.gnb();
    },
    gnb: function(){
      // $(window).on("scroll", function(){
      //   if($(document).scrollTop() > 0){
      //     $("#wrap").addClass("fixed_header");
      //   }else{
      //     $("#wrap").removeClass("fixed_header");
      //   }
      // });
      $(document).on('click', '.avatar',function(){
        $(this).addClass('on').next('.state').fadeIn();
      });
      $('body').on('click', function(){
        $('.avatar').removeClass('on').next('.state').fadeOut();
      });
    },//gnb
    pieChart:function($this, data) {
        var box = $($this),
            dataSet = data,
            width = box.width(),
            height = box.height(),
            radius = Math.min(width, height) / 2;
        box.append('<p>%</p>');
        var list = '';
        for(var i=0; i < dataSet.length; i++){
          list += '<li><i style="background-color:'+ dataSet[i].color +';"></i>'+ dataSet[i].id +'<strong>'+ dataSet[i].percent+'%</strong></li>'
        }
        box.before('<ul>'+ list +'</ul>')
        var svg = d3.select($this).append("svg").attr("width", width).attr("height", height);
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var arcData = [
            {percent:dataSet[0].percent, startAngle: 0, endAngle:(Math.PI/50)* dataSet[0].percent, bgColor: dataSet[0].color},
            {percent:dataSet[1].percent, startAngle: (Math.PI/50)* dataSet[0].percent, endAngle:(Math.PI/50)* (dataSet[0].percent+dataSet[1].percent), bgColor: dataSet[1].color},
            {percent:dataSet[2].percent, startAngle: (Math.PI/50)* (100 - dataSet[2].percent), endAngle:(Math.PI*2), bgColor: dataSet[2].color},
        ];
        var arc = d3.arc()
          .innerRadius(30)
          .outerRadius(70);
        g.selectAll('path')
            .data(arcData)
            .enter()
            .append('path')
            .attr('d', arc)
            .each(function(d) {
                d3.select(this)
                .attr("fill", d.bgColor)
            });
        var circleGp = g.selectAll('g').data(arcData)
            .enter()
            .append('text')
            .each(function(d) {
              var centroid = arc.centroid(d);
              d3.select(this)
                  .attr('x', centroid[0]*1)
                  .attr('y', centroid[1]*1)
                  .attr('dy', '6')
                  .attr('style', 'fill:#fff')
                  .text(function(d){
                    var per = ( d.percent > 0 ) ? d.percent : '';
                    return per
                  });
            });
    },//pieChart
    tab : {
        init: function(){
          if($(".as_tab_wrap").length == 0){return;}
          $tabEle = $(".as_tab_menu > li");
          console.log('tab')
          this.event();
        },
        event: function(){
          var tab = this;

          $tabEle.find('a[href^="#"]').click(function(e){e.preventDefault();});
          $tabEle.on("click", function(e){
            tab.action($(this), $(this).closest(".as_tab_menu").find(" > li").index(this));
          });
          $tabEle.not(":hidden").each(function() {
            if ($(this).parent(".as_tab_menu").hasClass("flexible")){
              return;
            } else {
              var menuEa = $(this).parent(".as_tab_menu").find("li").length;
              var menuSize = (100/menuEa);
              $(this).parent(".as_tab_menu").find("li").width(menuSize+"%");
            }
          });
          if (($tabEle).hasClass("active")) {
            $(".as_tab_wrap .as_tab_menu > li.active > a").trigger("click");
          } else {
            $(".as_tab_wrap .as_tab_menu > li:first-child > a").trigger("click");
          }
        },
        action: function(ele, getIndex){
          var $findNode = $(ele);
          var $findEle = $findNode.closest(".as_tab_wrap ").find(" > .inner_depth > .tab_inner");
          $(ele).addClass("active").siblings().removeClass("active");
          $findEle.css("display","none");
          $findEle.eq(getIndex).css("display","block");
        }
    },//tab menu
};

window.onload = function(){
    admin.init();
};