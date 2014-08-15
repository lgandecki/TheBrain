Router.configure({
    layoutTemplate: 'body'
});

var _timePassedSinceLast = 0;
var _routes = [
    {name: "home", path: "/"},
    {name: "home", path: "/home"},
    {name: "login", path: "/login"},
    {name: "loading", path: "/loading"},
    {name: "availableFlashcards", path: "/availableFlashcards"},
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
        onBeforeAction: function() {
            Session.set("selectedCourse", "");
        }
    });

    this.route('repeat', {
        path: '/study',
        onBeforeAction: function () {
            Session.set("showScheduleModal", true);
        }
    });

    this.route('myCollectionsFlashcards', {
        path: '/myCollection/:id',
        onBeforeAction: function () {
            Session.set("selectedCollection", this.params.id);
        }
    });

    this.route('myCourses', {
        path: '/myCourses',
        onBeforeAction: function () {
            Session.set("coursePath", "/myCourses");
        }
    })

    this.route("enrolledCourses", {
        path: "/enrolledCourses",
        onBeforeAction: function () {
            Session.set("coursePath", "/enrolledCourses");
        }
    })

    this.route("course", {
        path: "/course/:id",
        onBeforeAction: function () {
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
        onBeforeAction: function () {
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
        onBeforeAction: function () {
            Session.set("coursePath", "/availableCourses");
        }
    })

    this.route("lesson", {
        path: "/lesson/:courseId/:lessonId",
        onBeforeAction: function () {
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

    this.route("videoLesson", {
        path: "/videoLesson/:courseId/:youtubeId",
        onBeforeAction: function() {
            Session.set("selectedCourse", this.params.courseId);
            Session.set("youtube_id", this.params.youtubeId);
      }
    })

    this.route("conversation", {
        path: "/conversation/:otherUser",
        onBeforeAction: function () {
            Session.set("otherUser", this.params.otherUser);
        }
    })

    this.route("khanVideo", {
        path: "/khanVideo/:playlistSlug/:videoSlug/:youtube_id",
        waitOn: function() {
            Meteor.subscribe("khanPlaylist", this.params.playlistSlug);
        },
        onBeforeAction: function () {
            Session.set("playlistSlug", this.params.playlistSlug);
            Session.set("videoSlug", this.params.videoSlug);
            Session.set("youtube_id", this.params.youtube_id);
            var _youtube_id = Session.get(this.params.youtube_id);
            var _opts = {
                youtube_id: _youtube_id
            }

            console.log("doing subscription again");
            _youtubeFlashcardsHandle = Meteor.subscribeWithPagination("youtubeFlashcards", _opts, 10);
//            setTimeout(function() {
//                $('a[href="#khanVideo"]').tab('show');
//            }, 500);
//            setTimeout(function() {
//                $('a[href="#khanVideo"]').tab('show');
//            }, 50);
//            setTimeout(function() {
//                $('a[href="#khanVideo"]').tab('show');
//            }, 100);
        }
    })

    this.route("flashcard", {
        path: "/flashcard/:flashcardId",
        waitOn: function() { return Meteor.subscribe('currentFlashcard', this.params.flashcardId)},
        onBeforeAction: function () {
            Session.set("flashcardId", this.params.flashcardId);
        }
    })

    this.route('notFound', {
        path: '*'
    });

});
var _enoughTimePassedSinceLastTransition = function() {
    var _now = new Date().valueOf();
    return (_now - _timePassedSinceLast > 400);
}


Router.onBeforeAction(function() {
    if ($(".transition").length > 0) {
        _setMenuActive();
    } else {
        setTimeout(function() {
                _setMenuActive();
        }, 500);
    }
});

var _setMenuActive = function() {
    $('li.active').removeClass('active');
    var _currentRoute = window.location.pathname;
    if (_currentRoute === "/home" || _currentRoute === "/login") {
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
}

Router.onBeforeAction(function (pause) {
    var _randomLogNumber = Math.random();
    var _name = this.route.name;
    console.log("in onBeforeAction");

    $("html, body").animate({
        scrollTop: 0
    }, 100);

    var _tran = $(".transition"),
        _html = _tran.html(),
        _off = _tran.offset(),
        _originalWidth = _tran.width(),
        _prev = null,
        _easing = "easeInOutBack";
    var _width = $(window).width()/1.2;

    if (_html && _off && !Meteor.loggingIn() && _enoughTimePassedSinceLastTransition() ) {
        console.log("robimy to przejscie");
        _timePassedSinceLast = new Date().valueOf();
        if (_off.top === 0) {
        }
        var _cssObject = {
            "z-index": 0,
            position: "absolute",
            left: _off.left + "px",
            top: _off.top + "px",
//            top: "0px",
            width: _originalWidth + "px"
        };
        _prev = $("<div class='previousPage'/>").html(_html).css(_cssObject);
        $(document.body).append(_prev);

        $(".transition").stop(true, true).hide().css({
            "left": _width + "px"
        });


        setTimeout(function () {
            if ($(".transition").length > 0) {

//            $(".transition").css({"left": _width + "px"});

                $(".transition").show()
                    .animate({
                        "left": "0px"
                    }, 1200, _easing, function () {

                    });
            }





            if (_prev) {
                var _left =(_width  * -1);
                _prev.animate({
                    "left":  _left + "px"
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
//            resizeContent();


//            makeModalsScrollable();

            setTimeout(function () {
                if (!$(".transition").is(":visible")) {
                    console.log("TRANSITION WAS NOT VISIBLE SO manually displayed it");
                    $(".transition").show().css("left", 0);
                }
            }, 300);

        }, 500);


    } else {
        setTimeout(function () {
            if (!$(".transition").is(":visible")) {
                console.log("TRANSITION WAS NOT VISIBLE SO manually displayed it");
                $(".transition").css("left", _width).show()
                    .animate({
                        "left": "0px"
                    }, 1200, _easing, function () {

                    });
            }
        }, 1000);
    }




//    if (window.woopra) {
//        var _user = Meteor.user();
//
//
//        if (_user) {
//            if (_user.identity) {
//                var _email = _user.emails && _user.emails[0] && _user.emails[0].address;
//                window.woopra.identify({
//                    email: _email || _user._id,
//                    name: _user.identity.nick,
//                    avatar: _user.profile && _user.profile.picture
//                })
//            } else {
//                setTimeout(function() {
//                    var _user = Meteor.user();
//                    var _email = _user.emails && _user.emails[0] && _user.emails[0].address;
//                    window.woopra.identify({
//                        email: _email || _user._id,
//                        name: _user.identity && _user.identity.nick || _user._id,
//                        avatar: _user.profile && _user.profile.picture
//                    })
//
//                }, 500);
//            }
//
//        }
//        window.woopra.track();
//    }

    if (window.ga) {
        window.ga('send', 'pageview', window.location.pathname);
    }
    else {
        setTimeout(function () {
                window.ga && window.ga('send', 'pageview', window.location.pathname);
        }, 300);
    }



    $(".dropdown-menu").hide('normal', "easeInOutCubic");


    if (!(_name === "policy" || _name === "login" || _name === "loading")) {
        if (Meteor.loggingIn()) {
            console.log("loading");
            this.render("loading");

        } else if (Meteor.userId() || Session.get("exploreMode") || _name === "policy") {
            console.log("logged in", _name);

        } else if (_name === "home") {
            console.log("show login");
            this.render("login");
            pause();

        } else {
            var _location = window.location.href.toString();
            console.log("location", _location.indexOf("_escaped_fragment"));
            console.log("location2", _location);
            if (!Session.get("exploreModeOnModal") && _location.indexOf("_escaped_fragment") === -1) {
                Session.set("exploreModeOnModal", true);
                setTimeout(function() {
                    var workInProgressModal = {
                        template: Template.workInProgressReactiveModal,
                        title: "Not logged in!",
                        buttons: {
                            "ok": {
                                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                                class: 'btn btn-primary btn-primary-main',
                                label: 'Got ya!'
                            }

                        }
                    };

                    var rd = ReactiveModal.initDialog(workInProgressModal);
                    rd.buttons.ok.on('click', function(button) {
                        console.log("clicked in modal");
                    });

                    rd.show();
                }, 1000);

            }
        }
    }



});


var makeModalsScrollable = function () {
    console.log("window height", $(window).height())
    var _modalMaxHeight = $(window).height() - 80;
    $(".modal-box").css({"max-height": _modalMaxHeight});
}
