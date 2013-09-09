Template.collectionGroup.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
};

Template.flashcardForm.course = function() {
    //return Courses.find({$or: [{admins: Meteor.userId()}, {public: true}]});
    // You don't need to specify. You should not see any more courses anyway
    return Courses.find();
};

Template.flashcardForm.lesson = function() {
    var _selectedCourse, _course;
    _selectedCourse = Session.get("selectedCourse") || Session.get("selectedCourseInForm");
    if (_selectedCourse) {
        _course = Courses.findOne({
            _id: _selectedCourse
        });
    }
    return _course ? _course.lessons : [];
}

Template.flashcardForm.newFrontPicture = function() {
    _newFrontPicture = Session.get("newFrontPicture");
    if (_newFrontPicture) {
        return _newFrontPicture;
    }
    return false;
}

Template.flashcardForm.newBackPicture = function() {
    _newBackPicture = Session.get("newBackPicture");
    if (_newBackPicture) {
        return _newBackPicture;
    }
    return false;
}


Template.flashcardForm.events({
    "click .btn-collectionModal": function(e, template) {
        e.preventDefault();
        $('#newCollectionModal').modal('show');
    },
    "click .btn-addPictureToFront": function(e, template) {
        e.preventDefault();
        filepicker.pick({
                mimetypes: ['image/*'],
                container: 'modal',
                services: ['COMPUTER', 'FACEBOOK', 'GMAIL', 'INSTAGRAM', 'WEBCAM', 'URL']
            },
            function(InkBlob) {
                Session.set("newFrontPicture", InkBlob.url);
                Meteor.popUp.success("Front picture added", "TheBrain made the neural connection changes you asked for");

            },
            function(FPError) {
                Meteor.popUp.error("TheBrain is confused", FPError.toString());
            }
        );
    },
    "click .btn-addPictureToBack": function(e, template) {
        e.preventDefault();
        filepicker.pick({
                mimetypes: ['image/*'],
                container: 'modal',
                services: ['COMPUTER', 'FACEBOOK', 'GMAIL', 'INSTAGRAM', 'WEBCAM', 'URL']
            },
            function(InkBlob) {
                Session.set("newBackPicture", InkBlob.url);
                Meteor.popUp.success("Back picture added", "TheBrain made the neural connection changes you asked for");

            },
            function(FPError) {
                Meteor.popUp.error("TheBrain is confused", FPError.toString());
            }
        );
    },
    "click #newFront": function(e, template) {
        console.log("e", e);
        console.log("this", this);
        if ((e.target.className && e.target.className !== "editableImage")) {
            $(".flashcardFront").focus();
        }
    },
    "click #newBack": function(e, template) {
        if ((e.target.className && e.target.className !== "editableImage"))  {
            $(".flashcardBack").focus();
        }
    }
});

Template.flashcardButtons.events({
    "click .btn-showAdvanced": function(e, template) {
        e.preventDefault();
        $(".btn-showAdvanced").attr("disabled", true).html("Loading...");
        $("#advancedSettings").slideDown(400,
            "easeInOutCubic",
            function() {
            $(".btn-showAdvanced").attr("disabled", false)
                .html("Hide advanced settings")
                .removeClass("btn-showAdvanced")
                .addClass("btn-hideAdvanced");
            $(".btn-hideAdvanced").switchClass("btn-primary-reversed", "btn-primary-main", 400);
        });
    },
    "click .btn-hideAdvanced": function(e, template) {
        e.preventDefault();
        $(".btn-hideAdvanced").attr("disabled", true).html("Unloading...");
        $("#advancedSettings").slideUp(400,
            "easeInOutCubic",
            function() {
            $(".btn-hideAdvanced").attr("disabled", false)
                .html("Show advanced settings")
                .removeClass("btn-hideAdvanced")
                .addClass("btn-showAdvanced");
            $(".btn-showAdvanced").switchClass("btn-primary-reversed", "btn-primary-main", 400);
        });
    },
    "click .btn-submit": function(e, template) {
        e.preventDefault();
        addFlashcard(e);
    }
});

Template.collectionGroup.selectIfNewOrMain = function() {
    var _newCollectionName = Session.get("newCollectionName");
    if (_newCollectionName) {
        return this.name === _newCollectionName ? "selected" : "";
    } else {
        return this.name === "Main collection" ? "selected" : "";
    }
};

