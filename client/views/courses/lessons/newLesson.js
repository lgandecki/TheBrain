if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};


var _newLesson = function () {
    Meteor.validations.clearErrors();
    if (validateNewLesson()) {
        var newLesson = createNewLesson();
        Meteor.call('newLesson', newLesson, function (error, id) {
            if (error) {
                console.log("we got the error here");
                Meteor.popUp.error("TheBrain is confused", "Lesson adding server error: " + error.reason);
            }
            else {
                Meteor.popUp.success("Lesson added", "TheBrain prepared new neural path you asked for.");
                Meteor.modal.hideClosestTo("#newLessonName");
            }
        });
    }
    else {
        Meteor.validations.markInvalids();
        Meteor.popUp.error("TheBrain is confused", "Lesson adding error. Make sure you provided all the required information!");
    }
};

Meteor.theBrain.modals.newLesson = function() {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
        okLabel: "Add Lesson"
    };

       var _course = Courses.findOne({_id: Session.get("selectedCourse")});

    var _modal = Meteor.modal.initAndShow(Template.lessonForm, _title = "New Lesson for Course: " + _course.name, _opts);
    _modal.buttons.ok.on('click', function(button) {_newLesson()});

}



validateNewLesson = function () {
    var invalids = [];
    Meteor.validations.checkIfEmpty("#newLessonName");
    return !!(invalids.length === 0);
};

createNewLesson = function () {
    var _newLesson = {
        name: $("#newLessonName").val(),
        shortDescription: $("#newLessonShortDescription").val(),
        courseId: Session.get("selectedCourse")
    };
    return _newLesson;
};