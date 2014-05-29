Template.availableCourses.course = function() {
    return Courses.find({admins: {$ne: Meteor.userId()}, featured: {$ne: true}}, {sort: {score: -1}});
};


Template.availableCourses.events({
    "click .courseRow :not(.featuredCourse)": function(e) {

        Router.go('/course/' + this._id);
    }
});


Template.availableCourses.showFeatured = function() {
    return Meteor.userId() === "5rufb3jGQHgouZWAy" || Meteor.userId() === "pdidkBRmhPbhDuNhJ" || Meteor.userId() === "L2vK3r4MdZJaKB4N2";
}

Template.availableCourses.featuredCourse = function() {
    return Courses.find({featured: true}, {sort: {score: -1}});
}
