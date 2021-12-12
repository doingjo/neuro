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

var hcp = hcp || {
    init:function() {
      hcp.tab.init();
      hcp.gnb();
      hcp.inputFocus();
      hcp.memberLose();
      hcp.faqlist();
      hcp.fileload();
      hcp.survey();
      hcp.btnpass();
      hcp.selectplaceholder();
    },
    gnb: function(){
      $(window).on("scroll", function(){
        if($(document).scrollTop() > 0){
          $(".wrapper").addClass("fixed_header");
        }else{
          $(".wrapper").removeClass("fixed_header");
        }
      });
      $(document).on('click', '.list_gnb li',function(){
        $(this).addClass('on').siblings().removeClass('on');
      });
      $(document).on('click', '.box_avatar',function(){
        $(this).addClass('on').next('.box_state').fadeIn();
      });
      $('body').on('click', function(){
        $('.box_avatar').removeClass('on').next('.box_state').fadeOut();
      });
      $(document).on('click', '.box_link a',function(){
        $(this).addClass('on').siblings().removeClass('on');
      });
    },//gnb
    inputFocus: function(){
      if($('.deco_select select, .deco_search input, .round_select select').length == 0){return;}
      $('.deco_select select, .deco_search input, .round_select select').focusin(function(){
        $(this).closest('.deco_select, .deco_search, .round_select').addClass('focus');
      }).focusout(function(){
        $(this).closest('.deco_select, .deco_search, .round_select').removeClass('focus');
      });
    },
    memberLose: function(){
      if($(".inner_member").length == 0){return;}
      $(document).on('click', '.inner_member .check_type1 label',function(){
        var target = $('.inner_member').find('button');
        if($('.inner_member input[type="checkbox"]').prop('checked')){
          target.attr('disabled', true);
        }else{
          target.attr('disabled', false);
        }
      });
    },
    faqlist: function(){
      $(".box_faq").on("click", function(){
          if($(this).siblings(".box_faq").hasClass("open")){
              $(this).parent(".list_faq").children(".box_faq").removeClass("open");
              $(this).addClass("open");
          }else if($(this).hasClass("open")){
              $(this).removeClass("open");
          }else{
              $(this).addClass("open");
          };
      });
    },
    fileload: function(){
        $(".input_function").on("change", function(){
            var nameFile = $(this).val();
            $(this).parent(".box_input_file").children(".input_view").val(nameFile);
            $(this).parent(".box_input_file").children(".btn_del").show();
        });
        $(".btn_del").on("click", function(){
            $(this).parent(".box_input_file").children(".input_view").val("");
            $(this).parent(".box_input_file").children(".btn_del").hide();
        });
        $(".input_view").on("click", function(){
            $(this).next(".btn_file").trigger("click");
        });
    },
    survey: function(){
        $(".list_tab li").on("click", function(){
              $(this).addClass("on").siblings().removeClass("on");
          });
          $(".input_chk_txtbox input[type='text']").on("click", function(){
              $(this).parent(".input_chk_txtbox").children("label.etc").trigger("click");
              $(this).focus();
          });
    },
    modals_close: function(id){
      $('#'+id).removeClass('show');
      setTimeout(() => {
        $('#'+id).removeClass('on');
      }, 500);
    },
    modals_show: function(id){
      $('#'+id).addClass('on');
      setTimeout(() => {
        $('#'+id).addClass('show');
      }, 200);
    },
    btnpass: function(){
      $('.btn_showtxt').on('click', function () {
        var type = $(this).prev('input');
        if(type.attr('type') == 'password'){
          type.attr('type', 'text');
          $(this).addClass("on");
        }else{
          type.attr('type', 'password');
          $(this).removeClass("on");
        }
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
    selectplaceholder: function (){ 
      $("select").change(function(){
            $(this).parent().addClass("selected");
          });
    },
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
    hcp.init();
};