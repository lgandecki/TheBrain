Handlebars.registerHelper('isCourseOwner', function () {
    var _selectedCourse = Courses.findOne({
        _id: Session.get("selectedCourse")
    }, {
        fields: {
            admins: 1
        }
    });
    if (_selectedCourse) {
        return ($.inArray(Meteor.userId(), _selectedCourse.admins) > -1) ? true : false;
    } else {
        return false;
    }

});