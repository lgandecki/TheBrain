ownsDocument = function(userId, doc) {
    console.log("doc.userId " + doc.user + " userId " + userId);
    return doc && doc.user === userId;
}

isAdmin = function(userId, doc) {

    _course = Courses.findOne(doc.courseId);
    console.log("course", _course);
    return _course && _course.admins.indexOf(userId) > -1;
}