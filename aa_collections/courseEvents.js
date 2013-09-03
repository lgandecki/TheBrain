//CourseEvents = new Meteor.Collection('courseEvents');
//
//
//CourseEvents.allow({
//
//    'insert': function(userId, doc) {
//        if (ownsDocument) {
//            Meteor.Audit.init(userId, CourseEvents, doc)
//            return true;
//        } else {
//            return false;
//        }
//
//    },
//
//    'update': function(userId, doc) {
//        if (ownsDocument) {
//            Meteor.Audit.update(userId, CourseEvents, doc);
//            return true;
//        } else {
//            return false;
//        }
//    },
//
//    'remove': ownsDocument
//
//});
