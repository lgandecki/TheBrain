Template.newLessonModal.courseName = function() {
    return Session.get("selectedCourse");
//    var _course = Courses.findOne(Session.get("selectedCourse"))
//    return _course ? _course.name : "";
}