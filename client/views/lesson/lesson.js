var _course, _lesson, _flashcardSubscription, _firstOpened;

Deps.autorun(function () {
    var _lessonTab = Session.get("lessonTab");
    setTimeout(function () {
        Meteor.tabs.setHeight();
//        var _courseTab = Session.get("courseTab");
        console.log("lessonTab", _lessonTab);
        $('.nav a[href="' + _lessonTab + '"]').tab('show');
    }, 50);
    setTimeout(function () {
        Meteor.tabs.setHeight();
//        var _courseTab = Session.get("courseTab");
        console.log("lessonTab", _lessonTab);
        $('.nav a[href="' + _lessonTab + '"]').tab('show');
    }, 500);
})


Template.lesson.created = function () {
//    _firstOpened = true;
    Session.set("showStudentsFlashcards", false);
    Session.set("lessonTab", "#lessonFlashcards");

    _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _lessonId = Session.get("selectedLesson");
    console.log("Course in created", _course);
    if (_course && _lessonId) {
        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
        _lesson = _course.lessons[_lessonIndex];
        Session.set("_lesson", _lesson);
        console.log("are we getting back here to render?");
        _query = {lessonId: _lesson._id, courseId: Session.get("selectedCourse"), onlyAdmin: true, adminIds: _course.admins};
        _query.adminIds.push(Meteor.userId());
        Session.set("_optionsQuery", _query);
        _flashcardSubscription = Meteor.subscribeWithPagination("lessonFlashcards", _query, 10);
        _firstOpened = false;
    }
    else {
        console.log("WHAT THE F!");
    }

    setTimeout(function () {
        Meteor.tabs.setHeight();
//        var _courseTab = Session.get("courseTab");
        var _lessonTab = Session.get("lessonTab", _lessonTab);
        console.log("lessonTab", _lessonTab);
        $('.nav a[href="' + _lessonTab + '"]').tab('show');
    }, 500);
}

Template.lesson.destroyed = function () {
//    Session.set("lessonTab", "");
//    Session.set("selectedFlashcards", "");
//    Session.set("selectedCourse", "");
//    Session.set("_lesson", "");
    if (_flashcardSubscription) {
        _flashcardSubscription.stop();
    }
    _firstOpened = true;
}


//
Template.lesson.rendered = function () {
//    _course = Courses.findOne({_id: Session.get("selectedCourse")});
//
    var _reloadFlashcards = Session.get("reloadFlashcards");
    console.log("back in lesson rendered");
    if (!_course) {
        _course = Courses.findOne({_id: Session.get("selectedCourse")});
        if (_course) {
            var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
            _lesson = _course.lessons[_lessonIndex];
            Session.set("_lesson", _lesson);
            console.log("are we getting back here to render?");
            _query = {lessonId: _lesson._id, courseId: Session.get("selectedCourse"), onlyAdmin: true, adminIds: _course.admins};
            _query.adminIds.push(Meteor.userId());
            Session.set("_optionsQuery", _query);
            _flashcardSubscription = Meteor.subscribeWithPagination("lessonFlashcards", _query, 10);
        }
    }
}

Template.flashcardsOptions.studentsFlashcardsCount = function () {
    var _lesson = Session.get("_lesson");
    if (_lesson && _lesson.studentsFlashcards) {
        return _lesson.studentsFlashcards.length;
    }
//    _course = Courses.findOne({_id: Session.get("selectedCourse")});
//    console.log("_course in students count", _course);
//    if (_course) {
//        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
//        _lesson = _course.lessons[_lessonIndex];
//        if (_lesson.studentsFlashcards) {
//        return _lesson.studentsFlashcards.length;
//        }
//    }
//    return 0;

}

Template.flashcardsOptions.isShowStudentsFlashcards = function () {
    var _showStudentsFlashcards = Session.get("showStudentsFlashcards");
    return _showStudentsFlashcards;

}

Template.flashcardsOptions.teachersFlashcardsCount = function () {
//    var _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _lesson = Session.get("_lesson");
    if (_lesson && _lesson.studentsFlashcards) {
        return _lesson.teacherFlashcards.length;
    }
    console.log("_course in teachers count", _course);
//    if (_course) {
//        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
//        _lesson = _course.lessons[_lessonIndex];
//        if (_lesson.teacherFlashcards) {
//            return _lesson.teacherFlashcards.length;
//        }
//    }
//    return 0;
}


