Template.availableCourses.course = function() {
    return Courses.find({admins: {$ne: Meteor.userId()}}, {sort: {score: -1}});
};


Template.availableCourses.events({
    "click .courseRow": function(e) {
        Meteor.Router.to('/course/' + this._id);
    }
});
