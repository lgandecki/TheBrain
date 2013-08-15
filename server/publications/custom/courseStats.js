Meteor.publish("courseStats", function (opts, limit) {
//    var _query = {public: true};

    var _selectedCourse = Courses.findOne({_id: opts.courseId});
    if (!_selectedCourse) {
        return;
    }

    var _flashcardsIds = _.flatten(_.pluck(_selectedCourse.lessons, 'flashcards'))
//    var _studentIds = _selectedCourse.students;
//    var _adminsIds = _selectedCourse.admins;
    var _usersIds = _.union(_selectedCourse.students, _selectedCourse.admins);

//    $.merge(_usersIds, _selectedCourse.admins);
    var _query = {flashcard: {$in: _flashcardsIds}, user: {$in: _usersIds}};
                                 console.log("courseStats _query", _query);
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
        collection: Items,
        filter: _query,
        options: {
//            limit: limit,
        },
        mappings: [
            {
                key: 'flashcard',
                collection: Flashcards
            },
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
});