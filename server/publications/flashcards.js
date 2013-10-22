//Meteor.publish("myFlashcards", function() {
//	return Flashcards.find({
//		user: this.userId
//	});
//});

Meteor.publish("currentFlashcard", function (id) {

    _query = {
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

    return id && Flashcards.find({
        _id: id
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
                'user': 1
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

Meteor.publish("lessonFlashcards", function (opts, limit) {
    console.log("Are we doing this I mean lessonflashcards?", opts);
    var _course = Courses.findOne({_id: opts.courseId});
    if (_course) {
    var _flashcardIds = [];
    var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), opts.lessonId);
    var _lesson = _course.lessons[_lessonIndex];
    var _teacherFlashcards = _lesson.teacherFlashcards;
    var _studentsFlashcards = [];
    if (!opts.onlyAdmin) {
        _studentsFlashcards = _lesson.studentsFlashcards;
        console.log("not only admin", _studentsFlashcards);

    }
    _flashcardIds = _teacherFlashcards.concat(_studentsFlashcards);
    _query = {
        _id: {$in: _flashcardIds},
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
    }
//    return Flashcards.find(_query);
})

Meteor.publish("youtubeFlashcards", function(opts, limit) {

    _query = {
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
