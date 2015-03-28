var _returnVideo = function (videoSlug) {
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});
    var _videoIndex = _returnVideoIndex(videoSlug);
    console.log("_videoIndex", _videoIndex);
    if (_videoIndex > -1) {
        return _playlist.children[_videoIndex];
    }
}

var _returnVideoIndex = function (videoSlug) {
    var _playlistSlug = Session.get("playlistSlug");
    var _playlist = KhanPlaylists.findOne({slug: _playlistSlug});
    console.log("_videoSlug", _playlist);
    if (_playlist) {
        var _videoIndex = _.indexOf(_.pluck(_playlist.children, 'readable_id'), videoSlug);
        return _videoIndex;
    }
}


if (!Meteor.khan) Meteor.khan = {};
_.extend(Meteor.khan, {
    returnVideo: _returnVideo,
    returnVideoIndex: _returnVideoIndex
});