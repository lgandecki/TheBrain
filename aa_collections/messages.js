Messages = new Meteor.Collection("messages");

Meteor.methods({
    "sendMessage": function(opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        var _newMessage = {
            from: user._id,
            to: opts.to,
            message: opts.message,
            sent: Meteor.moment.fullNow(),
            read: false

        }

        var _messageId = Messages.insert(_newMessage);

        if (Meteor.isServer) {
            var _opts = {
                from: user._id,
                to: opts.to,
                messageId: _messageId
            };
            messageNotification(_opts);
            Meteor.call("updateConversations", _opts);
        }
    }
});