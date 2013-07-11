Meteor.publish("myItems", function() {
    return Items.find({user: this.userId});
});