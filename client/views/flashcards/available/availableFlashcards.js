var flashcardsHandle;

var _opts = {};
Template.availableFlashcards.created = function () {
    flashcardsHandle = Meteor.subscribeWithPagination('paginatedFlashcards', _opts, 10);
}

Template.availableFlashcards.flashcard = function () {
    var _flashcards;
    if (Session.get("optsSearch")) {
        var _opts = true;
    }
    _flashcards = Flashcards.find({}, {limit: flashcardsHandle.limit()});
    return _flashcards;
}

Template.availableFlashcards.flashcardsReady = function () {
    if (Session.get("optsSearch")) {
        var _opts = true;
    }
    return !flashcardsHandle.loading();
}

Template.availableFlashcards.allFlashcardsLoaded = function () {
    if (Session.get("optsSearch")) {
        var _opts = true;
    }

    return !flashcardsHandle.loading() && Flashcards.find().count() < flashcardsHandle.loaded();
}

Template.availableFlashcards.events({
    'click .load-more': function (e) {
        e.preventDefault();
        flashcardsHandle.loadNextPage();
    }
});


Template.withSelectedFlashcards.flashcardsSelectedLength = function () {
    var _flashcardsSelected = Session.get("selectedFlashcards");
    if (_flashcardsSelected) {
        return _flashcardsSelected.length;
    }
    return 0;
}

Template.availableFlashcards.destroyed = function () {
    Session.set("selectedFlashcards", []);
}

Template.withSelectedFlashcards.events({
    "keyup #availableFlashcardsSearch": function (e, template) {
        console.log("e", $("#availableFlashcardsSearch").val());
        _opts.search = $("#availableFlashcardsSearch").val();
        Session.set("optsSearch", _opts.search);
        flashcardsHandle.stop();
        flashcardsHandle = Meteor.subscribeWithPagination('paginatedFlashcards', _opts, 10);
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
//    "click .btn-addToCourse ": function (e) {
//        e.preventDefault();
//        var _opts2 = {
//            collectionId: Session.get("selectedCollection"),
//            front: "asdfasdf"
//        };
//        itemsHandle = Meteor.subscribeWithPagination('paginatedItems', _opts2, 10);
//    }
})