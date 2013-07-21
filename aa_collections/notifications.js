Notifications = new Meteor.Collection('notifications');

Notifications.allow({
	update: ownsDocument
});

courseEnrollmentNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
		admins: {
			$ne: opts.userId
		}
	});
	var _user = Meteor.users.findOne({_id: opts.userId});

	if (_course) {
		_course.admins.forEach(function(adminId) {
			Notifications.insert({
				user: adminId,
				eventUserId: opts.userId,
				eventUserName: _user.identity.nick,
				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Signed up for your " + _course.name + " course!",
				type: "enrollment",
				read: false
			});
		})
	}
};

courseVoteUpNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
		admins: {
			$ne: opts.userId
		}
	});
	var _user = Meteor.users.findOne({_id: opts.userId});


	if (_course) {
		_course.admins.forEach(function(adminId) {
			Notifications.insert({
				user: adminId,
				eventUserId: opts.userId,
				eventUserName: _user.identity.nick,
				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Up Voted your " + _course.name + " course!",
				type: "courseUpVote",
				read: false
			});
		})
	}

}


courseVoteDownNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
		admins: {
			$ne: opts.userId
		}
	});
	var _user = Meteor.users.findOne({_id: opts.userId});


	if (_course) {
		_course.admins.forEach(function(adminId) {
			Notifications.insert({
				user: adminId,
				eventUserId: opts.userId,
				eventUserName: _user.identity.nick,
				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Down Voted your " + _course.name + " course",
				type: "courseDownVote",
				read: false
			});
		})
	}

}