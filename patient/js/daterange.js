function daterangepicker(page){
  var maxDateDay = false;
  var minDateDay = false;
  var now = new Date();
  var yesterday = new Date(now.setDate(now.getDate() - 1));

  if(page == 'schedule'){
    minDateDay = new Date();
  }else{
    maxDateDay = yesterday;
  }
  $('#calendar').daterangepicker({
    maxDate: maxDateDay,
    minDate: minDateDay,
    autoUpdateInput:true,
    "locale": {
      "format": "YYYY.MM.DD",
      "separator": " - ",
      "applyLabel": "선택완료",
      "cancelLabel": "취소",
      "daysOfWeek": [ "일","월","화","수","목","금","토" ],
      "monthNames": [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ],
      "firstDay": 0,
      "startDate": now.setDate(now.getDate()-1),
      "endDate": now.setDate(now.getDate()-1),
      "drops": "auto"
    },
    }, function(start, end, label){
      console.log(start.format('YYYY-MM-DD') +' - '+ end.format('YYYY-MM-DD'));
  });
  $(document).on('click', '.btn-prev', function(){
      $('.prev').trigger('click');
          first = $('.drp-calendar.left .month').text();
          last = $('.drp-calendar.right .month').text();
      $('.date').html(first+' - '+last);
  });
  $(document).on('click', '.btn-next', function(){
      $('.next').trigger('click');
          first = $('.drp-calendar.left .month').text();
          last = $('.drp-calendar.right .month').text();
      $('.date').html(first+' - '+last);
  });
  $('#calendar').on('focus', function(){
    if($('.wrap-layer').length == 0){
      $('.daterangepicker').wrap('<div class="wrap-layer"></div>').before('<div class="dimmed"></div>');
      $('.daterangepicker').prepend('<div class="header"><div class="date"></div><button class="btn-prev"></button><button class="btn-next"></button></div>');
    }
    $('html,body').css({'overflow':'hidden','position':'fixed','height':'100%'});
    var first = $('.drp-calendar.left .month').text(),
        last = $('.drp-calendar.right .month').text();
    $('.date').html(first+' - '+last);
  });
  $(document).on('click', '.dimmed, .drp-buttons .btn', function(){
    $('.dimmed').remove();
    $('.daterangepicker').unwrap();
    $('.header').remove();
    $('html,body').attr('style','');
  });
}