Meteor.publish("publicCourses", function() {
    return Courses.find({public: true}, {sort: {score: -1}}, {fields: {'_id': 1, 'name': 1, 'upVotes': 1, 'downVotes': 1, 'lessons': 1, 'score': 1, 'comments._id': 1 }});
});


Meteor.publish("myCourses", function() {
    return Courses.find({admins: this.userId}, {sort: {score: -1}}, {fields: {'_id': 1, 'name': 1, 'admins': 1, 'upVotes': 1, 'downVotes': 1, 'lessons': 1, 'comments._id': 1, 'score': 1}});
});


Meteor.publish("selectedCourse", function(id) {
   return Courses.find({_id: id},{fields: {'_id': 1, 'name': 1, 'admins': 1, 'upVotes': 1, 'downVotes': 1, 'lessons': 1, 'events': 1, 'comments': 1, 'score': 1}} );
});