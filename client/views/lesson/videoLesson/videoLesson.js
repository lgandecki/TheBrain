var _lesson;
var _autorunHandle = null;

var _setLessonSession = function() {
    var _selectedCourse = Session.get("selectedCourse");
    var _youtube_id = Session.get("youtube_id");
    var _course = Courses.findOne({_id: _selectedCourse});
    var _lesson;
    if (_course && _youtube_id) {
        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, 'youtube_id'), _youtube_id);
        _lesson = _course.lessons[_lessonIndex];
        Session.set("_lesson", _lesson);
    }
};
Template.videoLesson.created = function() {
    _autorunHandle = Deps.autorun(function () {
        _setLessonSession();
    })
};

Template.videoLesson.destroyed = function() {
    _autorunHandle.stop();
};
Template.videoLesson.rendered = function() {
    window.setTimeout(function() {
        Meteor.tour.showIfNeeded("featuredCourseClickForFlashcards");
    }, 5000)
    _setLessonSession();
}

Template.videoLesson.youtubeVideoFlashcardsCount = function() {
    var _youtube_id = Session.get("youtube_id");
    Meteor.subscribe("youtubeVideoFlashcardsCount", _youtube_id);
    var _count =  YoutubeVideoFlashcardsCount.findOne({_id: _youtube_id});
    console.log("_count", _count);
    return _count && _count.count;
}
Template.videoLesson.courseTitle = function () {
    var _courseId = Session.get("selectedCourse");
    var _course = Courses.findOne({_id: _courseId});
    return _course && _course.name;
}

Template.videoLesson.videos = function() {
    var _courseId = Session.get("selectedCourse");
    var _course = Courses.findOne({_id: _courseId});
    return _course && _course.lessons;
}


Template.videoLesson.lessonTitle = function () {
    var _lesson = Session.get("_lesson");
    return _lesson && _lesson.name;

}

Template.videoLesson.videoDescription = function () {
    var _lesson = Session.get("_lesson");
    return _lesson && _lesson.shortDescription;
}

Template.videoLesson.youtubeId = function () {
    return Session.get("youtube_id");
}

Template.videoLesson.isNotFirstVideo = function () {
    var _lessonIndex = 0;
    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _youtube_id = Session.get("youtube_id");
    var _lesson;
    console.log("Course in created", _course);
    if (_course && _youtube_id) {
        _lessonIndex = _.indexOf(_.pluck(_course.lessons, 'youtube_id'), _youtube_id);
    }
    return _lessonIndex > 0;

}

Template.videoLesson.isNotLastVideo = function () {
    var _lessonIndex = 0;
    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _youtube_id = Session.get("youtube_id");
    console.log("Course in created", _course);
    if (_course && _youtube_id) {
        _lessonIndex = _.indexOf(_.pluck(_course.lessons, 'youtube_id'), _youtube_id);
    }

    return _course && _course.lessons && (_lessonIndex + 1 < _course.lessons.length);
}

Template.videoLesson.previousVideo = function () {
    var _lessonIndex = 0;
    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _youtube_id = Session.get("youtube_id");
    if (_course && _youtube_id) {
        _lessonIndex = _.indexOf(_.pluck(_course.lessons, 'youtube_id'), _youtube_id);
    }

    return _course && _course.lessons && _course.lessons[_lessonIndex - 1];

}

Template.videoLesson.courseId = function () {
    return Session.get("selectedCourse");
}

Template.videoLesson.nextVideo = function () {
    var _lessonIndex = 0;
    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _youtube_id = Session.get("youtube_id");
    if (_course && _youtube_id) {
        _lessonIndex = _.indexOf(_.pluck(_course.lessons, 'youtube_id'), _youtube_id);
    }

    return _course && _course.lessons && _course.lessons[_lessonIndex + 1];

};

Template.videoLesson.destroyed = function () {
    Session.set("selectedCourse", "");
    Session.set("youtube_id", "");
};

Template.videoLesson.events({
    "click .previousVideo": function (e) {
        var _href = $(e.target).attr("data-id");
        Router.go(_href);
    },
    "click .nextVideo": function (e) {
        var _href = $(e.target).attr("data-id");
        Router.go(_href);
    }
});


Template.videoLessonRow.currentLessonVideo = function() {
    var _youtube_id = Session.get("youtube_id");
    return _youtube_id === this.youtube_id;
};
