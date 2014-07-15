var flashcardsHandle;

var _opts = {};
Template.availableFlashcards.created = function () {
    flashcardsHandle = Meteor.subscribeWithPagination('paginatedFlashcards', _opts, 10);
};

Template.availableFlashcards.flashcard = function () {
    var _flashcards;
    var _query = {};
    if (Session.get("optsSearch")) {
        var _opts = Session.get("optsSearch");
        _query.$or = [
            {front: new RegExp(_opts, "i")},
            {back: new RegExp(_opts, "i")}
        ]
    }
    _flashcards = Flashcards.find(_query, {limit: flashcardsHandle.limit()});
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
    Session.set("optsSearch", []);
}

Template.withSelectedFlashcards.events({
    'click .btn-addToCollection': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#addToCollectionFlashcardModal").modal("show");
    },
    'click .btn-addToCourse': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#addToCourseFlashcardModal").modal("show");
    },
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

    "click .search-pane": function(e) {
        $("#availableFlashcardsSearch").focus();
    }

//    "click .btn-addToCourse ": function (e) {
//        e.preventDefault();
//        var _opts2 = {
//            collectionId: Session.get("selectedCollection"),
//            front: "asdfasdf"
//        };
//        itemsHandle = Meteor.subscribeWithPagination('paginatedItems', _opts2, 10);
//    }
})