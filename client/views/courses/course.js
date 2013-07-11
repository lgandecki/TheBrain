var _renderer;

Meteor.subscribe("courseEvents", Session.get("selectedCourse"));

Template.course.course = function () {
    var _selectedCourse = Session.get("selectedCourse");
    return (_selectedCourse) ? Courses.findOne(_selectedCourse) : [];
}


Template.course.isCourseOwner = function () {
    var _selectedCourse = Courses.findOne(Session.get("selectedCourse"));
    if ($.inArray(Meteor.userId(), _selectedCourse.admins) === 0) {
        return true
    }
    else {
        return false;
    }
}

Template.course.rendered = function () {
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function () {
        Meteor.tabs.setHeight();
    }, 150);
};
