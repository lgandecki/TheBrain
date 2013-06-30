Template.newCollectionModal.events({
    "click .addCollection": function (e, template) {
        e.preventDefault();
        console.log("Are we here in collectionAdd?");
        $(e.target).attr("disabled", true).html("Adding...");
        if (validateNewCollection()) {
           newCollection = createNewCollection();
//            console.log("Test");
//            newCollection = {
//                "name": "tralalal"
//            };
            Meteor.call('newCollection', newCollection, function (error, id) {
                if (error) {
                    console.log("Popup Error");
                    Meteor.popUp.error("Collection adding server error", error.reason);
                }
            });
            console.log("popup error 2");
            Session.set("newCollectionName", newCollection.name);
            Meteor.popUp.success("Collection added", "TheBrain made neural connections you asked for.");
            $("#newCollectionModal").modal("hide")
        }
        else {
            Meteor.validations.markInvalids();
            Meteor.popUp.error("Collection adding error", "TheBrain is confused. Make sure you provided all the required information!");
        }
        $(e.target).removeAttr("disabled").html("Add Modal");
    }
});

validateNewCollection = function() {
    invalids = [];
    Meteor.validations.checkIfEmpty("#newCollectionName");
    Meteor.validations.checkIfUniqueNameForUser("#newCollectionName", Collections);
    return !!(invalids.length === 0);
}
createNewCollection = function() {
    var _newCollection = {
        name: $("#newCollectionName").val()
    };
    return _newCollection;
};