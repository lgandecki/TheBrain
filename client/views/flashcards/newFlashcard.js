Template.collectionGroup.collection = function () {
    return Meteor.user() ? Meteor.user().collections : [];
};

Template.flashcardForm.course = function () {
    //return Courses.find({$or: [{admins: Meteor.userId()}, {public: true}]});
    // You don't need to specify. You should not see any more courses anyway
    return Courses.find();
};

Template.flashcardForm.lesson = function () {
    var _selectedCourse, _course;
    _selectedCourse = Session.get("selectedCourse");
    if (_selectedCourse) {
        _course = Courses.findOne({_id: _selectedCourse});
    }
    return _course ? _course.lessons : [];
}

Template.flashcardForm.events({
    "click .btn-collectionModal": function (e, template) {
        e.preventDefault();
        $('#newCollectionModal').modal('show');
    }
});

Template.flashcardButtons.events({
    "click .btn-showAdvanced": function (e, template) {
        e.preventDefault();
        $(".btn-showAdvanced").attr("disabled", true).html("Loading...");
        $("#advancedSettings").slideDown(function () {
            $(".btn-showAdvanced").attr("disabled", false)
                .html("Hide advanced settings")
                .removeClass("btn-showAdvanced")
                .addClass("btn-hideAdvanced");
        });
    },
    "click .btn-hideAdvanced": function (e, template) {
        e.preventDefault();
        $(".btn-hideAdvanced").attr("disabled", true).html("Unloading...");
        $("#advancedSettings").slideUp(function () {
            $(".btn-hideAdvanced").attr("disabled", false)
                .html("Show advanced settings")
                .removeClass("btn-hideAdvanced")
                .addClass("btn-showAdvanced");
        });
    },
    "click .btn-submit": function (e, template) {
        e.preventDefault();
        addFlashcard(e);
    }
});

Template.collectionGroup.selectIfNewOrMain = function () {
    var _newCollectionName = Session.get("newCollectionName");
    if (_newCollectionName) {
        return this.name === _newCollectionName ? "selected" : "";
    } else {
        return this.name === "Main collection" ? "selected" : "";
    }
};

Template.flashcardForm.selectIfSelectedCourse = function () {
    var _selectedCourse = Session.get("selectedCourse");
    if (_selectedCourse) {
        return this._id === _selectedCourse ? "selected" : "";
    }
    return "";

};

Template.flashcardForm.selectIfSelectedLesson = function () {
    var _selectedLesson = Session.get("selectedLesson");
    if (_selectedLesson) {
        return this._id === _selectedLesson ? "selected" : "";
    }
    return "";    
}

Template.collectionGroup.rendered = function() {
    console.log("collectionGroup rendered");
    $("#collection.select2").select2();
    _selectedId = $("#collection option:selected").val();
    $("#collection").select2("val", _selectedId);

}

addFlashcard = function (e) {
    $(e.target).attr("disabled", true).html("Checking...");
    Meteor.validations.clearErrors();
    if (validateNewFlashcard()) {
        newFlashcard = createNewFlashcard();
        var _isOk = false;
        var result = false;
        result = Meteor.call('newFlashcard', newFlashcard, function (error, id) {
            if (error) {
                Meteor.popUp.error("Flashcard adding server error", error.reason);
            }
            else {
                _isOk = true;
                Meteor.popUp.success("Flashcard added", "TheBrain made neural connections you asked for.");
                $("#front").val("");
                $("#back").val("");
            }
        });
        console.log("result ? " + result);
    }
    else {
        Meteor.validations.markInvalids();
        Meteor.popUp.error("TheBrain is confused", "Make sure you filled all the required fields!");
    }
    $(e.target).removeAttr("disabled").html("Add Flashcard");
};

validateNewFlashcard = function () {

    invalids = [];
    Meteor.validations.checkIfEmpty("#front");
    return !!(invalids.length === 0);
};

createNewFlashcard = function () {
    _isPublic = ($("#public").val() === "true") ? true : false;
    var _newFlashcard = {
        "public": _isPublic,
        "front": $("#front").val(),
        "back": $("#back").val(),
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
    $('#public').parent().bootstrapSwitch().on('switch-change', function(e, data){
        console.log("data.value", data.value);
        $("#public").val(data.value);
    });
}


Template.flashcardForm.rendered = function() {
    if (Session.get("selectedCourse")) {
        $("#coursesControlGroup").hide();
    }
}
