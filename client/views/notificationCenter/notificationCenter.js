notificationsHandle = Meteor.subscribeWithPagination('notifications', 10);


Template.notificationCenter.notification = function() {
    return Notifications.find({user: Meteor.userId()}, {limit: notificationsHandle.limit()});
}


Template.notificationCenter.helpers({
  notificationsReady: function() {
    return ! notificationsHandle.loading();
  },
  allNotificationsLoaded: function() {
    return ! notificationsHandle.loading() && 
      Notifications.find().count() < notificationsHandle.loaded();
  }
});


Template.notificationCenter.events({
  'click .btn-loadMore': function(e) {
    e.preventDefault();
    notificationsHandle.loadNextPage();
  }
});


Template.notificationRow.eventUserPicture = function() {
    return Meteor.userDetails.getProfilePicture(this.eventUserId);
}

Template.notificationRow.eventUserNameWithLink = function() {
    return Meteor.userDetails.getNameWithLink(this.eventUserId);
}

