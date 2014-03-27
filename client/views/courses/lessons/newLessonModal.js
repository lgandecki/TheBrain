Template.newLessonModal.courseName = function() {
    // return Session.get("selectedCourse");
   var _course = Courses.find({_id: Session.get("selectedCourse")}, {fields: {name: 1}, reactive: false}).fetch();
   return _course ? _course.name : "";
}