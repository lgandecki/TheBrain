Template.newFlashcardModal.newFlashcardModalTitle = function() {
    var _currentRoute = window.location.pathname;
    _currentRoute = "/" + _currentRoute.split("/")[1];
    if (_currentRoute === "/lesson" || _currentRoute === "/course") {
        var _selectedCourseSession = Session.get("selectedCourse");
        var _selectedCourse = Courses.findOne({_id: _selectedCourseSession});
        var _courseName = _selectedCourse ? _selectedCourse.name : "";
        var _selectedLesson = Session.get("selectedLesson");
        var _lesson;
        if (_selectedCourse && _selectedLesson) {
            var _lessonIndex = _.indexOf(_.pluck(_selectedCourse.lessons, '_id'), _selectedLesson);
            _lesson = _selectedCourse.lessons[_lessonIndex];
        }
        var _lessonName = _lesson ? _lesson.name : "";
        return "New Flashcard for " + _courseName + ", lesson: " + _lessonName;

    }
    return "New Flashcard";
}
Template.newFlashcardModal.selectedCourseName = function() {
	_selectedCourseSession = Session.get("selectedCourse");
    var _selectedCourse = Courses.findOne({_id: _selectedCourseSession});
    return _selectedCourse ? _selectedCourse.name : "";
}

Template.newFlashcardModal.selectedLessonName = function() {
    var _selectedCourse = Courses.findOne({_id: Session.get("selectedCourse")});
    var _selectedLesson = Session.get("selectedLesson");
    if (_selectedCourse && _selectedLesson) {
	    var _lessonIndex = _.indexOf(_.pluck(_selectedCourse.lessons, '_id'), _selectedLesson);
	   	_lesson = _selectedCourse.lessons[_lessonIndex];
	    return _lesson ? _lesson.name : "";
    }
	return "";
}


Template.newFlashcardModal.rendered = function() {
	$(".select2").select2();
}
