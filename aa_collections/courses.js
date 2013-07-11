Courses = new Meteor.Collection('courses');


Courses.allow({

    'insert': function (userId, doc) {
        if (ownsDocument) {
            Meteor.Audit.init(userId, Courses, doc)
            return true;
        } else {
            return false;
        }

    },

    'update': function (userId, doc) {
        if (isAdmin) {
            Meteor.Audit.update(userId, Courses, doc);
            return true;
        } else {
            return false;
        }
    },

    'remove': ownsDocument

});

Meteor.methods({
    newCourse: function (courseAttributes) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new course");

        if (!courseAttributes.name)
            throw new Meteor.Error(422, "Please fill the name of your course");

        var course = _.extend(_.pick(courseAttributes, "name", "shortDescription", "public"), {
            admins: [user._id],
            upVotes: [],
            downVotes: [],
            lessons: [],
            flashcards: 0
        });

        _newCourseId = Courses.insert(course);

        if (_newCourseId) {
            var _newLesson = {
                name: "Lesson 1",
                shortDescription: "",
                courseId: _newCourseId
            };

            Meteor.call('newLesson', _newLesson);

            var courseEvent = {
                "courseId": _newCourseId,
                "user": user._id,
                "type": "created",
                "created": { by: user._id, on: Meteor.moment.now() },
                "lastModified": { by: user._id, on: Meteor.moment.now() }
            }
            CourseEvents.insert(courseEvent);
        }


    },
    courseCommentVoteUp: function(courseId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new course");

        _commentId = "firstComment";


        _course = Courses.findOne(courseId);

        var _commentIndex = _.indexOf(_.pluck(_course.comments, '_id'), _commentId);


        console.log("_course", _course)
        console.log("_commentIndex ", _commentIndex);

        if (Meteor.isServer) {
            //Courses.update({_id: courseId, "comments._id": "firstComment"}, {$inc: {"comments.$.upVotes": 1}});
        }
        else {

        }

        var modifier = {$addToSet: {}};
        modifier.$addToSet["comments." + _commentIndex + ".upVotesArray"] = "testabc";

        console.log("modifier ", modifier);
        Courses.update(courseId, modifier);
}
})