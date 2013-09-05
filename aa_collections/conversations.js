Conversations = new Meteor.Collection("conversations");

Meteor.methods({
    "updateConversations": function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        var _newConversation = {
//            me: user._id,
//            otherUser: opts.to,
            messageId: opts.messageId,
            sent: Meteor.moment.fullNow(),
            read: false
        }
        var _key;
        console.log("updateConversations opts", opts);
        console.log("newConversation", _newConversation);
        if (Meteor.isServer) {
            _key = {'me': user._id, 'otherUser': opts.to};
            _newConversation.me = user._id;
            _newConversation.otherUser = opts.to;
            Conversations.update(_key, _newConversation, {upsert: true});

            _newConversation.me = opts.to;
            _newConversation.otherUser = user._id;
            _key = {'me': opts.to, 'otherUser': user._id};
            Conversations.update(_key, _newConversation, {upsert: true});
        }

    }
})