Meteor.Router.add({

    '/': 'home',

    '/newFlashcard': "newFlashcard",

    '/myFlashcards': function() {
        Session.set("selectedCollection", "");
        return "myCollectionsFlashcards"
    },


    '/availableFlashcards': "availableFlashcards",

    '/repeat': "repeat",

    '/learnAndRepeat': function () {
        Session.set("showScheduleModal", true);
        return "repeat";
    },


    '/myCollections': function () {
        return "myCollections";
    },

    '/myCollection/:id': function (id) {
        Session.set("selectedCollection", id);
        return "myCollectionsFlashcards";
    },

    '/myCourses': function () {
        Session.set("coursePath", "/myCourses");
        return "myCourses";
    },

    '/enrolledCourses': function () {
        Session.set("coursePath", "/enrolledCourses");
        return "enrolledCourses"
    },

    '/course/:id': function (id) {
        Session.set("selectedCourse", id);
        //        if (!Session.get("selectedCourseTab")) {
        Session.set("selectedCourseTab", "#events");
        //        }
        return "course";
    },

    '/courseLessons/:id': function (id) {
        Session.set("selectedCourse", id);
        //        if (!Session.get("selectedCourseTab")) {
        Session.set("selectedCourseTab", "#events");
        //        }
        return "courseLessons";
    },
    '/availableCourses': function () {
        Session.set("coursePath", "/availableCourses");
        return "availableCourses";
    },
    '/lesson/:courseId/:lessonId': function (courseId, lessonId) {
        setTimeout(function () {
            Session.set("selectedCourse", courseId);
            Session.set("selectedLesson", lessonId);
        }, 50);
        return "lesson";
    },

    '/myProfile': "myProfile",

    "/notificationCenter": "notificationCenter",

    '/login': function () {
        return "login";
    },


    "/loading": function () {
        return "loading";
    },

    "/calendar": function () {
        return "calendar";
    },

    "/messageCenter": function() {
        return "messageCenter";
    },

    "/conversation/:otherUser": function(otherUser) {
        Session.set("otherUser", otherUser);
        return "conversation";
    }


});

Meteor.Router.filters({
    "postLoad": function (page) {


        var _tran = $(".transition"),
            _html = _tran.html(),
            _off = _tran.offset(),
            _width = _tran.width(),
            _prev = null,
            _easing = "easeInOutBack";

        if (_html && _off && !Meteor.loggingIn()) {
            _prev = $("<div class='previousPage'/>").html(_html).css({
                "z-index": 0,
                position: "absolute",
                left: _off.left + "px",
                top: _off.top + "px",
                width: _width + "px"
            });
            $(document.body).append(_prev);
        }

        $("html, body").animate({
            scrollTop: 0
        }, 300);

        $(".transition").hide();

        setTimeout(function () {
            $(".transition").show();
            if ($(".transition").length > 0) {
                console.log("_width", _width);
                console.log("transition", $(".transition").width());
                $(".transition").css({
                    "left": $(".transition").width() + 40 + "px"
                }).show()
                    .animate({
                        "left": "0"
                    }, 1200, _easing, function () {
                        $(".answer").focus();

                    });
            }


            if (typeof ga !== 'undefined') {
                ga('send', 'pageview', window.location.pathname);
            }
            else {
                setTimeout(function () {
                    ga('send', 'pageview', window.location.pathname);
                }, 300);
            }


            if (_prev) {
                _prev.animate({
                    "left": ((_width + _off.left) * -1) + "px"
                }, 1200, _easing, function () {
                    _prev.remove();
                });
            }


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


            makeModalsScrollable();

            setTimeout(function() {
                if (!$(".transition").is(":visible")) {
                    console.log("TRANSITION WAS NOT VISIBLE SO manually displayed it");
                    $(".transition").show().css("left", 0);
                }
            }, 300);

        }, 50);


        // setTimeout(function () {
        //     if (Meteor.userId()) {
        //         console.log("Inside logged");


        //     return page;

        // }
        // else {
        //     return "login";
        // }
        $(".dropdown-menu").hide('normal', "easeInOutCubic");

        if (Meteor.loggingIn()) {
            return "loading";

        } else if (Meteor.userId() || Session.get("exploreMode")) {

            return page;
        } else {
            return "login";
        }

    }
});


Meteor.Router.filter('postLoad');


var makeModalsScrollable = function () {
    console.log("window height", $(window).height())
    var _modalMaxHeight = $(window).height() - ($(window).height() / 4) - 76;
    $(".modal-box").css({"max-height": _modalMaxHeight});
}