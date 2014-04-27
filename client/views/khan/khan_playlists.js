var khanPlaylistsHandle;

var _opts = {};

Template.khanPlaylists.created = function () {
    khanPlaylistsHandle = Meteor.subscribeWithPagination('paginatedKhanPlaylists', _opts, 10);
}

Template.khanPlaylists.khanPlaylist = function () {
    var _playlists, _query = {};
    if (Session.get("optsSearch")) {
        var _opts = Session.get("optsSearch");
        _query.$or = [
            {title: new RegExp(_opts, "i")},
            {description: new RegExp(_opts, "i")},
            {"videos.title": new RegExp(_opts, "i")}
        ];

    }
    console.log("_query", _query);
    _playlists = KhanPlaylists.find(_query, {limit: khanPlaylistsHandle.limit()});
    return _playlists;

}


Template.khanPlaylists.khanPlaylistsReady = function () {
    if (Session.get("optsSearch")) {
        var _opts = true;
    }
    return !khanPlaylistsHandle.loading();
}

Template.khanPlaylists.allKhanPlaylistsLoaded = function () {
    if (Session.get("optsSearch")) {
        var _opts = true;
    }

    return !khanPlaylistsHandle.loading() && KhanPlaylists.find().count() < khanPlaylistsHandle.loaded();
}

var _searchTimeout = null;
Template.khanPlaylists.events({
    'click .load-more': function (e) {
        e.preventDefault();
        khanPlaylistsHandle.loadNextPage();
    },
    "keyup #khanPlaylistsSearch": function (e) {
        window.clearTimeout(_searchTimeout);
        _searchTimeout = window.setTimeout(function () {
            _opts.search = $("#khanPlaylistsSearch").val();
            console.log("how many times are we here?", _opts.search);
            Session.set("optsSearch", _opts.search);
            khanPlaylistsHandle.stop();
            khanPlaylistsHandle = Meteor.subscribeWithPagination("paginatedKhanPlaylists", _opts, 10);
        }, 500);
    },
    "click .search-pane": function (e) {
        $("#khanPlaylistsSearch").focus();
    }
})


Template.khanVideoRow.events({
    'click .khanVideo': function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var _playlistSlug = $(e.target).closest(".khanVideosListing").attr("data-id");
        var _videoSlug = $(e.target).attr("data-id");
        if (!_playlistSlug) {
            _playlistSlug = Session.get("playlistSlug");
        }

//        console.log("this", e.target.attr);
        Router.go('/khanVideo/' + _playlistSlug + "/" + this.readable_id + "/" + this.youtube_id);

    }
//    'click .khanPlaylistRow': function(e) {
//        console.log("clicked", this.slug);
//        e.preventDefault();
//        $(".khanVideos[data-id=" + this.slug + "]").show();
//    },

});

Template.khanPlaylistRow.rendered = function () {
    var _searchTerm = Session.get("optsSearch");
    if (_searchTerm && _searchTerm !== "") {
        searchAndHighlight(_searchTerm, ".khanTitle[data-id=\"" + this.data.slug + "\"]", false);
        searchAndHighlight(_searchTerm, ".khanDescription[data-id=\"" + this.data.slug + "\"]", false);
        searchAndHighlight(_searchTerm, ".khanVideosListing[data-id=\"" + this.data.slug + "\"] li .khanTitle", true);
    }
}

function searchAndHighlight(searchTerm, selector, isList) {
    if (searchTerm) {
        console.log("selector", selector);
        //var wholeWordOnly = new RegExp("\\g"+searchTerm+"\\g","ig"); //matches whole word only
//        var searchTermRegEx = new RegExp("\\g["+searchTerm+"]\\g","ig"); //matches any word with any of search chars characters
        var selector = selector || "body";                             //use body as selector if none provided
        var searchTermRegEx = new RegExp(searchTerm, "ig");
        if (isList) {
            $(selector).each(function(number, b) {
                $(b).html($(b).html().replace(searchTermRegEx, "<span class='highlighted'>" + searchTerm + "</span>"));
            })
        }
        else {
            var matches = $(selector).text().match(searchTermRegEx);

            if (matches) {
//            $('.highlighted').removeClass('highlighted');     //Remove old search highlights
                $(selector).html($(selector).html()
                    .replace(searchTermRegEx, "<span class='highlighted'>" + searchTerm + "</span>"));
                return true;
            }
        }
    }
    return false;
}

Template.khanVideoRow.currentKhanVideo = function() {
    var _youtube_id = Session.get("youtube_id");
    return _youtube_id === this.youtube_id;
}