var _youtubeFlashcardsHandle = null;

Template.youtubeFlashcardsList.created = function() {
    var _youtube_id = Session.get("youtube_id");
    var _opts = {
        youtube_id: _youtube_id
    }
//    var _videoSlug = Session.get("videoSlug");
//    var _youtube_id;
//    if (_videoSlug) {
//        var _video = Meteor.khan.returnVideo(_videoSlug);
//        if (_video) {
//            _youtube_id = _video.youtube_id;
//        }
//    }
//
//    Session.set("youtube_id", _youtube_id);
//    if (_video) {
        _youtubeFlashcardsHandle = Meteor.subscribeWithPagination("youtubeFlashcards", _opts, 10);
//    }
//    else {
//        _youtubeFlashcardsHandle = Meteor.subscribeWithPagination("youtubeFlashcards", "");
//    }
}

Template.youtubeFlashcardsList.rendered = function () {
//    var _videoSlug = Session.get("videoSlug");
//    var _youtube_id;
//    if (_videoSlug) {
//        var _video = Meteor.khan.returnVideo(_videoSlug);
//        if (_video) {
//            _youtube_id = _video.youtube_id;
//        }
//    }
//
//    Session.set("youtube_id", _youtube_id);
//    if (_video) {
//        _youtubeFlashcardsHandle = Meteor.subscribeWithPagination("youtubeFlashcards", _video.youtube_id);
//    }


}

Template.youtubeFlashcardsList.flashcard = function () {
    var _youtube_id = Session.get("youtube_id");
    return Flashcards.find({youtube_id: _youtube_id}, {limit: _youtubeFlashcardsHandle.limit(), sort: {score: -1}})
}

Template.youtubeFlashcardsList.flashcardsReady = function () {
    return !_youtubeFlashcardsHandle.loading();
}

Template.youtubeFlashcardsList.flashcardsLoaded = function () {
    var _youtube_id = Session.get("youtube_id");
    return !_youtubeFlashcardsHandle.loading() && Flashcards.find({youtube_id: _youtube_id}).count() < _youtubeFlashcardsHandle.loaded();
}

Template.youtubeFlashcardsList.events({
    'click .btn-loadMore': function(e) {
        console.log("clicked load-more");
        e.preventDefault();
        _youtubeFlashcardsHandle.loadNextPage();
    }
});

Template.youtubeFlashcardsOptions.events({
    "click .btn-addFlashcardToYoutube": function (e, template) {
        e.preventDefault();
        $("#newFlashcardModal").modal('show');
    }
})
