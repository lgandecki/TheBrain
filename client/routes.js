Meteor.Router.add({

    '/': 'home'

    , '/newFlashcard': "newFlashcard"

    , '/repeat': "repeat"

    , '/learnAndRepeat': function() {
        Session.set("showScheduleModal", true);
        return "repeat";
    } 

    , '/myCourses': "myCourses"

    , '/course/:id': function(id) {
        Session.set("selectedCourse", id);
//        if (!Session.get("selectedCourseTab")) {
//            console.log("We are doing this for some reason " + Session.get("selectedCourseTab"));
            Session.set("selectedCourseTab", "#events");
//        }
        return "course";
    }

    , '/courseLessons/:id': function(id) {
        Session.set("selectedCourse", id);
//        if (!Session.get("selectedCourseTab")) {
//            console.log("We are doing this for some reason " + Session.get("selectedCourseTab"));
        Session.set("selectedCourseTab", "#events");
//        }
        return "courseLessons";
    }

    , '/myCollections': function() {
        return "myCollections";
    }

    , '/login': function() {
        return "login";
    }

    , "/loading": function() {
        return "loading";
    }


});

Meteor.Router.filters({
    "postLoad": function (page) {


                        console.log("So we end up doing this twice ", page);
                var _tran = $("#transition")
                    , _html = _tran.html()
                    , _off = _tran.offset()
                    , _width = _tran.width()
                    , _prev = null
                    , _easing = "easeInOutCubic";

                if (_html && $(".previousPage").length === 0 && !Meteor.loggingIn()) {
                    _prev = $("<div class='previousPage'/>").html(_html).css({ "z-index": 0, position: "absolute", left: _off.left + "px", top: _off.top + "px", width: _width + "px" });
                    $(document.body).append(_prev);
                    _tran.hide();
                }

                setTimeout(function () {


                        if (_prev) {
                            _prev.animate({ "left": ((_width + _off.left) * -1) + "px" }, 1100, _easing, function() {
                                _prev.remove();
                            });
                        }
                          console.log("_width " + _width);
                        $("#transition").css({ "left": _width + 40 + "px" }).show()
                             .animate({ "left": "0" }, 1100, _easing, function() {
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

        }
        else if (Meteor.userId()) {

             return page;
        } else {
            return "login";
        }
        
    }
});

console.log("Loading postLoad");

Meteor.Router.filter('postLoad');