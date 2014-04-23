Template.courseStatsTab.created = function() {
    var _opts = {
        courseId: Session.get("selectedCourse")
    }
    Meteor.subscribe("courseStats", _opts);
}

Template.courseStats.flashcard = function() {
    var _selectedCourseId = Session.get("selectedCourse");
    var _selectedCourse = Courses.findOne({_id: _selectedCourseId});
    if (!_selectedCourse) {
        return;
    }

    var _studentsFlashcards = _.flatten(_.pluck(_selectedCourse.lessons, 'studentsFlashcards'));
    var _teacherFlashcards = _.flatten(_.pluck(_selectedCourse.lessons, 'teacherFlashcards'));
    var _flashcardsIds = _.union(_studentsFlashcards, _teacherFlashcards);
    return Flashcards.find({_id: {$in: _flashcardsIds}});
}