Template.flashcardsDefaultOptions.flashcardsSelectedLength = function () {
    var _flashcardsSelected = Session.get("selectedFlashcards");
    if (_flashcardsSelected) {
        return _flashcardsSelected.length;
    }
    return 0;
}


Template.lesson.courseName = function () {
    _course = Courses.findOne({_id: Session.get("selectedCourse")});
    return _course ? _course.name : "";
}

Template.lesson.lessonName = function () {
    _lesson = Session.get("_lesson");
    return _lesson ? _lesson.name : "";
}

Template.lessonFlashcardsList.events({
    'click .btn-loadMore': function (e) {
        e.preventDefault();
        _flashcardSubscription.loadNextPage();
    }
})

Template.lessonFlashcardsList.flashcard = function () {
    var _reload;
    if (Session.get("_optionsQuery") && _flashcardSubscription) {
        _reload = true;
        console.log("i co z subskrypcja?");

    }
    console.log("Przeladowywujemy?");
    _lesson = Session.get("_lesson");
    if (_lesson) {
        var _teacherFlashcards = _lesson.teacherFlashcards;
        var _studentsFlashcards = [];
//        if (!Session.get("_optionsQuery").onlyAdmin) {
//            _studentsFlashcards = _lesson.studentsFlashcards;
//        }
//        _flashcardIds = $.merge(_teacherFlashcards, _studentsFlashcards);
        _query = {
//            _id: {$in: _flashcardIds},
            public: true,
            "lessons.lesson": _lesson._id
        };
        if (_flashcardSubscription) {
            console.log("wrzucamy flashcardy", _query);
            return Flashcards.find(_query, {limit: _flashcardSubscription.limit(), sort: {score: -1}})
        }
        else {
            console.log("nie wrzucamy flashcardow");
        }


    }
}


Template.lessonFlashcardsList.helpers({
    flashcardsReady: function () {
        if (_flashcardSubscription) {

            return !_flashcardSubscription.loading();
        }
    },
    allFlashcardsLoaded: function () {
        if (_flashcardSubscription) {

            return !_flashcardSubscription.loading() &&
                Flashcards.find(_query).count() < _flashcardSubscription.loaded();
        }
    }
})


_getFlashcards = function (addTeachersFlashcards, optionsQuery) {
    return [];

}
//_getFlashcards = function (addTeachersFlashcards, optionsQuery) {
//    var _courseId = Session.get("selectedCourse");
//    var _lessonId = Session.get("selectedLesson");
//    var _optionsQuery = {};
//    _course = Courses.findOne({_id: _courseId});
//    if (_course) {
//        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), _lessonId);
//        _lesson = _course.lessons[_lessonIndex];
////        if (optionsQuery === true) {
//        _optionsQuery = Session.get("_optionsQuery") || {};
////        }
//        if (_lesson) {
//            _query = {public: true, "lessons.lesson": _lesson._id};
//            _query._id = {$in: $_lesson.flashcards};
//            if ((optionsQuery === true && _optionsQuery.onlyAdmin === true) || addTeachersFlashcards === true) {
////                console.log("from here I'm guessing?");
//                _query.user = {$in: _optionsQuery.adminIds};
////                _optionsQuery.addTeachersFlashcards = false;
//            }
//            console.log("query ", _query);
//            return Flashcards.find(_query);
//        }
//    }
////    return [];
//}
//
//Template.flashcardsOptions.rendered = function () {
////    $('#onlyByTeacher').parent().bootstrapSwitch();
//}

Template.flashcardRow.isFlashcardSelected = function () {
    var _selectedFlashcards = Session.get("selectedFlashcards");
    console.log("how often? ", this._id);
    if ($.inArray(this._id, _selectedFlashcards) > -1) {
//        console.log("got it from here", this.data._id, "selectedFlashcards", _selectedFlashcards);
        return "flashcardSelected";
//        var _button = this.find(".btn-selectFlashcard");
//        $(_button).text("Deselect");
    }
    return "";
}

Template.flashcardRow.isFlashcardSelectedButton = function () {
    var _selectedFlashcards = Session.get("selectedFlashcards");
    if ($.inArray(this._id, _selectedFlashcards) > -1) {
        return "Deselect";
    }
    return "Select";
}

