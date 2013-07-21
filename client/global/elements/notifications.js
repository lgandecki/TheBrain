Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({user: Meteor.userId(), read: false}, {limit: 5});
  },
  notificationCount: function(){
    return Notifications.find({user: Meteor.userId(), read: false}).count();
  }
});

Template.notification.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});