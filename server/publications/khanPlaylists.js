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
        if (TheBrain.findOne({_id: "khanPlaylistsUpdated"})) {

        } else {
            TheBrain.insert({_id: "khanPlaylistsUpdated", date: moment()._d});
            _updateFlag = true;
        }
    }

    //_updateFlag = true;

    if (_updateFlag) {
        //var _url = "http://www.khanacademy.org/api/v1/playlists";
        var _url = "http://www.khanacademy.org/api/v1/topictree";
        console.log("before get");
        Meteor.http.get(_url, function(error, results) {
            console.log("in update");
            //results.content.replace('"', '\"');
            var _khanPlaylists = JSON.parse(results.content);
            //var _khanPlaylists = [];
            console.log("_khanPlaylists", _khanPlaylists.children.length);
//            KhanPlaylists.insert(_khanPlaylists);
//            KhanPlaylists.insert({_id: "test", "abc": "test"});
            KhanPlaylists.remove({});

            //KhanPlaylists.insert(_khanPlaylists.children[2]);

                    _khanPlaylists && _khanPlaylists.children.forEach(function (playlist) {
                        playlist.children && playlist.children.forEach(function(children) {
                            KhanPlaylists.insert(children);
                        });
                        //console.log("playlist \n\n", playlist);
                        //KhanPlaylists.insert(playlist);
                    });



            TheBrain.update({_id: "khanPlaylistsUpdated"}, {$set: {date: moment()._d}})
        })
    }

    //var _query = {"videos.0": {$exists: true}};
    var _query = {};
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