Template.flashcardRow.rendered = function () {
    var _selectedFlashcards = Session.get("selectedFlashcards");
//    console.log("how often? ", this.data._id);
    if ($.inArray(this.data._id, _selectedFlashcards) > -1) {
        console.log("got it from here", this.data._id, "selectedFlashcards", _selectedFlashcards);
        var _row = this.find(".myFlashcardRow");
        $(_row).addClass("flashcardSelected")
        var _button = this.find(".btn-selectFlashcard");
        $(_button).text("Deselect");
    }
}

//Template.flashcardRow.upVotes = function () {
//    return this.upVotes ? this.upVotes.length : "0";
//}
//
//Template.flashcardRow.downVotes = function () {
//    return this.downVotes ? this.downVotes.length : "0";
//}


Template.flashcardRow.events({
    "click .badge-upVote": function (e) {
        e.preventDefault();
        e.stopPropagation();
        _opts = {
            flashcardId: this._id
        }
        Meteor.call("flashcardVoteUp", _opts);
    },
    "click .badge-downVote": function (e) {
        e.preventDefault();
        e.stopPropagation();
        _opts = {
            flashcardId: this._id
        }
        Meteor.call("flashcardVoteDown", _opts);
    },
    'click .btn-addToCollectionFlashcard': function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var _flashcardsIds = [];
        _flashcardsIds.push(this._id);

        var _callOpts = {
            function: "addFlashcardsToCollection",
            arguments: {
                flashcardsIds: _flashcardsIds,
                courseId: Session.get("selectedCourse")
            },
            errorTitle: "Adding flashcard to learn schedule error",
            successTitle: "Added flashcard to course collection"
        }

        Meteor.myCall(_callOpts);

    },
    "click .myFlashcardRow": function (e) {
        var _that = this;
        var _e = e.currentTarget;
        setTimeout(function () {
            if (_toggleFlashcard(_that._id)) {
                $(_e).removeClass("flashcardSelected");
                $(_e).find(".btn-selectFlashcard").text("Select");
//            $(".btn-selectFlashcard[data-id=" + this._id + "]").text("Select");
            }
            else {
                $(_e).addClass("flashcardSelected");
                $(_e).find(".btn-selectFlashcard").text("Deselect");
//            $(".btn-selectFlashcard[data-id=" + this._id + "]").text("Deselect");
            }
        }, 1);
    },
    "click .btn-selectFlashcard": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var _that = this;
        var _e = e.currentTarget;
        setTimeout(function () {
            if (_toggleFlashcard(_that._id)) {
                $(_e).closest(".myFlashcardRow").removeClass("flashcardSelected");
                $(_e).text("Select");
//            $(".btn-selectFlashcard[data-id=" + this._id + "]").text("Select");
            }
            else {
                $(_e).closest(".myFlashcardRow").addClass("flashcardSelected");
                $(_e).text("Deselect");
//            $(".btn-selectFlashcard[data-id=" + this._id + "]").text("Deselect");
            }
        }, 1);
    },
    "click .btn-editFlashcard": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
//        Session.get("currentItemId");
        Session.set("currentFlashcardId", this._id);
        $("#editFlashcardModal").modal("show");
    },

    "click .btn-commentsFlashcard": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("currentFlashcardId", this._id);
        $("#commentsFlashcardModal").modal("show");
    }
});

stripHtml = function (str) {
    return jQuery('<div />', { html: str }).text();
}

Template.flashcardRow.reloadFlashcard = function () {
    if (Session.get("reloadFlashcards")) {
        return true;
    }
    else {
        return false;
    }
}


