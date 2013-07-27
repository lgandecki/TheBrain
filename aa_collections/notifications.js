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
	var _user = Meteor.users.findOne({
		_id: opts.userId
	});

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
	var _user = Meteor.users.findOne({
		_id: opts.userId
	});


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
	var _user = Meteor.users.findOne({
		_id: opts.userId
	});


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


courseCommentNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
		admins: {
			$ne: opts.userId
		}
	});
	var _user = Meteor.users.findOne({
		_id: opts.userId
	});
	if (_course) {
		_course.admins.forEach(function(adminId) {
			Notifications.insert({
				user: adminId,
				eventUserId: opts.userId,
				eventUserName: _user.identity.nick,
				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Commented on your " + _course.name + " course",
				type: "courseComment",
				read: false
			});
		})
	}
}

commentUpVoteNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
	});
	var _user = Meteor.users.findOne({
		_id: opts.user
	});

	var _commentIndex = _.indexOf(_.pluck(_course.comments, '_id'), opts.commentId);


	if (_course && _user && _commentIndex) {
		_commentAuthorId = _course.comments[_commentIndex].user;
		if (_commentAuthorId !== _user._id) {
			Notifications.insert({
				user: _commentAuthorId,
				eventUserId: _user._id,
				eventUserName: _user.identity.nick,
				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Up Voted your comment in " + _course.name + " course",
				type: "courseCommentUpVote",
				read: false
			});
		}
	}
},

commentDownVoteNotification = function(opts) {
	_course = Courses.findOne({
		_id: opts.courseId,
	});
	var _user = Meteor.users.findOne({
		_id: opts.user
	});

	var _commentIndex = _.indexOf(_.pluck(_course.comments, '_id'), opts.commentId);

	console.log("we are here, down vote ", opts.user, _commentIndex)

	if (_course && _user && _commentIndex) {
		_commentAuthorId = _course.comments[_commentIndex].user;
		if (_commentAuthorId !== _user._id)
			Notifications.insert({
				user: _commentAuthorId,
				eventUserId: _user._id,
				eventUserName: _user.identity.nick,
				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Down voted your comment in " + _course.name + " course",
				type: "courseCommentDownVote",
				read: false
			});
	}
}