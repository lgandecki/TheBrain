Template.newLessonModal.courseName = function() {
    return Courses.findOne(Session.get("selectedCourse")).name || "";
}