//Meteor.publish("myFlashcards", function() {
//	return Flashcards.find({
//		user: this.userId
//	});
//});

Meteor.publish("currentFlashcard", function (id) {

    var _query = {
        _id: id,
    };
//    if (opts.onlyAdmin) {
//        _query.user = {
//            $in: opts.adminIds
//        };
//    }
    return Meteor.publishWithRelations({
        handle: this,
        collection: Flashcards,
        filter: _query,
//        options: {
//            limit: limit,
//        },
        mappings: [
            {
                key: 'user',
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            },
            {
                key: 'updatedBy',
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            },
            {
                key: "updatedBy",
                nestedArray: "previousVersions",
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            },
        ]
    })

});

Meteor.publish("paginatedFlashcards", function (opts, limit) {
    var _query = {public: true};
    if (opts.search) {
//        _query = {$or}
        _query.$or = [
            {front: new RegExp(opts.search, "i")},
            {back: new RegExp(opts.search, "i")}
        ]
    }
    console.log("_query", _query);
    console.log("limit", limit);
    return Meteor.publishWithRelations({
        handle: this,
        collection: Flashcards,
        filter: _query,
        options: {
            limit: limit,
            fields: {
                'back': 1,
                'backPicture': 1,
                'comments': 1,
                'downVotes': 1,
                'upVotes': 1,
                'front': 1,
                'frontPicture': 1,
                'user': 1,
                'khanAcademy': 1,
                'youtube_id': 1
            },
            sort: { '_id' : 1}
        },
        mappings: [
            {
                key: 'user',
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            }
        ]
    })

//    return Flashcards.find(_query, {limit: limit});
})


Meteor.publish("youtubeFlashcards", function(opts, limit) {

    var _query = {
        public: true,
        "youtube_id": opts.youtube_id
    }

    console.log("youtube query", _query);

    return Meteor.publishWithRelations({
        handle: this,
        collection: Flashcards,
        filter: _query,
        options: {
            limit: limit,
            sort: {score: -1}
        },
        mappings: [
            {
                key: 'user',
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            }
        ]
    })
})
