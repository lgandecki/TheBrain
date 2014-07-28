var _renderer;
Template.myCourses.course = function() {
    return Courses.find({admins: Meteor.userId()}, {sort: {score: -1}});
};

Template.myCourses.lessonsLength = function() {

}

Template.myCourses.events({
    "click .courseRow": function(e) {
        Router.go('/course/' + this._id);
    },
    "click .btn-addCourseModal": function (e, template) {
        e.preventDefault();
        Meteor.theBrain.modals.newCourse();
    }
});
