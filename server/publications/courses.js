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
			'comments._id': 1
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
			'score': 1
		}
	});
});


Meteor.publish("selectedCourse", function(id) {
                            console.log("publishing? " + id);
    return id && Meteor.publishWithRelations({
        handle: this,
        collection: Courses,
        filter: {_id: id},
        options: {
//            limit: limit,
            fields: {
                '_id': 1,
                'name': 1,
                'admins': 1,
                'upVotes': 1,
                'downVotes': 1,
                'lessons': 1,
                'events': 1,
                'comments': 1,
                'score': 1
            }
        },
        mappings: [
            {
                key: "user",
                nestedArray: "comments",
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            },
            {
                key: "user",
                nestedArray: "events",
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'points': 1,
                        'achievements': 1,
                        'profile': 1
                    }
                }
            }
//            {
//                key: ""
//            }
        ]
    })
//    return Notifications.find({user: this.userId}, {limit: limit});

//
//	return Courses.find({
//		_id: id
//	}, {
//		fields: {
//			'_id': 1,
//			'name': 1,
//			'admins': 1,
//			'upVotes': 1,
//			'downVotes': 1,
//			'lessons': 1,
//			'events': 1,
//			'comments': 1,
//			'score': 1
//		}
//	});
});


