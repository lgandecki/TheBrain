var itemsHandle;
var _opts = {};
Template.myCollectionsFlashcards.created = function () {
    var _selectedCollection = Session.get("selectedCollection");
    if (_selectedCollection) {
        _opts = {
            collectionId: _selectedCollection
        };
    }

    itemsHandle = Meteor.subscribeWithPagination('paginatedItems', _opts, 10);
}

Template.withSelectedItems.isCollectionSelected = function() {
    var _collectionId = Session.get("selectedCollection");
    return _collectionId;
}

Template.withSelectedItems.isShortSpan = function() {
    var _collectionId = Session.get("selectedCollection");
    return _collectionId ? "span3" : "span4";
}

Template.myCollectionsFlashcards.item = function () {
    var _collectionId = Session.get("selectedCollection"),
        _items;
    console.log("_collectionId ", _collectionId);
//    console.log("itemsHandle ", itemsHandle.limit)
    if (_collectionId) {
        _items = Items.find({collection: _collectionId}, {limit: itemsHandle.limit()});
        console.log("we are inside, so colelctionID", itemsHandle.limit());
        return _items;
    }
    else {
        _items = Items.find({}, {limit: itemsHandle.limit()});
        return _items;
    }
    return [];
}

Template.myCollectionsFlashcards.itemsReady = function () {
    return !itemsHandle.loading();
}

Template.myCollectionsFlashcards.allItemsLoaded = function () {
//    return false;
//    var _collectionId = Session.get("selectedCollection");
//    console.log("itemsHandleLoading ", itemsHandle.loading());
//    console.log("itemsHandleLoaded", itemsHandle.loaded());
    return !itemsHandle.loading() && Items.find().count() < itemsHandle.loaded();
//    return !itemsHandle.loading() && Items.find({collection: _collectionId}).count() < itemsHandle.loaded();
}

Template.myCollectionsFlashcards.events({
    "click .btn-examModeModal": function(e) {
        e.preventDefault();
        $("#examModeModal").modal("show");
    },
    'click .load-more': function (e) {
        e.preventDefault();
        itemsHandle.loadNextPage();
    }
});


Template.myCollectionsFlashcards.collectionName = function () {
    var _collectionId = Session.get("selectedCollection");
    if (_collectionId) {
        return Meteor.collections.returnName(_collectionId);
    }
    return "";
}

Template.withSelectedItems.flashcardsSelectedLength = function () {
    var _flashcardsSelected = Session.get("selectedFlashcards");
    if (_flashcardsSelected) {
        return _flashcardsSelected.length;
    }
    return 0;
}

Template.myCollectionsFlashcards.destroyed = function () {
    Session.set("selectedFlashcards", []);
    Session.set("selectedCollection", "");
    itemsHandle.stop();
}

Template.withSelectedItems.events({
    "keyup #availableItemsSearch": function (e, template) {
//        console.log("e", $("#availableItemsSearch").val());
//        var _opts = {
//            collectionId: Session.get("selectedCollection")
//        };
        _opts.search = $("#availableItemsSearch").val();
//        Session.set("optsSearch", _opts.search);
        itemsHandle.stop();
        itemsHandle = Meteor.subscribeWithPagination('paginatedItems', _opts, 10);
    },
    "click .btn-selectAll": function () {
        var _selectedFlashcards = [];
        $(".myFlashcardRow").each(function () {
            _selectedFlashcards.push($(this).data("id"))
        });
        Session.set("selectedFlashcards", _selectedFlashcards);
        _toggleFlashcardReload();
    },
    "click .btn-deSelectAll": function () {
        Session.set("selectedFlashcards", []);

        _toggleFlashcardReload();
    },
    "click .btn-extraRepeatItems": function (e) {
        var _callOpts = {
            function: "extraRepeatItems",
            arguments: {
                items: Session.get("selectedFlashcards")
            },
            errorTitle: "Setting extra repetitions error",
            successTitle: "Extra repetition sessions applied"
        }

        Meteor.myCall(_callOpts);

    },
    "click .btn-deactivateItems": function (e) {
        var _callOpts = {
            function: "deactivateItems",
            arguments: {
                items: Session.get("selectedFlashcards")
            },
            errorTitle: "Error while deactivating flashcards",
            successTitle: "Flashcards successfully deactivated"
        }
        Meteor.myCall(_callOpts);
        Session.set("selectedFlashcards", []);
    },
    "click .btn-activateItems": function (e) {
        var _callOpts = {
            function: "activateItems",
            arguments: {
                items: Session.get("selectedFlashcards")
            },
            errorTitle: "Error while activating flashcards",
            successTitle: "Flashcards successfully activated"
        }
        Meteor.myCall(_callOpts);
        Session.set("selectedFlashcards", []);
    },
    "click .btn-changeCollection": function (e) {
        $("#changeItemsCollectionModal").modal("show").on('hidden', function () {
            var _newCollectionId = $("#newCollectionId").val();
            if (_newCollectionId !== Session.get("selectedCollection")) {
                var _callOpts = {
                    function: "changeItemsCollection",
                    arguments: {
                        items: Session.get("selectedFlashcards"),
                        newCollectionId: _newCollectionId
                    },
                    errorTitle: "Changing collection error",
                    successTitle: "Collection changed"
                }
            }
            Meteor.myCall(_callOpts);
            Session.set("selectedFlashcards", []);
        });
    },
    "click .btn-addToCourse ": function (e) {
        e.preventDefault();
//        var _opts2 = {
//            collectionId: Session.get("selectedCollection"),
//            front: "asdfasdf"
//        };
//        itemsHandle = Meteor.subscribeWithPagination('paginatedItems', _opts2, 10);
    },
    "click .search-pane": function(e) {
        $("#availableItemsSearch").focus();
    }
})

Template.withSelectedItems.deactivatedCollection = function () {
    var _deactivatedCollectionId = Meteor.collections.returnId("Deactivated");
    return Session.get("selectedCollection") && _deactivatedCollectionId === Session.get("selectedCollection")
}

Template.collectionSelector.collection = function () {
    return Meteor.user() ? Meteor.user().collections : [];
}

Template.collectionSelector.selectIfCurrent = function () {
    var _currentCollectionId = Session.get("selectedCollection");
    if (_currentCollectionId) {
        return this._id === _currentCollectionId ? "selected" : "";
    } else {
        return "";
    }
};

_toggleFlashcardReload = function () {
    if (Session.get("reloadFlashcards")) {
        Session.set("reloadFlashcards", false);
    }
    else {
        Session.set("reloadFlashcards", true);
    }
}