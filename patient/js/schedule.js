
function formatDate(date, yearIf) { 
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
var choiceDay = new Date();
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    footerToolbar: {
      right: 'dayGridMonth,timeGridWeek,today'
    },
    fixedWeekCount: false,
    views: {
      dayGridMonth: {
          titleFormat : function(date) {
            var month = '0'+(date.date.month +1);
            return date.date.year +". "+month.slice(-2);
          },
          dayHeaderContent: ({date}) => {
              var weekdays = ['일','월','화','수','목','금','토']
              return weekdays[date.getDay()]
          },
          navLinks: true,
          navLinkDayClick: function(date, jsEvent) {
            clickDay(date, jsEvent.srcElement)
          },
      },
      timeGridWeek: {
          titleFormat : function(date) {
            var startM = '0'+(date.date.month +1),
                startD = (date.date.day),
                endM = '0'+(date.end.month +1),
                endD = (date.end.day);
            return startM.slice(-2)+'.'+startD+' ~ '+endM.slice(-2)+'.'+endD
          },
          dayHeaderContent: ({date}) => {
              var weekdays = ['일','월','화','수','목','금','토']
              return {html: `<div class="col-header">${weekdays[date.getDay()]}</div><div class="col-day col-day`+date.getDate()+`">${date.getDate()}</div>`}
          },
          navLinks: true,
          navLinkDayClick: function(date, jsEvent) {
            clickDay(date, jsEvent.srcElement)
          },
      }
    },
    height: 'auto',
    events: [
      {
        start: '2021-11-19',
        end: '2021-11-28',
        display: 'background',
      },
      {
        start: '2021-11-06',
        end: '2021-11-08',
        display: 'background',
      }
    ],
    datesSet:function(info) {
      scheduleDayChange(choiceDay, choiceDay);
    },
  });
  calendar.render();
});   
function clickDay(date, tag){
  choiceDay = date;
  scheduleDayChange(choiceDay, date);
  //console.log(formatDate(choiceDay,true)) // 선택 날짜
}
$('.hselect select').change(function() {
  if($(this).val() == 'month'){
    $('.fc-dayGridMonth-button').trigger('click');
  }else{
    $('.fc-timeGridWeek-button').trigger('click');
  }
})
$('.today_btn').click(function() {
  choiceDay = new Date();
  scheduleDayChange(choiceDay, new Date());
  $('.fc-today-button').trigger('click');
});  

function scheduleDayChange(choice, date){
  $('.schedule_list h2').html(formatDate(date,false));
  if(formatDate(date,true) == formatDate(new Date(),true)){
    $('.today_btn').hide();
  }else{
    $('.today_btn').show();
  }
  $('#calendar .bg').removeClass('bg');
  $('.fc-day').each(function(){
    borne_sup = $(this).attr("data-date");
    borne_choice = formatDate(choice,true); 
    if(borne_choice == borne_sup){
      $(this).find('a').addClass('bg');
    }
  });
}