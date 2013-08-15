Meteor.publish('unreadNotifications', function() {
    return Meteor.publishWithRelations({
        handle: this,
        collection: Notifications,
        filter: {user: this.userId, read: false},
//        options: {
//            limit: limit,
//        },
        mappings: [
            {
                key: 'eventUserId',
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
        ]
    })
//	return Notifications.find({user: this.userId, read: false});
});

Meteor.publish('notifications', function(limit) {
    return Meteor.publishWithRelations({
        handle: this,
        collection: Notifications,
        filter: {user: this.userId},
        options: {
            limit: limit,
        },
        mappings: [
            {
                key: 'eventUserId',
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
        ]
    })
//	return Notifications.find({user: this.userId}, {limit: limit});
});