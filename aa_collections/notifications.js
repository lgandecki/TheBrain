Notifications = new Meteor.Collection('notifications');

Notifications.allow({
	update: ownsDocument
});

createEnrollmentNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
		admins: {
			$ne: opts.userId
		}
	});
	if (_course) {
		_course.admins.forEach(function(adminId) {
			Notifications.insert({
				userId: adminId,
				eventUserId: opts.userId,
				eventUserName: opts.userId, // TODO get username
				courseId: _course._id,
				courseName: _course.name,
				type: "enrollmentNotification",
				read: false
			});
		})
	}
};