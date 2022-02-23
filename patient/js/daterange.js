function daterangepicker(apply, cancel, langArr, page){
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
      "applyLabel": apply,
      "cancelLabel": cancel,
      "daysOfWeek": langArr,
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
    var first = $('.drp-calendar.left .month').text(),
        last = $('.drp-calendar.right .month').text();
    $('.date').html(first+' - '+last);
    $('html,body').css({'overflow':'hidden','position':'fixed','height':'100%'});
    $(window).resize(function(){
        var win_h = $(window).outerHeight();
        var pop_h = $('.daterangepicker').outerHeight();
        var position_top =  (win_h - pop_h) / 2;
        if(position_top <= 0){position_top = 0;}
        $('.daterangepicker').css('top',position_top);
        pop_h >= win_h ? $('.dimmed').css('height',pop_h) : $('.dimmed').css('height', 100 + "%");
        //console.log('win_h : '+win_h+', pop_h : '+pop_h+', position_top : '+position_top )
    }).resize();
  });
  $(document).on('click', '.dimmed, .drp-buttons .btn', function(){
    $('.dimmed').remove();
    $('.daterangepicker').unwrap();
    $('.header').remove();
    $('html,body').attr('style','');
  });
}