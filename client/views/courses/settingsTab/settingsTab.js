
Template.courseSettings.course = function() {
    return Courses.findOne({
        _id: Session.get("selectedCourse")
    });
}


Template.courseSettings.rendered = function() {
    $.fn.editable.defaults.mode = 'inline';

    $('.course-name.editable:not(.editable-click)').editable('destroy').editable({
        success: function (response, newName) {

            var _callOpts = {
                function: "changeCourseName",
                arguments: {
                    courseId: Session.get("selectedCourse"),
                    name: newName
                },
                errorTitle: "Changing name of the course error",
                successTitle: "Course name changed"
            }
            Meteor.myCall(_callOpts);


        }});
}
Template.courseSettings.switchPublicBtnText = function () {
    return _isCoursePublic() ? "Click to hide/make private" : "Click to make public";
};

Template.courseSettings.switchPublicBtnAction = function () {
    return _isCoursePublic() ? "btn-courseMakePrivate" : "btn-courseMakePublic";
};

var _isCoursePublic = function() {
    var _course = Courses.findOne({
        _id: Session.get("selectedCourse")
    });
    return _course && _course.public;
}


Template.courseSettings.events({
    "click .btn-courseMakePrivate": function (e) {
        var _callOpts = {
            function: "makeCoursePrivate",
            arguments: {
                courseId: Session.get("selectedCourse")
            },
            errorTitle: "Making course private error",
            successTitle: "Course is private now"
        }
        Meteor.myCall(_callOpts);
    },
    "click .btn-courseMakePublic": function (e) {
        var _callOpts = {
            function: "makeCoursePublic",
            arguments: {
                courseId: Session.get("selectedCourse")
            },
            errorTitle: "Making course public error",
            successTitle: "Course is public now"
        }
        Meteor.myCall(_callOpts);
    },

})