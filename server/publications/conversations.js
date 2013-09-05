Meteor.publish('conversations', function(limit) {
    return Meteor.publishWithRelations({
        handle: this,
        collection: Conversations,
        filter: {me: this.userId},
        options: {
            limit: limit,
            sort: {sent: 1}
        },
        mappings: [
            {
                key: 'otherUser',
                collection: Meteor.users,
                options: {
                    fields: {
                        'identity': 1,
                        'profile': 1
                    }
                }
            },
            {
                key: 'messageId',
                collection: Messages,
                options: {
                    fields: {
                        'message': 1
                    }
                }
            }
        ]


    })

})
