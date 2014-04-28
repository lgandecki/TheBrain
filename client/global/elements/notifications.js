Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({user: Meteor.userId()}, {limit: 5, sort: {created: -1}});
  },
  totalNotificationCount: function() {
    return Notifications.find({user: Meteor.userId()}, {limit: 5, sort: {created: 1}}).fetch().length;
  },
  notificationCount: function(){
    return Notifications.find({user: Meteor.userId(), read: false}).count();
  }
});

Template.notifications.events({
    'mouseleave .dropdown': function() {
        console.log("mouseleave dropdown");
        Meteor.call("clearNotifications");
    }
})

Template.notification.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
      switch (this.type) {
          case 'enrollment':
          case 'courseUpVote':
          case 'courseDownVote':
          case 'courseComment':
          case 'courseCommentUpVote':
          case 'courseCommentDownVote':
          case 'courseNews':
              Router.go("/course/" + this.courseId);
              break;
          case 'message':
              Router.go("/conversation/" + this.eventUserId);
              break;
          case 'flashcardUpdated':
              Router.go("/flashcard/" + this.flashcardId);
              break;
      }
  }

});

Template.notification.eventUserPicture = function() {
    return Meteor.userDetails.getProfilePicture(this.eventUserId);

}

Template.notification.eventUserName = function() {
    return Meteor.userDetails.getName(this.eventUserId);

}

