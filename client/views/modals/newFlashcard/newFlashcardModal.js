/**
 * Created with JetBrains WebStorm.
 * User: lukaszgandecki
 * Date: 7/9/13
 * Time: 10:04 PM
 * To change this template use File | Settings | File Templates.
 */

Template.newFlashcardModal.selectedCourseName = function() {
    _selectedCourse = Courses.findOne(Session.get("selectedCourse"));
    return _selectedCourse ? _selectedCourse.name : "";
}

Template.newFlashcardModal.selectedLessonName = function() {
    _selectedLesson = Lessons.findOne(Session.get("selectedLesson"));
    return _selectedLesson ? _selectedLesson.name : "";
}
