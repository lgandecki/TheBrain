Meteor.publish('messages', function(opts, limit) {
    return Meteor.publishWithRelations({
        handle: this,
        collection: Messages,
        filter: {$or: [{from: this.userId, to: opts.otherUser},
            {to: this.userId, from: opts.otherUser}]},
//        filter: {$or: [{from: this.userId}, {from: opts.otherUser},
//            {to: this.userId}, {to: opts.otherUser}]},
        options: {
            limit: limit,
            sort: {sent: -1}
        }
//        mappings: [
//            {
//                key: 'from',
//                collection: Meteor.users,
//                options: {
//                    fields: {
//                        'identity': 1,
//                        'points': 1,
//                        'achievements': 1,
//                        'profile': 1
//                    }
//                }
//            },
//            {
//                key: 'to',
//                collection: Meteor.users,
//                options: {
//                    fields: {
//                        'identity': 1,
//                        'points': 1,
//                        'achievements': 1,
//                        'profile': 1
//                    }
//                }
//            }
//        ]
    })
});