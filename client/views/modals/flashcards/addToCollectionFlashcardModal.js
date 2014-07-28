Template.collectionWithEmptyAndNewSelector.selectIfNew = function() {
    var _newCollectionName = Session.get("newCollectionName");
    if (_newCollectionName) {
        return this.name === _newCollectionName ? "selected" : "";
    }
}

Template.collectionWithEmptyAndNewSelector.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
}

Template.collectionWithEmptyAndNewSelector.rendered = function() {
    $("#collectionId.select2").select2();
    var _selectedId = $("#collectionId option:selected").val();
    $("#collectionId").select2("val", _selectedId);
}

Template.collectionWithEmptyAndNewSelector.events({
    "click .btn-collectionModal": function(e, template) {
        e.preventDefault();
        Meteor.theBrain.modals.newCollection();
    }
})



Template.addToCollectionFlashcardModal.events({
    "click .btn-addToCollection": function(e) {
        var _collectionId = $("#collectionId").val();
        if (_collectionId !== "") {
            var _callOpts = {
                function: "addFlashcardsToCollection",
                arguments: {
                    flashcardsIds: Session.get("selectedFlashcard") || Session.get("selectedFlashcards"),
                    collectionId: _collectionId
                },
                errorTitle: "Adding to collection error",
                successTitle: "Added to collection"
            }
            Meteor.myCall(_callOpts);
            $("#addToCollectionFlashcardModal").modal("hide");
        }
    }
})