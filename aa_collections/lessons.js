Lessons = new Meteor.Collection('lessons');

Lessons.allow({

    'insert': isAdmin,
    'update': isAdmin,
    'remove': isAdmin

});

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

        var lesson = _.extend(_.pick(lessonAttributes, "name", "shortDescription", "courseId"), {
        });

        _newLessonId = Lessons.insert(lesson);
        if (_newLessonId) {
            var courseEvent = {
                "courseId": lesson.courseId,
                "user": user._id,
                "type": "newLesson",
                "lessonId": _newLessonId,
                "created": { by: user._id, on: Meteor.moment.now() },
                "lastModified": { by: user._id, on: Meteor.moment.now() }
            }
            CourseEvents.insert(courseEvent);
        }


    }
})