Template.enrolledCourses.course = function() {
	_enrolledCourses = Meteor.user().courses;
	console.log("enrolledCourses", _enrolledCourses);
    return Courses.find({_id: {$in: _enrolledCourses}, admins: {$ne: Meteor.userId()}}, {sort: {score: -1}});
};


Template.enrolledCourses.events({
    "click .courseRow": function(e) {
        Meteor.Router.to('/course/' + this._id);
    }
});
