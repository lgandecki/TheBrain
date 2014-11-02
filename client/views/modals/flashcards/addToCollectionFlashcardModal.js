if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

var _addToCollectionFlashcard = function () {
    var _collectionId = $("#collection").val();
    var _callOpts = {
        function: "addFlashcardsToCollection",
        arguments: {
            flashcardsIds: Session.get("selectedFlashcard") || Session.get("selectedFlashcards"),
            collectionId: _collectionId
        },
        errorTitle: "Adding to collection error",
        successTitle: "Added to collection"
    };
    Meteor.myCall(_callOpts, function(success) {
        if (success) {
            Meteor.modal.hideClosestTo("#commentsFlashcardModal");
        }
    });
};

Template.addToCollectionFlashcardModal.destroyed = function () {
    delete Session.keys["selectedFlashcard"];
};


Meteor.theBrain.modals.addToCollectionFlashcard = function () {
    var _opts = {
        withCancel: true,
        closeOnOk: false
    };

    var _modal = Meteor.modal.initAndShow(Template.addToCollectionFlashcardModal, "Add Flashcards to Collection", _opts);
    _modal.buttons.ok.on('click', function () {
        _addToCollectionFlashcard()
    });

};
