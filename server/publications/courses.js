Meteor.publish("publicCourses", function() {
    return Courses.find({public: 1}, {fields: {'_id': 1, 'name': 1, 'upVotes': 1, 'downVotes': 1, 'lessons': 1 }});
});


Meteor.publish("myCourses", function() {
    return Courses.find({admins: this.userId}, {fields: {'_id': 1, 'name': 1, 'admins': 1, 'upVotes': 1, 'downVotes': 1, 'lessons': 1, 'comments._id': 1}});
});


Meteor.publish("selectedCourse", function(id) {
   console.log("Selected Course publish? " + id);
   return Courses.find({_id: id},{fields: {'_id': 1, 'name': 1, 'admins': 1, 'upVotes': 1, 'downVotes': 1, 'lessons': 1, 'events': 1, 'comments': 1}} );
});