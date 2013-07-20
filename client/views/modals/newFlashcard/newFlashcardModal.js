/**
 * Created with JetBrains WebStorm.
 * User: lukaszgandecki
 * Date: 7/9/13
 * Time: 10:04 PM
 * To change this template use File | Settings | File Templates.
 */

Template.newFlashcardModal.selectedCourseName = function() {
	_selectedCourseSession = Session.get("selectedCourse");
    var _selectedCourse = Courses.findOne({_id: _selectedCourseSession});
    return _selectedCourse ? _selectedCourse.name : "";
}

Template.newFlashcardModal.selectedLessonName = function() {
    var _selectedCourse = Courses.findOne({_id: Session.get("selectedCourse")});
    var _selectedLesson = Session.get("selectedLesson");
    console.log("_selectedLesson", _selectedLesson);
    console.log("_selectedCourse", _selectedCourse);
    if (_selectedCourse && _selectedLesson) {
	    var _lessonIndex = _.indexOf(_.pluck(_selectedCourse.lessons, '_id'), _selectedLesson);
	   	console.log("_lessonIndex", _lessonIndex);
	   	_lesson = _selectedCourse.lessons[_lessonIndex];
	   	console.log("_lesson", _lesson);
	    return _lesson ? _lesson.name : "";
    }
	return "";
}

Template.newFlashcardModal.rendered = function() {
	$(".select2").select2();
}
