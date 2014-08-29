if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

var _addToCourseFlashcard = function () {
    var _opts = {
        courseId: $("#course").val(),
        lessonId: $("#lesson").val(),
        flashcardsIds: Session.get("selectedFlashcard") || Session.get("selectedFlashcards"),
    };
    var _callOpts = {
        function: "addFlashcardsToCourse",
        arguments: _opts,
        errorTitle: "Adding to course error",
        successTitle: "Added to course"
    };
    Meteor.myCall(_callOpts, function (success) {
        if (success) {
            Meteor.modal.hideClosestTo("#addToCourseFlashcardModal");
        }
    });
};

Meteor.theBrain.modals.addToCourseFlashcard = function () {
    var _opts = {
        withCancel: true,
        closeOnOk: false
    };

    var _modal = Meteor.modal.initAndShow(Template.addToCourseFlashcardModal, "Add Flashcard to Course", _opts);
    _modal.buttons.ok.on('click', function () {
        _addToCourseFlashcard()
    });
}