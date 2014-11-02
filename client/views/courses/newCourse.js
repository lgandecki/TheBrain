if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

var _newCourse = function () {
    Meteor.validations.clearErrors();
    if (validateNewCourse()) {
        var newCourse = createNewCourse();
        Meteor.call('newCourse', newCourse, function (error, id) {
            if (error) {
                Meteor.popUp.error("TheBrain is confused", "Course adding server error: " + error.reason);
            }
            else {
                Meteor.popUp.success("Course added", "TheBrain prepared new neural path you asked for.");
                Meteor.modal.hideClosestTo("#newCourseName");
            }
        });
    }
    else {
        Meteor.validations.markInvalids();
        Meteor.popUp.error("TheBrain is confused", " Course adding error. Make sure you provided all the required information!");
    }
}

Meteor.theBrain.modals.newCourse = function() {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
        okLabel: "Add Course"
    };

    var _modal = Meteor.modal.initAndShow(Template.courseForm, _title = "New Course", _opts);
    _modal.buttons.ok.on('click', function(button) {_newCourse()});
    _modal.template.events({
        'submit form': function(event) {
            console.log("submitted");
            _newCourse();
        }
    })
}

var validateNewCourse = function () {
    invalids = [];
    Meteor.validations.checkIfEmpty("#newCourseName");
    Meteor.validations.checkIfUniqueNameForUser("#newCourseName", Courses);
    return !!(invalids.length === 0);
}
var createNewCourse = function () {
    var _isPublic = $("#newCoursePublic").prop("checked") ? true : false;
    var _newCourse = {
        name: $("#newCourseName").val(),
        shortDescription: $("#newCourseShortDescription").val(),
        public: _isPublic
    };
    return _newCourse;
};