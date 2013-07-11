Template.newCourseModal.events({
    "click .addCourse": function (e, template) {
        e.preventDefault();
        Meteor.validations.clearErrors();
        $(e.target).attr("disabled", true).html("Adding...");
        if (validateNewCourse()) {
            newCourse = createNewCourse();
            _result = false;
            Meteor.call('newCourse', newCourse, function (error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", "Course adding server error: " + error.reason);
                }
                else {
                    Meteor.popUp.success("Course added", "TheBrain prepared new neural path you asked for.");
                    $("#newCourseModal").modal("hide");
                    _result = true;
                }
            });
            if (_result) {
                $("#newCourseModal").modal("hide");
            }
        }
        else {
            Meteor.validations.markInvalids();
            Meteor.popUp.error("TheBrain is confused", " Course adding error. Make sure you provided all the required information!");
        }
        $(e.target).removeAttr("disabled").html("Add Course");
    }
});

validateNewCourse = function() {
    invalids = [];
    Meteor.validations.checkIfEmpty("#newCourseName");
    Meteor.validations.checkIfUniqueNameForUser("#newCourseName", Courses);
    return !!(invalids.length === 0);
}
createNewCourse = function() {
    var _newCourse = {
        name: $("#newCourseName").val(),
        shortDescription: $("#newCourseShortDescription").val(),
        public: $("#newCoursePublic").val() || false
    };
    return _newCourse;
};