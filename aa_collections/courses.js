Courses = new Meteor.Collection('courses');


Courses.allow({

    'insert': function(userId, doc) {
        if (ownsDocument) {
            Meteor.Audit.init(userId, Courses, doc);
            return true;
        } else {
            return false;
        }

    },

    'update': function(userId, doc) {
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
    newCourse: function(courseAttributes) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new course");

        if (!courseAttributes.name)
            throw new Meteor.Error(422, "Please fill the name of your course");

        var course = _.extend(_.pick(courseAttributes, "name", "shortDescription", "public"), {
            admins: [user._id],
            upVotes: [],
            downVotes: [],
            score: 0,
            lessons: [{
                "_id": new Meteor.Collection.ObjectID()._str,
                name: "Day One",
                shortDescription: "Temporary description",
                flashcards: []
            }],
            events: [{
                "_id": new Meteor.Collection.ObjectID()._str,
                "user": user._id,
                "type": "created",
                "created": {
                    by: user._id,
                    on: Meteor.moment.now()
                },
                "lastModified": {
                    by: user._id,
                    on: Meteor.moment.now()
                }
            }],
            flashcards: 0,
            comments: [],
            students: []
        });

        _newCourseId = Courses.insert(course);
        Meteor.theBrain.addConnections(15);


    },
    downVoteCourse: function(courseId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote");
        _course = Courses.findOne(courseId);
        if (!_course)
            throw new Meteor.Error(401, "You have to vote on existing course!");
        Courses.update({
            _id: courseId,
            upVotes: user._id
        }, {
            $pull: {
                upVotes: user._id
            },
            $inc: {
                score: -1
            }
        });
        Courses.update({
            _id: courseId,
            downVotes: {
                $ne: user._id
            }
        }, {
            $addToSet: {
                downVotes: user._id
            },
            $inc: {
                score: -1
            }
        });
        // updateScore(courseId);

        var _opts = {
            courseId: courseId,
            userId: user._id
        };
        courseVoteDownNotification(_opts);
    },
    upVoteCourse: function(courseId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote");
        _course = Courses.findOne(courseId);
        if (!_course)
            throw new Meteor.Error(401, "You have to vote on existing course!");
        Courses.update({
            _id: courseId,
            downVotes: user._id
        }, {
            $pull: {
                downVotes: user._id
            },
            $inc: {
                score: 1
            }
        });
        Courses.update({
            _id: courseId,
            upVotes: {
                $ne: user._id
            }
        }, {
            $addToSet: {
                upVotes: user._id
            },
            $inc: {
                score: 1
            }
        });

        var _opts = {
            courseId: courseId,
            userId: user._id
        };
        courseVoteUpNotification(_opts);

        // updateScore(courseId);

    },
    newCourseComment: function(newCourseComment) {
        var _user = Meteor.user();
        if (!_user) 
            throw new Meteor.Error(401, "You need to login to comment");
        _course = Courses.findOne(newCourseComment.courseId);

        if (!_course)
            throw new Meteor.Error(401, "You have to comment on existing course");

        var comment = _.extend(_.pick(newCourseComment, "comment"), {
            _id: new Meteor.Collection.ObjectID()._str,
            user: _user._id,
            userName: _user.identity.nick,
            userPicture: _user.profile.picture,
            posted: Meteor.moment.fullNow(),
            parent: null,
            upVotes: [],
            downVotes: [],
            score: 0
        });

        Courses.update({_id: _course._id}, {$addToSet: {comments: comment}});


        var _opts = {
            courseId: _course._id,
            userId: _user._id
        };

        courseCommentNotification(_opts);


    },
    courseCommentVoteUp: function(opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on comments");

        _course = Courses.findOne(opts.courseId);

        var _commentIndex = _.indexOf(_.pluck(_course.comments, '_id'), opts.commentId);


        var modifier = {
            $pull: {},
            $inc: {}
        };

        _query = {_id: _course._id};
        _query["comments." + _commentIndex + ".downVotes"] = user._id;

        modifier.$pull["comments." + _commentIndex + ".downVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = 1

        Courses.update(_query, modifier);

        var modifier = {
            $addToSet: {},
            $inc: {}
        };

        _query = {_id: _course._id};
        _query["comments." + _commentIndex + ".upVotes"] = { $ne: user._id};

        modifier.$addToSet["comments." + _commentIndex + ".upVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = 1

        Courses.update(_query, modifier);
        _opts = {
            user: user._id,
            commentId: opts.commentId,
            courseId: _course._id
        };
        commentUpVoteNotification(_opts);
    },
        courseCommentVoteDown: function(opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on comments");

        _course = Courses.findOne(opts.courseId);

        var _commentIndex = _.indexOf(_.pluck(_course.comments, '_id'), opts.commentId);

        var modifier = {
            $pull: {},
            $inc: {}
        };

        _query = {_id: _course._id};
        _query["comments." + _commentIndex + ".upVotes"] = user._id;

        modifier.$pull["comments." + _commentIndex + ".upVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = -1;

        console.log("modifier first ", modifier);

        Courses.update(_query, modifier);


        var modifier = {
            $addToSet: {},
            $inc: {}
        };

        _query = {_id: _course._id};
        _query["comments." + _commentIndex + ".downVotes"] = { $ne: user._id};

        modifier.$addToSet["comments." + _commentIndex + ".downVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = -1;


                console.log("modifier second ", modifier);


        Courses.update(_query, modifier);

        _opts = {
            user: user._id,
            commentId: opts.commentId,
            courseId: _course._id
        };
        commentDownVoteNotification(_opts);
    },
    enrollInCourse: function(courseId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to enroll in course");
        _course = Courses.findOne(courseId);
        if (!_course)
            throw new Meteor.Error(401, "You have to enroll in existing course!");

        Meteor.users.update({_id: user._id}, {$addToSet: {courses: courseId}});
        Courses.update({_id: courseId}, {$addToSet: {students: user._id}});
        var _opts = {
            courseId: courseId,
            userId: user._id
        };
        courseEnrollmentNotification(_opts);

    },
    dropOutFromTheCourse: function(courseId) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to drop out from the course");
        _course = Courses.findOne(courseId);
        if (!_course)
            throw new Meteor.Error(401, "You have to drop out from existing course!");

        Meteor.users.update({_id: user._id}, {$pull: {courses: courseId}});
        Courses.update({_id: courseId}, {$pull: {students: user._id}});
    }
});

updateScore = function(_courseId) {
    _course = Courses.findOne(_courseId);
    _score = _course.upVotes.length - _course.downVotes.length;
    Courses.update({
        _id: _courseId
    }, {
        $set: {
            score: _score
        }
    });

}