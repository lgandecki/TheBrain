Meteor.Router.add({

    '/': 'home',

    '/newFlashcard': "newFlashcard",

    '/repeat': "repeat",

    '/learnAndRepeat': function() {
        Session.set("showScheduleModal", true);
        return "repeat";
    },


    '/myCollections': function() {
        return "myCollections";
    },

    '/myCourses': "myCourses",

    '/enrolledCourses': "enrolledCourses",

    '/course/:id': function(id) {
        Session.set("selectedCourse", id);
        //        if (!Session.get("selectedCourseTab")) {
        Session.set("selectedCourseTab", "#events");
        //        }
        return "course";
    },

    '/courseLessons/:id': function(id) {
        Session.set("selectedCourse", id);
        //        if (!Session.get("selectedCourseTab")) {
        Session.set("selectedCourseTab", "#events");
        //        }
        return "courseLessons";
    },
    '/availableCourses': function() {
        return "availableCourses";
    },
    '/lesson/:courseId/:lessonId': function(courseId, lessonId) {
        setTimeout(function() {
            Session.set("selectedCourse", courseId);
            Session.set("selectedLesson", lessonId);
        }, 50);
        return "lesson";
    },

    '/myProfile': "myProfile",

    "/notificationCenter": "notificationCenter",

    '/login': function() {
        return "login";
    },


    "/loading": function() {
        return "loading";
    },


});

Meteor.Router.filters({
    "postLoad": function(page) {


        var _tran = $("#transition"),
            _html = _tran.html(),
            _off = _tran.offset(),
            _width = _tran.width(),
            _prev = null,
            _easing = "easeInOutBack";

        if (_html && $(".previousPage").length === 0 && !Meteor.loggingIn()) {
            _prev = $("<div class='previousPage'/>").html(_html).css({
                "z-index": 0,
                position: "absolute",
                left: _off.left + "px",
                top: _off.top + "px",
                width: _width + "px"
            });
            $(document.body).append(_prev);
            _tran.hide();
        }

        setTimeout(function() {
            
            if (typeof ga !== 'undefined') {
                ga('send', 'pageview', window.location.pathname);
            }
            else {
                setTimeout(function() {
                    ga('send', 'pageview', window.location.pathname);
                }, 300);
            }


            if (_prev) {
                _prev.animate({
                    "left": ((_width + _off.left) * -1) + "px"
                }, 1200, _easing, function() {
                    _prev.remove();
                });
            }
            $("#transition").css({
                "left": _width + 40 + "px"
            }).show()
                .animate({
                    "left": "0"
                }, 1200, _easing, function() {
                    $(".answer").focus();
                });

            // $(".select2").select2();

            //                    //auto converts all selects to chosen
            //                    $(".make-chosen").chosen({allow_single_deselect: true});
            //
            //                    //auto converts dates
            //                    $(".make-date").datepicker();
            //
            //                    //makes pretty checkboxes and radio buttons
            //                    $(".make-pretty").prettyCheckable();

            checkLeftNav();
            resizeContent();

        }, 10);


        // setTimeout(function () {
        //     if (Meteor.userId()) {
        //         console.log("Inside logged");


        //     return page;

        // }
        // else {
        //     return "login";
        // }

        if (Meteor.loggingIn()) {
            return "loading";

        } else if (Meteor.userId()) {

            return page;
        } else {
            return "login";
        }

    }
});


Meteor.Router.filter('postLoad');