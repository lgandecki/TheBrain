Meteor.publish("publicCourses", function() {
	return Courses.find({
		public: true
	}, {
		sort: {
			score: -1
		}
	}, {
		fields: {
			'_id': 1,
			'name': 1,
			'upVotes': 1,
			'downVotes': 1,
			'lessons': 1,
			'score': 1,
			'comments._id': 1,
            'featured': 1
		}
	});
});


Meteor.publish("myCourses", function() {
	return Courses.find({
		admins: this.userId
	}, {
		sort: {
			score: -1
		}
	}, {
		fields: {
			'_id': 1,
			'name': 1,
			'admins': 1,
			'upVotes': 1,
			'downVotes': 1,
			'lessons': 1,
			'comments._id': 1,
			'score': 1,
            'featured': 1
		}
	});
});