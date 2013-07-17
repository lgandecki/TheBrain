var _course, _lesson;

Template.lesson.created = function() {
	// _course = Courses.findOne({_id: Session.get("selectedCourse")});
	// console.log("_course", _course);
	// console.log("selectedCourse ", Session.get("selectedCourse"));
	// if (_course) {
	// var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
	// _lesson = _course.lessons[_lessonIndex];

	// console.log("_lesson ", _lesson);
	// }
}

Template.lesson.rendered = function() {
		_course = Courses.findOne({_id: Session.get("selectedCourse")});
	console.log("_course", _course);
	console.log("selectedCourse ", Session.get("selectedCourse"));
	if (_course) {
	var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
	_lesson = _course.lessons[_lessonIndex];

	console.log("_lesson ", _lesson);
	}
}
Template.lesson.courseName = function () {
	return _course ? _course.name : "";
}

Template.lesson.lessonName = function () {
	return _lesson ? _lesson.name : "";
}

Template.lessonFlashcardsList.flashcard = function () {
	console.log("is my course loaded ? " + Session.get("selectedCourse"));
	_courseId = Session.get("selectedCourse");
	_lessonId = Session.get("selectedLesson");
	_course = Courses.findOne({_id: _courseId});
	if (_course) {
	var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), _lessonId);
	_lesson = _course.lessons[_lessonIndex];
	return Flashcards.find({_id: {$in: _lesson.flashcards}});
	}	
	return [];
}
