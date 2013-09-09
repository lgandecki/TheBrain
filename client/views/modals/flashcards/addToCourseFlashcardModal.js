Template.courseSelector.course = function() {
    return Courses.find();
}

Template.courseSelector.lesson = function() {
    var _selectedCourse, _course;
    _selectedCourse = Session.get("selectedCourseInForm") || $("#courseId.select2").val();
    console.log("_selectedCourse", _selectedCourse);
    if (_selectedCourse) {
        _course = Courses.findOne({
            _id: _selectedCourse
        });
    }
    return _course ? _course.lessons : [];
}

var _renderer;

Template.courseSelector.rendered = function() {
    $("#courseId.select2").select2();
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function() {
        $("#lessonId.select2").select2();
        $("#courseId.select2").select2().on("change", function(e) {
            Session.set("selectedCourseInForm", e.val);
        });
    }, 100);
}
Template.courseSelector.destroyed = function() {
    Session.set("selectedCourseInForm", "");
    Session.set("selectedLesson", "");
}

Template.addToCourseFlashcardModal.events({
    "click .btn-addToCourse": function(e) {
        var _opts = {
            courseId : $("#courseId").val(),
            lessonId : $("#lessonId").val(),
            flashcardsIds: Session.get("selectedFlashcard") || Session.get("selectedFlashcards"),
        }
        if (_opts.courseId !== "" && _opts.lessonId !== "") {
            var _callOpts = {
                function: "addFlashcardsToCourse",
                arguments: _opts,
                errorTitle: "Adding to course error",
                successTitle: "Added to course"
            }
            Meteor.myCall(_callOpts);
            $("#addToCourseFlashcardModal").modal("hide");
        }
    }
})