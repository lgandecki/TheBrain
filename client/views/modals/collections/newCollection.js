if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

var _newCollection = function(button) {
    Meteor.validations.clearErrors();
    if (validateNewCollection()) {
        var newCollection = createNewCollection();
        Meteor.call('newCollection', newCollection, function (error, id) {
            if (error) {
                console.log("dostalem ten error?", error);
                Meteor.popUp.error("TheBrain is confused", "Collection adding server error: " + error.reason);
            }
            else {
                Session.set("newCollectionName", newCollection.name);
                Meteor.popUp.success("Collection added", "TheBrain made neural connections you asked for.");
                Meteor.modal.hideClosestTo("#newCollectionName");

            }
        });
    }
    else {
        Meteor.validations.markInvalids();
        Meteor.popUp.error("TheBrain is confused", "Error adding collection. Make sure you provided all the required information!");
    }
};

Meteor.theBrain.modals.newCollection = function() {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
        okLabel: "Add Collection"
    };

    var _modal = Meteor.modal.initAndShow(Template.collectionForm, _title = "New Collection", _opts);
    _modal.buttons.ok.on('click', function(button) {_newCollection(button)});
}



var validateNewCollection = function() {
    var invalids = [];
    Meteor.validations.checkIfEmpty("#newCollectionName");
    Meteor.validations.checkIfUniqueCollectionName("#newCollectionName", "collections");
    return !!(invalids.length === 0);
}
var createNewCollection = function() {
    var _newCollection = {
        name: $("#newCollectionName").val()
    };
    return _newCollection;
};