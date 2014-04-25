Template.calendar.rendered = function() {

//    Meteor.subscribe("calendarItemsToRepeat", "08", "2013");

    setTimeout(function() {
    $('#calendar').fullCalendar({
        events: function(start, end, callback) {
            Meteor.subscribe("calendarItemsToRepeat", start, end, function() {
                var _calendarItemsToRepeat = CalendarItemsToRepeat.findOne();
                var _fullCalendarEvents = [];

                if (_calendarItemsToRepeat) {
                    console.log("_calendarItemsToRepeat", _calendarItemsToRepeat);
                    _fullCalendarEvents = _.flatten(_calendarItemsToRepeat.count);
                }
                console.log("_fullCalendarEvents", _fullCalendarEvents);

//                _fullCalendarEvents = _.flatten({ '2013-08-14T05:00:00.000Z': { start: '2013-08-14T05:00:00.000Z', title: 2 } });
//                _fullCalendarEvents = [{ start: '2013-08-14T05:00:00.000Z', title: "2" }];
//                _fullCalendarEvents = [
//                    {
//                        title  : 'event1',
//                        start  : '2013-08-01'
//                    },
//                    {
//                        title  : 'event2',
//                        start  : '2013-08-05',
//                        end    : '2013-08-07'
//                    },
//                    {
//                        title  : 'event3',
//                        start  : '2013-08-09 12:30:00',
//                        allDay : false // will make the time show
//                    }
//                ];
                callback(_fullCalendarEvents);
            });
//            callback([])
        }


//            [
//            {
//                title  : 'event1',
//                start  : '2013-08-01'
//            },
//            {
//                title  : 'event2',
//                start  : '2013-08-05',
//                end    : '2013-08-07'
//            },
//            {
//                title  : 'event3',
//                start  : '2013-08-09 12:30:00',
//                allDay : false // will make the time show
//            }
//        ]
    });
    $('[class*="fc-button"]').addClass('btn').addClass("btn-primary").addClass("btn-primary-main");

    }, 500);
//        $oldTable = $('.fc-header-right > table');
//
//    $('<div>')
//        .addClass('btn-group')
//        .appendTo('.fc-header-right')
//        .append($fcButtons);
//
//    $oldTable.remove();
}