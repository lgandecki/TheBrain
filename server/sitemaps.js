sitemaps.add('/sitemap.xml', function() {
    var _out = [], _flashcards = Flashcards.find({public: true}).fetch();
    _.each(_flashcards, function(flashcard) {
        _out.push({
            page: 'flashcard/' + flashcard._id
//            lastmod: page.lastUpdated
        });
    });

    var _sitemapabbleRoutes = [
        {name: "home", path: "/"},
        {name: "availableFlashcards", path: "/availableFlashcards"},
        {name: "policy", path: "/policy"},
        {name: "khanPlaylists", path: "/khanPlaylists"},
        {name: "availableCourses", path: "/availableCourses"}
    ]
    _sitemapabbleRoutes.forEach(function(route) {
        _out.push({
            page: route.path

        });
    });

    var _courses = Courses.find({public: true}).fetch();
    _.each(_courses, function(course) {
        _out.push({
            page: 'course/' + course._id
//            lastmod: page.lastUpdated
        });
        if (course.lessons && course.lessons.length > 0) {
            course.lessons.forEach(function(lesson) {
                _out.push({
                    page: 'lesson/' + course._id + '/' + lesson._id
                })
            });
        }
    });

    var _khanPlaylists = KhanPlaylists.find().fetch();
    _.each(_khanPlaylists, function(khanPlaylist) {
        if (khanPlaylist.videos && khanPlaylist.videos.length > 0) {
             khanPlaylist.videos.forEach(function(video) {
                 _out.push({
                     page: '/khanVideo/' + khanPlaylist.slug + "/" + video.readable_id + "/" + video.youtube_id
                 })
             })
        }

    });

    return _out;
});
//
//sitemaps.add('/sitemap.xml', function() {
//    var _sitemapabbleRoutes = [
//        {name: "home", path: "/"},
//        {name: "availableFlashcards", path: "/availableFlashcards"},
//        {name: "policy", path: "/policy"},
//        {name: "khanPlaylists", path: "/khanPlaylists"},
//        {name: "availableCourses", path: "/availableCourses"}
//    ]
//   var _out = [];
//   _sitemapabbleRoutes.forEach(function(route) {
//       _out.push({
//           page: path
//
//       });
//   });
//    return _out;
//})

// Khan Videos

// Courses
//
//sitemaps.add('/sitemap.xml', function() {
//    var _out = [], _courses = Courses.find({public: true}).fetch();
//    _.each(_courses, function(course) {
//        _out.push({
//            page: 'course/' + course._id
////            lastmod: page.lastUpdated
//        });
//        if (course.lessons && course.lessons.length > 0) {
//            course.lessons.forEach(function(lesson) {
//                _out.push({
//                    page: 'lesson/' + course._id + '/' + lesson._id
//                })
//            });
//        }
//    });
//    return _out;
//});
