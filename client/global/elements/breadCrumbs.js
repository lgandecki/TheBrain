Template.breadCrumbs.link = function () {
    var _newPage = Session.get("isNewPage");
    var _breadCrumbs = [];


    var _currentRoute = window.location.pathname;
    if (_currentRoute === "/home") {
        return [];
    }

    console.log("getting to the breadCrumbs");

    _currentRoute = "/" + _currentRoute.split("/")[1];
    switch (_currentRoute) {
        case '/lesson':
            _breadCrumbs.push(_returnCoursePathBread());
            _breadCrumbs.push(_returnCourseBread());
            _breadCrumbs.push(_returnLessonBread());
            break;
        case '/course':
            _breadCrumbs.push(_returnCoursePathBread());
            _breadCrumbs.push(_returnCourseBread());
            break;
        case '/newFlashcard':
            _breadCrumbs.push({
                name: "New Flashcard",
                path: _currentRoute
            });
            break;
        case '/myFlashcards':
            _breadCrumbs.push({
                name: "My Flashcards",
                path: _currentRoute
            });
            break;
        case '/availableFlashcards':
            _breadCrumbs.push({
                name: "Look For Flashcards",
                path: _currentRoute
            });
            break;
        case '/repeat':
            _breadCrumbs.push({
                name: "Repeat",
                path: _currentRoute
            });
            break;
        case '/learnAndRepeat':
            _breadCrumbs.push({
                name: "Learn and Repeat",
                path: _currentRoute
            });
            break;
        case '/myCourses':
            _breadCrumbs.push({
                name: "My Courses",
                path: _currentRoute
            });
            break;
        case '/enrolledCourses':
            _breadCrumbs.push({
                name: "Enrolled Courses",
                path: _currentRoute
            });
            break;
        case '/availableCourses':
            _breadCrumbs.push({
                name: "Available Courses",
                path: _currentRoute
            });
            break;
        case '/myCollections':
            _breadCrumbs.push({
                name: "My Collections",
                path: _currentRoute
            });
            break;
        case '/myProfile':
            _breadCrumbs.push({
                name: "My Profile",
                path: _currentRoute
            });
            break;
        case '/calendar':
            _breadCrumbs.push({
                name: "Repetitions Calendar",
                path: _currentRoute
            });
            break;
        case '/myAchievements':
            _breadCrumbs.push({
                name: "My Achievements",
                path: _currentRoute
            });
            break;
        case '/notificationCenter':
            _breadCrumbs.push({
                name: "Notification Center",
                path: _currentRoute
            });
            break;


    }
    console.log("_breadCrumbs", _breadCrumbs);
    return _breadCrumbs;

}

var _returnCoursePathBread = function () {
    var _breadCrumb = {
        path: Session.get("coursePath")
    }

    switch (Session.get("coursePath")) {
        case '/myCourses':
            _breadCrumb.name = "My Courses";
            break;
        case '/availableCourses':
            _breadCrumb.name = "Available Courses";
            break;
        case '/enrolledCourses':
            _breadCrumb.name = "Enrolled Courses";
            break;
    }
    return _breadCrumb;
}

var _returnLessonBread = function () {
    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _lesson;
    if (_course) {
        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
        _lesson = _course.lessons[_lessonIndex];
    }
    var _lessonName = _lesson ? _lesson.name : "";

    _breadCrumb = {
        path: window.location.pathname,
        name: "Lesson: " + _lessonName
    }

    return _breadCrumb;

}

var _returnCourseBread = function () {
    var _breadCrumb = {};
    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _courseName = _course ? _course.name : "";
    if (_course) {
        _breadCrumb = {
            path: "/course/" + _course._id,
            name: "Course: " + _courseName
        };
    }
    return _breadCrumb;
}