Template.flashcardForm.selectIfSelectedCourse = function() {
    var _selectedCourse = Session.get("selectedCourse") || Session.get("selectedCourseInForm");
    if (_selectedCourse) {
        return this._id === _selectedCourse ? "selected" : "";
    }
    return "";

};

Template.flashcardForm.selectIfSelectedLesson = function() {
    var _selectedLesson = Session.get("selectedLesson");
    if (_selectedLesson) {
        return this._id === _selectedLesson ? "selected" : "";
    }
    return "";
}

Template.collectionGroup.rendered = function() {
    $("#collection.select2").select2();
    var _selectedId = $("#collection option:selected").val();
    $("#collection").select2("val", _selectedId);



}

addFlashcard = function(e) {
    $(e.target).attr("disabled", true).html("Checking...");
    Meteor.validations.clearErrors();
    if (validateNewFlashcard()) {
        newFlashcard = createNewFlashcard();
        var _isOk = false;
        var result = false;
        result = Meteor.call('newFlashcard', newFlashcard, function(error, id) {
            if (error) {
                Meteor.popUp.error("Flashcard adding server error", error.reason);
            } else {
                _isOk = true;
                Meteor.popUp.success("Flashcard added", "TheBrain made neural connections you asked for.");
                $("#newFront").children(".flashcardFront").html("");
                $("#newBack").children(".flashcardBack").html("");
                Session.set("newBackPicture", "");
                Session.set("newFrontPicture", "");

            }
        });
    } else {
        Meteor.validations.markInvalids();
        Meteor.popUp.error("TheBrain is confused", "Make sure you filled at least the front of your flashcard!");
    }
    $(e.target).removeAttr("disabled").html("Add Flashcard");
};

validateNewFlashcard = function() {

    var invalids = [];
    if (!Session.get("newFrontPicture")) {
        Meteor.validations.checkIfEmptyDiv(".flashcardFront");
    }
    return !!(invalids.length === 0);
};

createNewFlashcard = function() {
    var _isPublic = ($("#public").val() === "true") ? true : false;
    var _front = $("#newFront .flashcardFront").justtext();

    $.each($("#newFront .flashcardFront").children(), function(key, value) {
        _front = _front + "\n" + $(value).text()
    })

    var _back = $("#newBack .flashcardBack").justtext();

    $.each($("#newBack .flashcardBack").children(), function(key, value) {
        _back = _back + "\n" + $(value).text()
    })

//    console.log("_front", _front);


    ////    console.log("value", $(value).text()) })
//    $("#newFront .flashcardFront").children().forEach(function(child) {
//        _front = _front + "&#13;&#10;" + child.text();
//    })
    var _newFlashcard = {
        "public": _isPublic,
        "front": _front || null,
        "frontPicture": Session.get("newFrontPicture") || null,
        "back": _back || null,
        "backPicture": Session.get("newBackPicture") || null,
//        "course": $("#course").val(),
        "lesson": $("#lesson").val(),
        "collection": $("#collection").val(),
        "source": {
            "youtube": $("#youtubeSource").val(),
            "wikipedia": $("#wikipediaSource").val(),
            "link": $("#linkSource").val(),
            "khan": $("#khanSource").val(),
            "other": $("#otherSource").val()
        }
    };
    var _course = $("#course").val();
    if (_course && _course != "Don't add to any courses") {
        _newFlashcard.course = _course;
    }
    return _newFlashcard;
};

Template.publicGroup.rendered = function() {
    $('#public').parent().bootstrapSwitch().on('switch-change', function(e, data) {
        $("#public").val(data.value);
    });
};


var _renderer;
Template.flashcardForm.rendered = function() {
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function() {
    $("#lesson.select2").select2();
    $("#course.select2").select2().on("change", function(e) {
        Session.set("selectedCourseInForm", e.val);
    });
    if (Session.get("selectedCourse")) {
        $("#coursesControlGroup").hide();
    }
    }, 100);

//    var _selectedCourseId = $("#lesson option:selected").val();
//    var _selectedCourseId = $("#course").select2("val");
//    var _selectedLessonId
////    var _selectedLessonId = $("#course option:selected").val();
//    $("#course").select2("val", _selectedCourseId);
//    $("#lesson").select2("val", _selectedLessonId);
};

Template.flashcardForm.destroyed = function() {
    Session.set("newBackPicture", "");
    Session.set("newFrontPicture", "");
    Session.set("newCollectionName", "");
    Session.set("selectedCourseInForm", "");
    Session.set("selectedLesson", "");
};