if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

var _goHome = function() {
    Router.go("/");
    Meteor.modal.hideClosestTo("#doneForToday");
};

Meteor.theBrain.modals.doneForToday = function() {
    var _title;
    var _opts = {
        withCancel: false,
        closeOnOk: false,
        okLabel: "Back to home"
    };

    var _modal = Meteor.modal.initAndShow(Template.doneForTodayModal, _title = "All done!", _opts);
    _modal.buttons.ok.on('click', function(button) {_goHome()});

}
