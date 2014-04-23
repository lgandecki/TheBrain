Meteor.publish("paginatedKhanPlaylists", function (opts, limit) {

    var _khanPlaylistsUpdated = TheBrain.findOne({_id: "khanPlaylistsUpdated"});
    var _updateFlag = false;
    if (_khanPlaylistsUpdated) {
        console.log("_khanPlay", _khanPlaylistsUpdated);
        console.log("before second if");
        if (_khanPlaylistsUpdated.date && _khanPlaylistsUpdated.date.valueOf() <= moment().subtract('days', 1).valueOf()) {
            _updateFlag = true;
            console.log("update");
        }
    }
    else {
        console.log("first time");
        TheBrain.insert({_id: "khanPlaylistsUpdated", date: moment()._d});
        _updateFlag = true;
    }

    if (_updateFlag) {
        //var _url = "http://www.khanacademy.org/api/v1/playlists";
        var _url = "http://www.khanacademy.org/api/v1/playlists/library/list"
        Meteor.http.get(_url, function(error, results) {
            console.log("in update");
            var _khanPlaylists = JSON.parse(results.content);
            console.log("_khanPlaylists", _khanPlaylists.length);
//            KhanPlaylists.insert(_khanPlaylists);
//            KhanPlaylists.insert({_id: "test", "abc": "test"});
            KhanPlaylists.remove({});
            _khanPlaylists.forEach(function(playlist) {
                KhanPlaylists.insert(playlist);
            })
            TheBrain.update({_id: "khanPlaylistsUpdated"}, {$set: {date: moment()._d}})
        })
    }

    var _query = {"videos.0": {$exists: true}};
    if (opts.search) {
        _query.$or = [
            {title: new RegExp(opts.search, "i")},
            {description: new RegExp(opts.search, "i")},
            {"videos.title": new RegExp(opts.search, "i")}
        ];
    }
    console.log(_query);
    console.log("limit", limit);
    return KhanPlaylists.find(_query, {limit: limit});
});


Meteor.publish("khanPlaylist", function(slug) {
    console.log("slug", slug);
    if(slug) {
        return KhanPlaylists.find({slug: slug});
    } else {
        return KhanPlaylists.find({}, {fields: {_id: 1}, limit: 1});
    }
})