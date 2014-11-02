if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

Meteor.theBrain.modals.flashcardHistory = function() {
    var _opts = {
        withCancel: false,
        closeOnOk: true,
        okLabel: "Alrighty!"
    };

    var _modal = Meteor.modal.initAndShow(Template.itemHistoryModal, "Flashcard's History", _opts);
    _modal.buttons.ok.on('click', function(button) {});

};