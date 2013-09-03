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

    if (_course) {
        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
        _lesson = _course.lessons[_lessonIndex];
        console.log("are we getting back here to render?");
        _query = {lessonId: _lesson._id, onlyAdmin: true, adminIds: _course.admins};
        _query.adminIds.push(Meteor.userId());
        Session.set("_optionsQuery", _query);
        _flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
        _firstOpened = false;
    }

    setTimeout(function () {
        Meteor.tabs.setHeight();
//        var _courseTab = Session.get("courseTab");
        var _lessonTab = Session.get("lessonTab", _lessonTab);
        console.log("lessonTab", _lessonTab);
        $('.nav a[href="' + _lessonTab + '"]').tab('show');
    }, 500);
}

Template.lesson.destroyed = function() {
    Session.set("lessonTab", "");
}

Template.lesson.rendered = function () {
//    _course = Courses.findOne({_id: Session.get("selectedCourse")});
//
    if (!_course) {
        _course = Courses.findOne({_id: Session.get("selectedCourse")});
        if (_course) {
            var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
            _lesson = _course.lessons[_lessonIndex];
            console.log("are we getting back here to render?");
            _query = {lessonId: _lesson._id, onlyAdmin: true, adminIds: _course.admins};
            _query.adminIds.push(Meteor.userId());
            Session.set("_optionsQuery", _query);
            _flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
            _firstOpened = false;
        }
    }
}

Template.flashcardsOptions.studentsFlashcardsCount = function () {
    var _flashcards = _getFlashcards(false, false);
    console.log("_flashcards", _flashcards);
    if (_flashcards) {
        return _flashcards.count();
    } else {
        return "";
    }
}

Template.flashcardsOptions.isShowStudentsFlashcards = function () {
    var _showStudentsFlashcards = Session.get("showStudentsFlashcards");
    return _showStudentsFlashcards;

}

Template.flashcardsOptions.teachersFlashcardsCount = function () {
    var _flashcards = _getFlashcards(true, false);
    console.log("_flashcards", _flashcards);
    if (_flashcards) {
        return _flashcards.count();
    } else {
        return "";
    }
}


Template.flashcardsOptions.flashcardsSelectedLength = function () {
    var _flashcardsSelected = Session.get("selectedFlashcards");
    if (_flashcardsSelected) {
        return _flashcardsSelected.length;
    }
    return 0;
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

        _query = {lessonId: _lesson._id, onlyAdmin: true, adminIds: _course.admins};
        console.log("setting the _query from hideStudents", _query);
        _query.adminIds.push(Meteor.userId());
//        _flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
        Session.set("_optionsQuery", _query);

    },
    "click .btn-showStudentsFlashcards": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("showStudentsFlashcards", true);
//        $(".btn-showStudentsFlashcards").removeClass("btn-showStudentsFlashcards").addClass("btn-hideStudentsFlashcards").html("Hide students flashcards");
//        $(".btn-addAll").html("Add students flashcards");
//        _flashcardSubscription.stop();
        _query = {lessonId: _lesson._id, onlyAdmin: false, adminIds: _course.admins};
        console.log("setting the _query from showStudents", _query);
//        _flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
        Session.set("_optionsQuery", _query);

    },
    "click .btn-addAll": function (e) {
//        _optionsQuery.addTeachersFlashcards = true;
        var _flashcards = _getFlashcards(true, false).fetch();
        if (_flashcards) {
            _flashcardsIds = _.pluck(_flashcards, '_id');
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
//            Meteor.call("addFlashcardsToCollection", _opts);
        }
    },
    "click .btn-addSelectedToCollection": function (e) {
//        var _flashcards = Session.get("selectedFlashcards");
        var _callOpts = {
            function: "addFlashcardsToCollection",
            arguments: {
                flashcardsIds: Session.get("selectedFlashcards"),
                courseId: Session.get("selectedCourse")
            },
            errorTitle: "Adding flashcards to learn schedule error",
            successTitle: "Added flashcards to course collection"
        }

        Meteor.myCall(_callOpts);

    },
    "click .btn-addFlashcardToLesson": function (e, template) {
        e.preventDefault();
        $("#newFlashcardModal").modal('show');
    },
    "click .btn-selectAll": function () {
        var _selectedFlashcards = [];
        $(".myFlashcardRow").each(function () {
            _selectedFlashcards.push($(this).data("id"))
        });
        Session.set("selectedFlashcards", _selectedFlashcards);
        _toggleFlashcardReload();
    },
    "click .btn-deSelectAll": function () {
        Session.set("selectedFlashcards", []);

        _toggleFlashcardReload();
    }

})

Template.withSelectedFlashcards.flashcardsSelectedLength = function () {
    var _flashcardsSelected = Session.get("selectedFlashcards");
    if (_flashcardsSelected) {
        return _flashcardsSelected.length;
    }
    return 0;
}


Template.lesson.destroyed = function () {
    Session.set("selectedFlashcards", "");
    Session.set("selectedCourse", "");
    if (_flashcardSubscription) {
        _flashcardSubscription.stop();
    }
    _firstOpened = true;
}

Template.lesson.courseName = function () {
    _course = Courses.findOne({_id: Session.get("selectedCourse")});
    return _course ? _course.name : "";
}

Template.lesson.lessonName = function () {
    _course = Courses.findOne({_id: Session.get("selectedCourse")});
    var _lesson;
    if (_course) {
        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
        _lesson = _course.lessons[_lessonIndex];
    }
    return _lesson ? _lesson.name : "";
}

Template.lessonFlashcardsList.flashcard = function () {
    if (Session.get("_optionsQuery")) {
        console.log("Przeladowywujemy?");
        return _getFlashcards(false, true);
    }
}

_getFlashcards = function (addTeachersFlashcards, optionsQuery) {
    var _courseId = Session.get("selectedCourse");
    var _lessonId = Session.get("selectedLesson");
    var _optionsQuery = {};
    _course = Courses.findOne({_id: _courseId});
    if (_course) {
        var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), _lessonId);
        _lesson = _course.lessons[_lessonIndex];
//        if (optionsQuery === true) {
        _optionsQuery = Session.get("_optionsQuery") || {};
//        }
        if (_lesson) {
            _query = {public: true, "lessons.lesson": _lesson._id};
            _query._id = {$in: _lesson.flashcards};
            if ((optionsQuery === true && _optionsQuery.onlyAdmin === true) || addTeachersFlashcards === true) {
//                console.log("from here I'm guessing?");
                _query.user = {$in: _optionsQuery.adminIds};
//                _optionsQuery.addTeachersFlashcards = false;
            }
            return Flashcards.find(_query);
        }
    }
//    return [];
}

Template.flashcardsOptions.rendered = function () {
//    $('#onlyByTeacher').parent().bootstrapSwitch();
}

Template.flashcardRow.rendered = function () {
    var _selectedFlashcards = Session.get("selectedFlashcards");
    console.log("how often? ", this.data._id);
    if ($.inArray(this.data._id, _selectedFlashcards) > -1) {
        console.log("got it from here", this.data._id, "selectedFlashcards", _selectedFlashcards);
        var _row = this.find(".myFlashcardRow");
        $(_row).addClass("flashcardSelected")
        var _button = this.find(".btn-selectFlashcard");
        $(_button).text("Deselect");
    }
}

Template.flashcardRow.upVotes = function () {
    return this.upVotes ? this.upVotes.length : "0";
}

Template.flashcardRow.downVotes = function () {
    return this.downVotes ? this.downVotes.length : "0";
}


Template.flashcardRow.events({
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
        console.log("click");
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