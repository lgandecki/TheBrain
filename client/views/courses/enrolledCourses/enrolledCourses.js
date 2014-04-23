Template.enrolledCourses.course = function () {
    if (Meteor.user()) {
        var _enrolledCourses = Meteor.user().courses || [];
        console.log("enrolledCourses", _enrolledCourses);
        return Courses.find({_id: {$in: _enrolledCourses}, admins: {$ne: Meteor.userId()}}, {sort: {score: -1}});
    }
    else {
        return [];
    }
};

Template.enrolledCourses.amINotEnrolledInAnyCourses = function() {
    return Meteor.user() && Meteor.user().courses && Meteor.user().courses.length === 0;
}

Template.enrolledCourses.events({
    "click .courseRow": function (e) {
        Router.go('/course/' + this._id);
    }
});
