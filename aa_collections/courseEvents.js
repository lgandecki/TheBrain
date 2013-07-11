CourseEvents = new Meteor.Collection('courseEvents');


CourseEvents.allow({

    'insert': function(userId, doc) {
        console.log("Are we really never here?");
        if (ownsDocument) {
            console.log("We should come here when you create one");
            Meteor.Audit.init(userId, CourseEvents, doc)
            return true;
        } else {
            return false;
        }

    },

    'update': function(userId, doc) {
        if (ownsDocument) {
            Meteor.Audit.update(userId, CourseEvents, doc);
            return true;
        } else {
            return false;
        }
    },

    'remove': ownsDocument

});
