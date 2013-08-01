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
    _selectedCourse = Session.get("selectedCourse");
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
    "click #front": function(e, template) {
        console.log("e", e);
        console.log("this", this);
        if ((e.target.className && e.target.className !== "editableImage")) {
            $(".flashcardFront").focus();
        }
    },
    "click #back": function(e, template) {
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
    var _selectedCourse = Session.get("selectedCourse");
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
    _selectedId = $("#collection option:selected").val();
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
                $(".flashcardFront").html("");
                $(".flashcardBack").html("");
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

    invalids = [];
    if (!Session.get("newFrontPicture")) {
        Meteor.validations.checkIfEmptyDiv(".flashcardFront");
    }
    return !!(invalids.length === 0);
};

createNewFlashcard = function() {
    _isPublic = ($("#public").val() === "true") ? true : false;
    var _newFlashcard = {
        "public": _isPublic,
        "front": $("#front .flashcardFront").text(),
        "frontPicture": Session.get("newFrontPicture") || null,
        "back": $("#back .flashcardBack").text(),
        "backPicture": Session.get("newBackPicture") || null,
        "course": $("#course").val(),
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
    return _newFlashcard;
};

Template.publicGroup.rendered = function() {
    $('#public').parent().bootstrapSwitch().on('switch-change', function(e, data) {
        $("#public").val(data.value);
    });
};


Template.flashcardForm.rendered = function() {
    if (Session.get("selectedCourse")) {
        $("#coursesControlGroup").hide();
    }
};

Template.flashcardForm.destroyed = function() {
    Session.set("newBackPicture", "");
    Session.set("newFrontPicture", "");
};