//Lessons = new Meteor.Collection('lessons');
//
//Lessons.allow({
//
////    'insert': isAdmin,
////    'update': isAdmin,
////    'remove': isAdmin
//
//});

Meteor.methods({
    newLesson: function (lessonAttributes) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new lesson");

        if (!lessonAttributes.name)
            throw new Meteor.Error(422, "Please fill the name of your lesson");

        if (!lessonAttributes.courseId)
            throw new Meteor.Error(422, "You can only add lesson to a course");

        if (Courses.find(lessonAttributes.courseId).count() < 1)
            throw new Meteor.Error(422, "You can only add lesson to an existing course");

        if (Courses.find({_id: lessonAttributes.courseId, admins: user._id}).count() < 1)
            throw new Meteor.Error(422, "You can only add lesson to your course");

        _newLessonId = new Meteor.Collection.ObjectID()._str;

        var lesson = _.extend(_.pick(lessonAttributes, "name", "shortDescription"), {
            _id: _newLessonId
        });

        console.log("lesson", lesson);
        if (_newLessonId) {
            var event = {
                "user": user._id,
                "type": "newLesson",
                "lessonId": _newLessonId,
                "created": { by: user._id, on: Meteor.moment.now() },
                "lastModified": { by: user._id, on: Meteor.moment.now() }
            }
            //CourseEvents.insert(event);
        }

        Courses.update({_id: lessonAttributes.courseId}, {$addToSet: {lessons: lesson, events: event}});
            //, $addToSet: {events: event}});



        Meteor.theBrain.addConnections(15);

    }
})