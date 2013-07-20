ownsDocument = function(userId, doc) {
    return doc && doc.user === userId;
}

isAdmin = function(userId, doc) {

    _course = Courses.findOne(doc.courseId);
    return _course && _course.admins.indexOf(userId) > -1;
}