Meteor.publishComposite("lessonFlashcards", function (opts, limit) {
    var _children = [];
    return {
        find: function () {
            return Courses.find({
                _id: opts.courseId
            }, {
                fields: {
                    '_id': 1,
                    'lessons': 1
                }
            });
        },
        children: [
            {
                find: function (course) {
                    var _lessonIndex = _.indexOf(_.pluck(course.lessons, '_id'), opts.lessonId);
                    var _lesson = course.lessons[_lessonIndex];
                    var _teacherFlashcards = _lesson.teacherFlashcards;
                    var _studentsFlashcards = [];
                    if (!opts.onlyAdmin) {
                        _studentsFlashcards = _lesson.studentsFlashcards;
                        console.log("not only admin");
                    }
                    var _flashcardIds = _teacherFlashcards.concat(_studentsFlashcards);
                    console.log("publikuje takie id", _flashcardIds);
                    return Flashcards.find({
                            _id: {$in: _flashcardIds},
                            public: true,
                            "lessons.lesson": opts.lessonId
                        },
                        {
                            limit: limit,
                            sort: {score: -1}
                        });
                },
                    children: [
                        {
                            find: function (flashcard, course) {
                                return Meteor.users.find(
                                    {_id: flashcard.user},
                                    {
                                        fields: {
                                            'identity': 1,
                                            'profile': 1
                                        }
                                    }
                                )
                            }
                        }
                    ]
            }
        ]
    }
});