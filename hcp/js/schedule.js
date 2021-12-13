function fullcalendar(id, week){
  var choiceDay = new Date();
    document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById(id);
      var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'title',
          right: 'prev,next'
        },
        footerToolbar: {
          right: 'dayGridMonth,timeGridWeek,today'
        },
        fixedWeekCount: week,
        titleFormat : function(date) {
          var month = '0'+(date.date.month +1);
          return date.date.year +". "+month.slice(-2);
        },
        navLinks: true,
        navLinkDayClick: function(date, jsEvent) {
          // var year = date.getFullYear(),
          //     month = parseInt(date.getMonth())+1,
          //     day = date.getDate();
          // $('.fc-day').removeClass('bg');
          // //jsEvent.srcElement.classList.add('bg');
          // jsEvent.srcElement.closest('.fc-day').classList.add('bg');

          clickDay(date, jsEvent.srcElement)
          calendar.gotoDate(date);
          //console.log(year+'-'+month+'-'+day);
        },
        views: {
          dayGridMonth: {
              dayHeaderContent: ({date}) => {
                  var weekdays = ['일','월','화','수','목','금','토']
                  return weekdays[date.getDay()]
              },
          },
          timeGridWeek: {
              dayHeaderContent: ({date}) => {
                  var weekdays = ['일','월','화','수','목','금','토']
                  return {html: `<div class="col-header">${weekdays[date.getDay()]}</div><div class="col-day col-day`+date.getDate()+`">${date.getDate()}</div>`}
              },
          }
        },
        height: 'auto',
        events: scheduleData,
        datesSet:function(info) {
          scheduleDayChange(choiceDay, choiceDay);
        },
      });
      calendar.render();
    });

    function formatDate(date, yearIf){
      var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      if (month.length < 2)
      month = '0' + month;
      if (day.length < 2)
      day = '0' + day;
      if(yearIf){
        return year+'-'+month+'-'+day;
      }else{
        return [month, day].join('.');
      }
    }
    function clickDay(date, tag){
      choiceDay = date;
      scheduleDayChange(choiceDay, date);

      console.log(formatDate(date,true));
    }
    function scheduleDayChange(choice, date){
      $('#fullcalendar .bg').removeClass('bg');
      $('.fc-daygrid-body .fc-day').each(function(i){
        borne_sup = $(this).attr("data-date");
        borne_choice = formatDate(choice,true);
        if(borne_choice == borne_sup){
          $(this).addClass('bg');
        }
      });
      $('.fc-col-header .fc-day').each(function(i){
        borne_sup = $(this).attr("data-date");
        borne_choice = formatDate(choice,true);
        if(borne_choice == borne_sup){
          $('.time_wrap ul').eq(i).addClass('active').siblings().removeClass('active');
        }
      });
      //오늘 버튼 on / off 필요하면 쓰고 // 안쓰면 생기는건,, 해당 달일때 이벤트 disable 걸림
      ($('.fc-today-button').is(':disabled')) ? $('.btn_today').hide() : $('.btn_today').show() ;
    }
  $(function(){
    /* 월간, 주간 tridder */
    $('.btn_today').click(function() {
      $('.fc-today-button').trigger('click');
    });
    $('.btn_month').on('click', function(){
      $('.time_wrap').hide();
      $('.fc-dayGridMonth-button').trigger('click');
    });
    $('.btn_week').on('click', function(){
      $('.time_wrap').fadeIn(300);
      $('.fc-timeGridWeek-button').trigger('click');
    });
  })
}//fullcalendar