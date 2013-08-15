//Meteor.publish("myFlashcards", function() {
//	return Flashcards.find({
//		user: this.userId
//	});
//});

Meteor.publish("currentFlashcard", function (id) {
    return id && Flashcards.find({
        _id: id
    })
});

Meteor.publish("paginatedFlashcards", function (opts, limit) {
    var _query = {public: true};
    if (opts.search) {
//        _query = {$or}
        _query.$or = [
            {front: new RegExp(opts.search)},
            {back: new RegExp(opts.search)}
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

Meteor.publish("lessonFlashcards", function (opts) {
    // console.log("Are we doing this I mean lessonflashcards?", lessonId);
    _query = {
        public: true,
        "lessons.lesson": opts.lessonId
    };
//    if (opts.onlyAdmin) {
//        _query.user = {
//            $in: opts.adminIds
//        };
//    }
    console.log("opts", opts);
    console.log("query ", _query);
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
            }
        ]
    })
//    return Flashcards.find(_query);
})