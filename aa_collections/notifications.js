Notifications = new Meteor.Collection('notifications');

Notifications.allow({
	update: ownsDocument
});


Meteor.methods({
    clearNotifications: function() {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to clear notifications");

        if (Meteor.isServer) {
            Notifications.update({user: user._id}, {$set: {read: true}}, {multi: true});
        }
    }
})

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
//				eventUserName: _user.identity.nick,
//				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Signed up for your " + _course.name + " course!",
				type: "enrollment",
                created: Meteor.moment.fullNow(),
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
//				eventUserName: _user.identity.nick,
//				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Up voted your " + _course.name + " course!",
				type: "courseUpVote",
                created: Meteor.moment.fullNow(),
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
//				eventUserName: _user.identity.nick,
//				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Down voted your " + _course.name + " course",
				type: "courseDownVote",
                created: Meteor.moment.fullNow(),
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
//				eventUserName: _user.identity.nick,
//				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Commented on your " + _course.name + " course",
				type: "courseComment",
                created: Meteor.moment.fullNow(),
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
//				eventUserName: _user.identity.nick,
//				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Up voted your comment in " + _course.name + " course",
				type: "courseCommentUpVote",
                created: Meteor.moment.fullNow(),
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
//				eventUserName: _user.identity.nick,
//				eventUserPicture: _user.profile.picture,
				courseId: _course._id,
				courseName: _course.name,
				message: "Down voted your comment in " + _course.name + " course",
				type: "courseCommentDownVote",
                created: Meteor.moment.fullNow(),
                read: false
			});
	}
}


courseNewsNotification = function(opts) {
    _course = Courses.findOne({
        _id: opts.courseId, admins: opts.user
    });
    var _user = Meteor.users.findOne({
        _id: opts.user
    });
    if (_course && _user) {
        _course.students.forEach(function(student) {
            Notifications.insert({
                user: student,
                eventUserId: _user._id,
                courseId: _course._id,
                courseName: _course.name,
                message: "Added news to " + _course.name + " course",
                type: "courseNews",
                created: Meteor.moment.fullNow(),
                read: false
            })
        })
    }
}

