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

    },
    updateLessonName: function(lessonAttributes) {
     var user = Meteor.user();
     var _courseId = lessonAttributes.courseId;
        if (!user)
            throw new Meteor.Error(401, "You need to login to change lesson name");

        if (!lessonAttributes.name)
            throw new Meteor.Error(422, "Please fill the name of your lesson");

        if (!_courseId)
            throw new Meteor.Error(422, "You can only change lesson name in your courses");

        if (Courses.find(_courseId).count() < 1)
            throw new Meteor.Error(422, "You can only change lesson in an existing course");

        if (Courses.find({_id: _courseId, admins: user._id}).count() < 1)
            throw new Meteor.Error(422, "You can only change lessons in your courses");

        if (Courses.find({_id: _courseId, "lessons": {$elemMatch : {"_id": lessonAttributes.lessonId}} }).count() < 1) 
            throw new Meteor.Error(422, "You can only make changes in existing lessons");

        _course = Courses.findOne(_courseId);

        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), lessonAttributes.lessonId);


        console.log("_course", _course)
        console.log("_lessonIndex ", _lessonIndex);

        // if (Meteor.isServer) {
        //     //Courses.update({_id: courseId, "comments._id": "firstComment"}, {$inc: {"comments.$.upVotes": 1}});
        // }
        // else {

        // }

        var modifier = {$set: {}};
        modifier.$set["lessons." + _lessonIndex + ".name"] = lessonAttributes.name;

        console.log("modifier ", modifier);
        Courses.update(_courseId, modifier);
        

    },
    updateLessonDescription: function(lessonAttributes) {
     var user = Meteor.user();
     var _courseId = lessonAttributes.courseId;
        if (!user)
            throw new Meteor.Error(401, "You need to login to change lesson name");

        if (!lessonAttributes.description)
            throw new Meteor.Error(422, "Please fill the description of your lesson");

        if (!_courseId)
            throw new Meteor.Error(422, "You can only change lesson description in your courses");

        if (Courses.find(_courseId).count() < 1)
            throw new Meteor.Error(422, "You can only change lessons in an existing course");

        if (Courses.find({_id: _courseId, admins: user._id}).count() < 1)
            throw new Meteor.Error(422, "You can only change lessons in your courses");

        if (Courses.find({_id: _courseId, "lessons": {$elemMatch : {"_id": lessonAttributes.lessonId}} }).count() < 1) 
            throw new Meteor.Error(422, "You can only make changes in existing lessons");

        _course = Courses.findOne(_courseId);

        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), lessonAttributes.lessonId);


        console.log("_course", _course)
        console.log("_lessonIndex ", _lessonIndex);

        // if (Meteor.isServer) {
        //     //Courses.update({_id: courseId, "comments._id": "firstComment"}, {$inc: {"comments.$.upVotes": 1}});
        // }
        // else {

        // }

        var modifier = {$set: {}};
        modifier.$set["lessons." + _lessonIndex + ".shortDescription"] = lessonAttributes.description;

        console.log("modifier ", modifier);
        Courses.update(_courseId, modifier);
        

    }
})