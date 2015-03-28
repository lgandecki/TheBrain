Template.khanVideo.created = function () {
//    var _playlistSlug = Session.get("playlistSlug");
//    Meteor.subscribe("khanPlaylist", _playlistSlug);
}

Template.khanVideo.youtubeVideoFlashcardsCount = function() {
    var _youtube_id = Session.get("youtube_id");
    Meteor.subscribe("youtubeVideoFlashcardsCount", _youtube_id);
    var _count =  YoutubeVideoFlashcardsCount.findOne({_id: _youtube_id});
    console.log("_count", _count);
    return _count && _count.count;
}
Template.khanVideo.playlistTitle = function () {
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});
    console.log("_playlist", _playlist);
    return _playlist && _playlist.title;
}

Template.khanVideo.videos = function() {
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});
    return _playlist && _playlist.children;
}
Template.khanVideo.videoTitle = function () {
    var _videoSlug = Session.get("videoSlug");
    var _video = Meteor.khan.returnVideo(_videoSlug);

    return _video && _video.title;

}

Template.khanVideo.videoDescription = function () {
    var _videoSlug = Session.get("videoSlug");
    var _video = Meteor.khan.returnVideo(_videoSlug);

    return _video && _video.description;
}

Template.khanVideo.youtube_id = function () {
    var _videoSlug = Session.get("videoSlug");
    var _video = Meteor.khan.returnVideo(_videoSlug);

    return _video && _video.youtube_id;
}

Template.khanVideo.isNotFirstVideo = function () {
    var _videoSlug = Session.get("videoSlug");
    var _videoIndex = Meteor.khan.returnVideoIndex(_videoSlug);

    return _videoIndex > 0;

}

Template.khanVideo.isNotLastVideo = function () {
    var _videoSlug = Session.get("videoSlug");
    var _videoIndex = Meteor.khan.returnVideoIndex(_videoSlug);
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});

    return _playlist && _playlist.children && (_videoIndex + 1 < _playlist.children.length);
}

Template.khanVideo.previousVideo = function () {
    var _videoSlug = Session.get("videoSlug");
    var _videoIndex = Meteor.khan.returnVideoIndex(_videoSlug);
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});

    if (_playlist && _playlist.children) {
        return _playlist.children[_videoIndex - 1];
    }


}

Template.khanVideo.playlistSlug = function () {
    return Session.get("playlistSlug");
}

Template.khanVideo.nextVideo = function () {
    var _videoSlug = Session.get("videoSlug");
    var _videoIndex = Meteor.khan.returnVideoIndex(_videoSlug);
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});

    if (_playlist && _playlist.children) {
        return _playlist.children[_videoIndex + 1];
    }


}

Template.khanVideo.destroyed = function () {
    Session.set("playlistSlug", "");
    Session.set("videoSlug", "");
    Session.set("youtube_id", "");
}

Template.khanVideo.events({
    "click .previousVideo": function (e) {
        var _href = $(e.target).attr("data-id");
        Router.go(_href);
    },
    "click .nextVideo": function (e) {
        var _href = $(e.target).attr("data-id");
        Router.go(_href);
    }
})

