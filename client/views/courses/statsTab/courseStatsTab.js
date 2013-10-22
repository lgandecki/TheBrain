Template.courseStatsTab.created = function() {
    var _opts = {
        courseId: Session.get("selectedCourse")
    }
    Meteor.subscribe("courseStats", _opts);
}

Template.courseStats.flashcard = function() {
    var _selectedCourseId = Session.get("selectedCourse");
    var _selectedCourse = Courses.findOne({_id: _selectedCourseId});
    if (!_selectedCourse) {
        return;
    }

    var _studentsFlashcards = _.flatten(_.pluck(_selectedCourse.lessons, 'studentsFlashcards'));
    var _teacherFlashcards = _.flatten(_.pluck(_selectedCourse.lessons, 'teacherFlashcards'));
    var _flashcardsIds = _.union(_studentsFlashcards, _teacherFlashcards);
    return Flashcards.find({_id: {$in: _flashcardsIds}});
}

//$(function () {
//    $('#container').highcharts({
//
//        chart: {
//            marginRight: 50
//        },
//        tooltip: {
//            formatter: function() {
//                var s = '<b>'+ this.x +'</b>';
//
//                $.each(this.points, function(i, point) {
//                    s += '<br/>'+ point.series.name +': '+
//                        point.y + "test" + point.point.test;
//                    console.log("point", point);
//                });
//
//                return s;
//            },
//            shared: true,
//            crosshairs: true
//
//        },
//        series: [{
//            data: [29, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, {
//                x: 11,
//                y: 54.4,
//                test: this.x
//            }]
//        },
//
//            {data: [30, 75, 1.4, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, {
//                x: 13,
//                y: 24.4,
//                test: "elo"
//            }]}]
//
//    });
//});