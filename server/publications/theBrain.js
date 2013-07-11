Meteor.publish("theBrain", function() {
    return TheBrain.find({_id: "global"});
});