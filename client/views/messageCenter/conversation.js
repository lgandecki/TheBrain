var messagesHandle;
var _otherUserHandle;
Template.conversation.created = function() {
    var _opts = {
        otherUser: Session.get("otherUser")
    };

    messagesHandle = Meteor.subscribeWithPagination('messages', _opts, 4);

    _otherUserHandle = Meteor.subscribe("otherUser", Session.get("otherUser"));

}

Template.conversation.rendered = function() {
    $(".sendMessage").focus();
}


Template.conversation.message = function() {
    return Messages.find({$or: [{from: Meteor.userId(), to: Session.get("otherUser")}, {to: Meteor.userId(), from: Session.get("otherUser")}]}, {limit: messagesHandle.limit(), sort: {sent: 1}});
//    return Messages.find({$or: [{from: Meteor.userId()}, {from: Session.get("otherUser")},
//        {to: Meteor.userId()}, {to: Session.get("otherUser")}]},
//        {limit: messagesHandle.limit(), sort: {sent: 1}});
}

Template.conversation.userName = function() {
    return Meteor.userDetails.getName(Session.get("otherUser"));
}

Template.conversation.helpers({
    messagesReady: function() {
        return ! messagesHandle.loading();
    },
    allMessagesLoaded: function() {
        return ! messagesHandle.loading() &&
            Messages.find({$or: [{from: Meteor.userId(), to: Session.get("otherUser")}, {to: Meteor.userId(), from: Session.get("otherUser")}]}).count() < messagesHandle.loaded();
    }
})


Template.conversation.events({
    'click .btn-loadMore': function(e) {
        e.preventDefault();
        messagesHandle.loadNextPage();
        $("html, body").animate({
            scrollTop: 0
        }, 600);
    },
    "keyup .sendMessage": function (e) {
        if (e.keyCode === 13 || e.keyCode === 10) {
            e.preventDefault();
            sendMessage();
        }
    },
    "click .btn-sendMessage": function(e) {
        e.preventDefault();
        sendMessage();

    }
});

Template.conversation.destroyed = function() {
    messagesHandle.stop();
    _otherUserHandle.stop();
}

Template.conversationMessage.userPicture = function() {
    return Meteor.userDetails.getProfilePicture(this.from);
}



Template.conversationMessage.sent = function() {
    return new moment(this.sent).fromNow();
}

Template.conversationMessage.leftOrRight = function() {
    if (this.from === Meteor.userId()) {
        return "left";
    }
    else {
        return "right";
    }
}

var sendMessage = function() {
    var _callOpts = {
        function: "sendMessage",
        arguments: {
            to: Session.get("otherUser"),
            message: $(".sendMessage").val()
        },
        errorTitle: "Sending message error",
        successTitle: false
    }
    Meteor.myCall(_callOpts);
    $("html, body").animate({
        scrollDown: 0
    }, 600);
    $(".sendMessage").val("").focus();
}

