Template.newLessonModal.events({
    "click .addLesson": function (e, template) {
        e.preventDefault();
        Meteor.validations.clearErrors();
        $(e.target).attr("disabled", true).html("Adding...");
        if (validateNewLesson()) {
            newLesson = createNewLesson();
            _result = false;
            Meteor.call('newLesson', newLesson, function (error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", "Lesson adding server error: " + error.reason);
                }
                else {
                    Meteor.popUp.success("Lesson added", "TheBrain prepared new neural path you asked for.");
                    $("#newLessonModal").modal("hide");
                    _result = true;
                }
            });
            if (_result) {
                $("#newLessonModal").modal("hide");
            }
        }
        else {
            Meteor.validations.markInvalids();
            Meteor.popUp.error("TheBrain is confused", "Lesson adding error. Make sure you provided all the required information!");
        }
        $(e.target).removeAttr("disabled").html("Add Lesson");
    }
});

validateNewLesson = function() {
    invalids = [];
    Meteor.validations.checkIfEmpty("#newLessonName");
    return !!(invalids.length === 0);
}
createNewLesson = function() {
    var _newLesson = {
        name: $("#newLessonName").val(),
        shortDescription: $("#newLessonShortDescription").val(),
        courseId: Session.get("selectedCourse")
    };
    return _newLesson;
};