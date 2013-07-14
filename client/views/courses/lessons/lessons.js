Template.lessonsTable.lesson = function () {
    _course = Courses.findOne({_id: Session.get("selectedCourse")});
    return _course ? _course.lessons : [];
}


Template.lessonsTable.rendered = function () {

    $.fn.editable.defaults.mode = 'inline';

    $('.lesson-name.editable:not(.editable-click)').editable('destroy').editable({
        success: function (response, newName) {
            lessonAttributes = {
                courseId: Session.get("selectedCourse"),
                lessonId: $(this).attr("data-id"),
                name: newName
            }
            Meteor.call("updateLessonName", lessonAttributes, function (error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", error.reason);
                }
                else {
                    Meteor.popUp.success("Lesson name updated", "TheBrain made the neural connections changes you asked for.");
                }
            });
            //Lessons.update($(this).attr("data-id"), {$set: {name: newName}});
        }});

    $('.lesson-description.editable:not(.editable-click)').editable('destroy').editable({
        success: function (response, newDescription) {
            lessonAttributes = {
                courseId: Session.get("selectedCourse"),
                lessonId: $(this).attr("data-id"),
                description: newDescription
            }
            Meteor.call("updateLessonDescription", lessonAttributes, function (error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", error.reason);
                }
                else {
                    Meteor.popUp.success("Lesson description updated", "TheBrain made the neural connections changes you asked for.");
                }
            });
            //Lessons.update($(this).attr("data-id"), {$set: {shortDescription: newDescription}});
        }});

}


Template.lessonsTable.events({
    "click .lessonRow .editable": function(e) {
        console.log("click ", e);
        e.preventDefault();
        e.stopPropagation();
    },
    "click .lessonRow .btn": function(e) {
        e.stopPropagation();
    },
    "click .lessonRow:not(.editable), click .btn-enterLesson": function(e) {
        console.log("this " + this._id);
        Meteor.Router.to('/lesson/' + this._id);
    },
    "click .btn-addLessonModal": function (e, template) {
        e.preventDefault();
        $('#newLessonModal').modal('show');
    },
    "click .btn-addFlashcardToLesson": function (e, template) {
        e.preventDefault();
        console.log("this._id", this._id);
        $("#newFlashcardModal").modal('show');
        Session.set("selectedLesson", this._id);

    }
});