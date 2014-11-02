if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

Meteor.theBrain.modals.commentsFlashcard = function() {
    var _opts = {
        withCancel: false,
        closeOnOk: true,
        okLabel: "Cool!"
    };

    Meteor.modal.initAndShow(Template.commentsFlashcardModal, "Flashcard's Comments", _opts);
};