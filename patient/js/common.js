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

    /* 인풋박스 포커스 이벤트 */
    $('.input_default input, .input_default .form_select').focusin(function(){
      $(this).closest('.input_default').addClass('focus');
    }).focusout(function(){
      $(this).closest('.input_default').removeClass('focus');
    });
    /* 인풋박스 포커스 이벤트 */

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