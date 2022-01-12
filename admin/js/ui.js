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
      admin.lnb();
      admin.tab.init();
      admin.checkAll();
      admin.selectPlaceholder();
      admin.fileLoad();

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
    lnb: function(i,j){
        var _nav = $('.container aside');
        $('.btn_menu').on('click', function(){
          $('html,body').css({'overflow':'hidden','position':'fixed','height':'100%'});
          _nav.show().animate({right:0},300);
        });
        $('nav .btn_close, .dimmed').on('click', function(e){
          $('html,body').attr('style','');
          _nav.animate({right:'100%'},200, function(){
            $(this).hide();
          });
        });

        $('nav li').eq(i).addClass('active').find('.depth a').eq(j).addClass('active');

        $('nav li a').on('click', function(){
          $(this).parent().addClass('active').siblings().removeClass("active");
        });
    },
    modalsClose: function(id){
      $('html,body').attr('style','');
      $('#'+id).removeClass('show');
      setTimeout(() => {
        $('#'+id).removeClass('on');
      }, 500);
    },
    modalsShow: function(id){
      var name_id = $('#'+id),
          $htmlH = $("html").scrollTop();
      $('html,body').css({'overflow':'hidden','position':'fixed','height':'100%'});
      name_id.addClass('on');
      setTimeout(() => {
          name_id.addClass('show');
      }, 200);
      name_id.find('.btn_close').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            $('html,body').attr('style','');
            name_id.removeClass('show');
            setTimeout(() => {
                name_id.removeClass('on');
            }, 500);
            $('html').scrollTop($htmlH)
      });
    },
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
    checkAll:function(){
        if($('.check_all_wrap').length == 0){return;}
        $('#checkAll').on('click', function(){
            $('.check_all_wrap input[type="checkbox"]').prop('checked', $(this).prop('checked'));
        });
        $('.check_all input[type="checkbox"], tbody input[type="checkbox"]').on('click', function(){
            var $length = $('.check_all input[type="checkbox"], tbody input[type="checkbox"]').length,
                $checked = $('.check_all input[type="checkbox"]:checked, tbody input[type="checkbox"]:checked').length;
            if($length === $checked){
                $('#checkAll').prop('checked', true);
            }else{
                $('#checkAll').prop('checked', false);
            }
        });
    },//checkAll
    selectPlaceholder: function (){
        if($('.inp_select').length == 0){return;}
        $("select").change(function(){
            $(this).closest('.inp_select').addClass("selected");
        });
    },
    fileLoad: function(){
        if($('.inp_file').length == 0){return;}
        $('input[type="file"]').on('change', function(){
            var nameFile = $(this).val();
            $(this).parent('.inp_file').children('input[type="text"]').val(nameFile);
            $(this).parent('.inp_file').children('.btn_del').show();
        });
        $('.btn_del').on('click', function(){
            $(this).parent('.inp_file').children('input[type="text"]').val("");
            $(this).parent('.inp_file').children('.btn_del').hide();
        });
        $('input[type="text"]').on('click', function(){
            $(this).next('.btn_file').trigger('click');
        });
    },
    daterangepicker: function(ele, type, single){
      var $this = $(ele),
          clickDay = '';
      $this.daterangepicker({
        autoApply:true,
        inline: type,
        singleDatePicker: single,
        "locale": {
          "format": "YYYY.MM.DD",
          "separator": " - ",
          "applyLabel": "선택완료",
          "cancelLabel": "취소",
          "daysOfWeek": [ "일","월","화","수","목","금","토" ],
          "monthNames": [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],
          "firstDay": 0,
          "startDate": new Date(),
          "endDate": new Date(),
          "drops": "auto"
        },
        }, function(start, end, label){
          clickDay = start.format('YYYY-MM-DD') +' - '+ end.format('YYYY-MM-DD');
          console.log(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
        if (type === true && $(ele).parents(".inner_schedule_add")) {
            $(".checked_range").remove();
            $(ele).parents('.inner_schedule_add').addClass("show_rangebox").append('<p class="checked_range">' + clickDay + '</p>')
        } else if (type === true) {
            $(".checked_range").remove();
            $('.datepicker_wrap').before('<p class="checked_range">' + clickDay + '</p>')
          };
      });
      if(type === true){
        $('.daterangepicker').addClass('datepicker_open');
      }
    },
    tab : {
        init: function(){
          if($(".as_tab_wrap").length == 0){return;}
          $tabEle = $(".as_tab_menu > li");

          this.event();
        },
        event: function(){
          var tab = this;

          $tabEle.find('a[href^="#"]').click(function(e){e.preventDefault();});
          $tabEle.on("click", function(e){
            tab.action($(this), $(this).closest(".as_tab_menu").find(" > li").index(this));
          });
          // $tabEle.not(":hidden").each(function() {
          //   if ($(this).parent(".as_tab_menu").hasClass("flexible")){
          //     return;
          //   } else {
          //     var menuEa = $(this).parent(".as_tab_menu").find("li").length;
          //     var menuSize = (100/menuEa);
          //     $(this).parent(".as_tab_menu").find("li").width(menuSize+"%");
          //   }
          // });
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