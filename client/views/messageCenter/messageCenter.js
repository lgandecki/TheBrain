var conversationsHandle;

Template.messageCenter.created = function() {
    conversationsHandle = Meteor.subscribeWithPagination('conversations', 10);
}

Template.messageCenter.conversation = function() {
    return Conversations.find();
}

Template.messageCenter.conversationsExist = function() {
    return Conversations.find().count() > 0;
}

Template.messageCenter.helpers({
    conversationsReady: function() {
        return ! conversationsHandle.loading();
    },
    allConversationsLoaded: function() {
        return ! conversationsHandle.loading() &&
            Conversations.find().count() < conversationsHandle.loaded();
    }
})


Template.messageCenter.destroyed = function() {
    conversationsHandle.stop();
}

Template.conversationRow.userName = function() {
    return Meteor.userDetails.getName(this.otherUser);
}

Template.conversationRow.message = function() {
    var _message = Messages.findOne({_id: this.messageId});
    if (_message) {
        return _message.message.substring(0, 50);
    }
}

Template.conversationRow.sent = function() {
    return new moment(this.sent).fromNow();
}

Template.conversationRow.events({
    "click .conversationRow": function(e) {
        Meteor.Router.to('/conversation/' + this.otherUser);
    }
})

var usersHandle;

Template.newConversation.created = function() {
    var _opts = {

    };
    usersHandle = Meteor.subscribeWithPagination('usersPaginated', _opts, 5);
}

Template.newConversation.events({
    "keyup #usersSearch": function (e, template) {
        var _opts = {};
        _opts.search = $("#usersSearch").val();
        Session.set("optsSearch", _opts.search);
        usersHandle.stop();
        usersHandle = Meteor.subscribeWithPagination('usersPaginated', _opts, 5);
    }
})

Template.newConversation.user = function() {
    var _query = {};
    if (Session.get("optsSearch")) {
        var _opts = Session.get("optsSearch");
        _query = {_id: {$ne: Meteor.userId()}, "identity.nick": new RegExp(_opts, "i")};
    } else {
        _query = {_id: {$ne: Meteor.userId()}}
    }
    return Meteor.users.find(_query, {limit: usersHandle.limit()});
}


Template.newConversation.helpers({
    usersReady: function() {
        if (Session.get("optsSearch")) {
            var _opts = true;
        }
        return ! usersHandle.loading();
    },
    allUsersLoaded: function() {
        if (Session.get("optsSearch")) {
            var _opts = true;
        }
        return ! usersHandle.loading() &&
            Meteor.users.find({}, {limit: usersHandle.limit()}).count() < usersHandle.loaded();
    }
})

Template.newConversation.destroyed = function() {
    usersHandle.stop();
    Session.set("optsSearch", "");
}

Template.userRow.userName = function() {
    return Meteor.userDetails.getName(this._id);

}

Template.userRow.userPicture = function() {
    return Meteor.userDetails.getProfilePicture(this._id);
}

Template.userRow.events({
    "click .userRow": function(e) {
        Meteor.Router.to('/conversation/' + this._id);
    }
})