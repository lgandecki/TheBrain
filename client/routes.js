Router.configure({
    layoutTemplate: 'body'
});

var _routes = [
    {name: "home", path: "/"},
    {name: "login", path: "/login"},
    {name: "loading", path: "/loading"},
    {name: "availableFlashcards", path: "availableFlashcards"},
    {name: "repeat", path: "/repeat"},
    {name: "myCollections", path: "/myCollections"},
    {name: "myProfile", path: "/myProfile"},
    {name: "notificationCenter", path: "/notificationCenter"},
    {name: "calendar", path: "/calendar"},
    {name: "messageCenter", path: "/messageCenter"},
    {name: "flashcardsOptionsNew", path: "/flashcardsOptionsNew"},
    {name: "policy", path: "/policy"},
    {name: "khanPlaylists", path: "/khanPlaylists"}
]

Router.map(function () {
    var _that = this;
    _routes.forEach(function (route) {
        _that.route(route.name, {
            path: route.path
        })
    });

    this.route('myCollectionsFlashcards', {
        path: '/myFlashcards',
        onBeforeAction: function () {
            Session.set("selectedCollection", "");
        }
    });

    this.route('newFlashcard', {
        path: '/newFlashcard',
        before: function() {
            Session.set("selectedCourse", "");
        }
    });

    this.route('repeat', {
        path: '/study',
        before: function () {
            Session.set("showScheduleModal", true);
        }
    });

    this.route('myCollectionsFlashcards', {
        path: '/myCollection/:id',
        before: function () {
            Session.set("selectedCollection", this.params.id);
        }
    });

    this.route('myCourses', {
        path: '/myCourses',
        before: function () {
            Session.set("coursePath", "/myCourses");
        }
    })

    this.route("enrolledCourses", {
        path: "/enrolledCourses",
        before: function () {
            Session.set("coursePath", "/enrolledCourses");
        }
    })

    this.route("course", {
        path: "/course/:id",
        before: function () {
            Session.set("selectedCourse", this.params.id);
            Session.set("selectedCourseTab", "#events");
            var _id = this.params.id;
//            setTimeout(function () {
//                Session.set("selectedCourse", _id);
//            }, 800);
        }
    })

    this.route("courseLessons", {
        path: "/courseLessons/:id",
        before: function () {
            var _id = this.params.id;
            Session.set("selectedCourse", _id);
            //        if (!Session.get("selectedCourseTab")) {
            Session.set("selectedCourseTab", "#events");
            //        }
//            setTimeout(function () {
//                Session.set("selectedCourse", _id);
//            }, 800);
        }
    })

    this.route("availableCourses", {
        path: "/availableCourses",
        before: function () {
            Session.set("coursePath", "/availableCourses");
        }
    })

    this.route("lesson", {
        path: "/lesson/:courseId/:lessonId",
        before: function () {
            console.log("params in before", this);
            var _courseId = this.params.courseId;
            var _lessonId = this.params.lessonId;
            Session.set("selectedCourse", this.params.courseId);
            Session.set("selectedLesson", this.params.lessonId);
//            setTimeout(function () {
//                Session.set("selectedCourse", _courseId);
//                Session.set("selectedLesson", _lessonId);
//            }, 800);
        }
    })

    this.route("conversation", {
        path: "/conversation/:otherUser",
        before: function () {
            Session.set("otherUser", this.params.otherUser);
        }
    })

    this.route("khanVideo", {
        path: "/khanVideo/:playlistSlug/:videoSlug/:youtube_id",
        before: function () {
            Session.set("playlistSlug", this.params.playlistSlug);
            Session.set("videoSlug", this.params.videoSlug);
            Session.set("youtube_id", this.params.youtube_id);
        }
    })

});


var postLoad = function (page) {


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
                if (typeof ga !== 'undefined') {
                    ga('send', 'pageview', window.location.pathname);
                }
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

        setTimeout(function () {
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

    return _navigate(this);


}

var _navigate = function (req) {
    //no loading if we are doing an external site

//    req.render("login");
//    req.stop();
    var _name = req.route.name;
    if (_name === "login" && Meteor.userId()) {
        req.redirect("/");
    }
    if (!(_name === "policy" || _name === "login" || _name === "loading")) {
        if (Meteor.loggingIn()) {
            console.log("loading");
            req.render("loading");

        } else if (Meteor.userId() || Session.get("exploreMode") || _name === "policy") {
            console.log("logged in", _name);
            req.render(_name);
//        req.stop();
        } else {
            console.log("show login");
            req.redirect("login");
//        req.pause();
//        req.stop();
        }
    }
}

Router.onBeforeAction(postLoad);

Router.onAfterAction(function() {
    $('li.active').removeClass('active');
    var _currentRoute = window.location.pathname;
    if (_currentRoute === "/home") {
        _currentRoute = "/";
    }
    _currentRoute = "/" + _currentRoute.split("/")[1];
    switch (_currentRoute) {
        case '/lesson':
        case '/course':
            _currentRoute = Session.get("coursePath");
            break;
        case '/myCollection':
            _currentRoute = "/myCollections";
            break;
        case '/khanVideo':
            _currentRoute = "/khanPlaylists";
            break;
    }
//    console.log("currentRoute", _currentRoute);
    //var _link = Meteor.Router[_currentRoute + "Path"]();
    //var _element = $('a[href="'+_link+'"]');
    var _element = $('a[href="'+_currentRoute+'"]');
    _element.closest('li').addClass('active');
    _element.closest('li.topNav').addClass('active');
    Session.set("isNewPage", _currentRoute);
})
var makeModalsScrollable = function () {
    console.log("window height", $(window).height())
    var _modalMaxHeight = $(window).height() - ($(window).height() / 4) - 76;
    $(".modal-box").css({"max-height": _modalMaxHeight});
}