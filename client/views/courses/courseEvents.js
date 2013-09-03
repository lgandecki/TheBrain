
Template.courseEvents.course = function () {
    _course = Courses.findOne({_id: Session.get("selectedCourse")});

    return _course;
    //? _course.events : {}
    //CourseEvents.find({courseId: Session.get("selectedCourse")}, {sort: {"lastModified.on" : -1}});
}

Template.courseEvents.event = function() {
    if (this.events) {
        return this.events.reverse();
    }
    return [];
}

Template.courseEvents.eventData = function (e) {
    var _event = {};
    switch (this.type) {
        case 'created':

            _event = {
                message: "TheBrain hopes you will enjoy!",
                shortMessage: "created the course!"
            };
            break;
        case 'news':
            _event = {
                message: this.message,
                shortMessage: "shared good news!"
            };
            break;
//        case 'newLesson':
//            _course = Courses.findOne({_id: Session.get("selectedCourse")});
//            _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), this.lessonId);
//            _lesson = _course.lessons[_lessonIndex];
//            _event = {
//                message: "Lesson description: " + _lesson.shortDescription,
//                event: "created the " + _lesson.name + " lesson!"
//            }

    }
    _event.date = new moment(this.created.on).fromNow();
//    _event.date = _date.format("MMM Do");
    _user = Meteor.users.findOne(this.created.by);
    if (_user) {
        _event.user = Meteor.userDetails.getName(this.user);
        _event.picture = Meteor.userDetails.getProfilePicture(this.user);
    }
    else {
        _event.user = "deleted user";
    }
    console.log("_event", _event);
    return _event;
}



Template.addCourseNews.events({
    "click .btn-addNews": function(e) {
        e.preventDefault();
        Meteor.validations.clearErrors();
        $(e.target).attr("disabled", true).html("Adding...");
        if (validateNews()) {
            var _callOpts = {
                function: "addCourseNews",
                arguments: {
                    courseId: Session.get("selectedCourse"),
                    news: $(".newNews").val()
                },
                errorTitle: "Posting news error",
                successTitle: "News posted"
            }
            Meteor.myCall(_callOpts);
        }
        $(e.target).removeAttr("disabled").html("Post News");
    }
})

var validateNews = function() {
        invalids = [];
        Meteor.validations.checkIfEmpty(".newNews");
        return !!(invalids.length === 0);
}