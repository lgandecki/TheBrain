var itemsHandle;
var _opts = {};
Template.myCollectionsFlashcards.created = function () {
    _opts = {
        collectionId: Session.get("selectedCollection")
    };

    itemsHandle = Meteor.subscribeWithPagination('paginatedItems', _opts, 10);
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
    'click .load-more': function (e) {
        e.preventDefault();
        itemsHandle.loadNextPage();
    }
});


Template.myCollectionsFlashcards.collectionName = function () {
    var _collectionId = Session.get("selectedCollection");
    var _user = Meteor.user();

    if (_user) {
        var _collectionIndex = _.indexOf(_.pluck(_user.collections, '_id'), _collectionId);

        if (_collectionIndex > -1 && _user.collections && _user.collections[_collectionIndex]) {
            return _user.collections[_collectionIndex].name;
        }
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
    "click .btn-changeCollection": function (e) {
        $("#changeItemsCollectionModal").modal("show").on('hidden', function () {
            var _newCollectionId = $("#newCollectionId").val()
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
    }
})


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