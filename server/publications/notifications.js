Meteor.publish('unreadNotifications', function() {
	return Notifications.find({user: this.userId, read: false});
});

Meteor.publish('notifications', function(limit) {
	return Notifications.find({user: this.userId}, {limit: limit});
});