Template.flashcardsOptions.events({
    "click .btn-hideStudentsFlashcards": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setTimeout(function () {
            Session.set("showStudentsFlashcards", false);
        }, 20);

//        setTimeout(function () {
//            $(".btn-hideStudentsFlashcards").addClass("btn-showStudentsFlashcards").removeClass("btn-hideStudentsFlashcards").html("Show students flashcards");
////            $(".btn-addAll").html("Add teachers flashcards");
//        }, 20);
//        _flashcardSubscription.stop();
//        console.log("hide students Flashcards click", _lesson);

        _lesson = Session.get("_lesson");
        if (_lesson) {
            _query = {lessonId: _lesson._id, courseId: Session.get("selectedCourse"), onlyAdmin: true, adminIds: _course.admins};
//            console.log("setting the _query from hideStudents", _query);
            _query.adminIds.push(Meteor.userId());
            //        _flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
            Session.set("_optionsQuery", _query);
            _flashcardSubscription.stop();
            _flashcardSubscription = Meteor.subscribeWithPagination("lessonFlashcards", _query, 10);
        }

    },
    "click .btn-showStudentsFlashcards": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("showStudentsFlashcards", true);
//        $(".btn-showStudentsFlashcards").removeClass("btn-showStudentsFlashcards").addClass("btn-hideStudentsFlashcards").html("Hide students flashcards");
//        $(".btn-addAll").html("Add students flashcards");
//        _flashcardSubscription.stop();
        _lesson = Session.get("_lesson");
        console.log("show students Flashcards click", _lesson);
        if (_lesson) {
            _query = {lessonId: _lesson._id, courseId: Session.get("selectedCourse"), onlyAdmin: false, adminIds: _course.admins};
            console.log("setting the _query from showStudents", _query);
            //        _flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
            Session.set("_optionsQuery", _query);
            _flashcardSubscription.stop();
            _flashcardSubscription = Meteor.subscribeWithPagination("lessonFlashcards", _query, 10);
        }

    },
    "click .btn-addAll": function (e) {
//        _optionsQuery.addTeachersFlashcards = true;
//        var _course = Courses.findOne({_id: Session.get("selectedCourse")});
        var _flashcards;
        _lesson = Session.get("_lesson");

        if (_lesson) {
            if (_lesson.teacherFlashcards) {
                _flashcards = _lesson.teacherFlashcards;
            }

            if (_flashcards) {
                var _flashcardsIds = _flashcards;
                var _callOpts = {
                    function: "addFlashcardsToCollection",
                    arguments: {
                        flashcardsIds: _flashcardsIds,
                        courseId: Session.get("selectedCourse")
                    },
                    errorTitle: "Adding flashcards to learn schedule error",
                    successTitle: "Added flashcards to course collection"
                }
                Meteor.myCall(_callOpts);
                Meteor.tour.showIfNeeded("clickHereToStudyTour");
//            Meteor.call("addFlashcardsToCollection", _opts);
            }
        }
    },

    "click .btn-addFlashcardToLesson": function (e, template) {
        e.preventDefault();
        $("#newFlashcardModal").modal('show');
    }


})


Template.flashcardsDefaultOptions.events({

    "click .btn-addAllInLesson": function (e) {
        var _lesson = Session.get("_lesson");
        if (_lesson.youtube_id) {
            var _callOpts = {
                function: "addVideoFlashcardsToCollection",
                arguments: {
                    youtube_id: Session.get("youtube_id"),
                    courseId: Session.get("selectedCourse")
                },
                errorTitle: "Adding flashcards to learn schedule error",
                successTitle: "Added flashcards to course collection"
            }
            Meteor.myCall(_callOpts);
        } else {

            if (_lesson.teacherFlashcards && _lesson.studentsFlashcards) {
                _flashcards = _lesson.teacherFlashcards.concat(_lesson.studentsFlashcards);
            }

            if (_flashcards) {
                var _flashcardsIds = _flashcards;
                var _callOpts = {
                    function: "addFlashcardsToCollection",
                    arguments: {
                        flashcardsIds: _flashcardsIds,
                        courseId: Session.get("selectedCourse")
                    },
                    errorTitle: "Adding flashcards to learn schedule error",
                    successTitle: "Added flashcards to course collection"
                }
                Meteor.myCall(_callOpts);
                Meteor.tour.showIfNeeded("clickHereToStudyTour");

//            Meteor.call("addFlashcardsToCollection", _opts);
            }

        }
    }
})

Template.flashcardsDefaultOptions.destroyed = function () {
//    Session.set("")
}

Template.flashcardsDefaultOptions.flashcardsAvailable = function () {
    var _lesson = Session.get("_lesson");
    var _count = 0;
    if (!_lesson) {
        _course = Courses.findOne({_id: Session.get("selectedCourse")});
        var _lessonId = Session.get("selectedLesson");
        console.log("Course in created", _course);
        if (_course && _lessonId) {
            var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
            _lesson = _course.lessons[_lessonIndex];
        }
    }
    if (_lesson.youtube_id) {
        _count = YoutubeVideoFlashcardsCount.findOne({_id: Session.get("youtube_id")});
    } else {
        if (_lesson.teacherFlashcards && _lesson.studentsFlashcards) {
            _count = _lesson.teacherFlashcards.length + _lesson.studentsFlashcards.length;
        }
    }
    return _count;
}