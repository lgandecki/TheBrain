Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'identity': 1, 'points': 1, 'achievements': 1, 'user.profile.picture': 1}});
});