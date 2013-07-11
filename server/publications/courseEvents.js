Meteor.publish("courseEvents", function(id) {
    return CourseEvents.find();
});
