Template.newCollectionModal.events({
    "click .addCollection": function (e, template) {
        e.preventDefault();
        Meteor.validations.clearErrors();
        $(e.target).attr("disabled", true).html("Adding...");
        if (validateNewCollection()) {
           newCollection = createNewCollection();
            Meteor.call('newCollection', newCollection, function (error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", "Collection adding server error: " + error.reason);
                }
                else {
                    Session.set("newCollectionName", newCollection.name);
                    Meteor.popUp.success("Collection added", "TheBrain made neural connections you asked for.");
                    $("#newCollectionModal").modal("hide")
                }
            });
        }
        else {
            Meteor.validations.markInvalids();
            Meteor.popUp.error("TheBrain is confused", "Error adding collection. Make sure you provided all the required information!");
        }
        $(e.target).removeAttr("disabled").html("Add Collection");
    }
});

validateNewCollection = function() {
    invalids = [];
    Meteor.validations.checkIfEmpty("#newCollectionName");
    Meteor.validations.checkIfUniqueCollectionName("#newCollectionName", "collections");
    return !!(invalids.length === 0);
}
createNewCollection = function() {
    var _newCollection = {
        name: $("#newCollectionName").val()
    };
    return _newCollection;
};