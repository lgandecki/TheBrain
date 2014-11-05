/**
 * Created by lukaszgandecki on 11/4/14.
 */

Meteor.publishComposite("selectedCourse", function (id) {
    return {
        find: function () {
            return Courses.find({_id: id}, {fields: {
                '_id': 1,
                'name': 1,
                'admins': 1,
                'upVotes': 1,
                'downVotes': 1,
                'lessons': 1,
                'events': 1,
                'comments': 1,
                'score': 1,
                'featured': 1
            }});
        },
        children: [
            {
                find: function (course) {
                    var _eventAuthorIds = _.pluck(course.events, "user");
                    return Meteor.users.find(
                        {_id: {$in: _eventAuthorIds}},
                        {
                            fields: {
                                'identity': 1,
                                'profile': 1
                            }
                        });
                }
            },
            {
                find: function (course) {
                    var _commentAuthorIds = _.pluck(course.comments, "user");
                    return Meteor.users.find(
                        {_id: {$in: _commentAuthorIds}},
                        {
                            fields: {
                                'identity': 1,
                                'profile': 1
                            }
                        });
                }
            }
        ]
    }
});