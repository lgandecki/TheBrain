Template.lessonsTable.lesson = function () {
    return Lessons.find({courseId: Session.get("selectedCourse")});
}


Template.lessonsTable.rendered = function () {

    $.fn.editable.defaults.mode = 'inline';

    $('.lesson-name.editable:not(.editable-click)').editable('destroy').editable({
        success: function (response, newName) {
            Lessons.update($(this).attr("data-id"), {$set: {name: newName}});
        }});

    $('.lesson-description.editable:not(.editable-click)').editable('destroy').editable({
        success: function (response, newDescription) {
            Lessons.update($(this).attr("data-id"), {$set: {shortDescription: newDescription}});
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
    "click .lessonRow:not(.editable)": function(e) {
        console.log("this " + this._id);
        Meteor.Router.to('/lesson/' + this._id);
    },
    "click .btn-addLessonModal": function (e, template) {
        e.preventDefault();
        $('#newLessonModal').modal('show');
    }
});