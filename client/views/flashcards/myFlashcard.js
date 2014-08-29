var _flashcard;

Template.myFlashcard.created = function () {

}

Template.myFlashcard.flashcard = function() {
    _flashcard = Flashcards.findOne({_id: this.flashcard});
    console.log("_flashcard")
    if (_flashcard) {
        return _flashcard;
    }
    else {
        return {comments: []};
    }
}
Template.myFlashcard.upVotes = function () {
    _flashcard = Flashcards.findOne({_id: this.flashcard});
    if (_flashcard) {
        return _flashcard.upVotes;
    }
    return [];

}

Template.myFlashcard.downVotes = function () {
    _flashcard = Flashcards.findOne({_id: this.flashcard});
    if (_flashcard) {
        return _flashcard.downVotes;
    }
    return [];
}

Template.myFlashcard.currentItemFront = function () {

    var _optsFront = {
        side: this.personalFront,
        note: this.frontNote,
        picture: this.personalFrontPicture
    }
    return Meteor.flashcard.showSide(_optsFront);

}

Template.myFlashcard.currentItemBack = function () {

    var _optsBack= {
        side: this.personalBack,
        note: this.backNote,
        picture: this.personalBackPicture
    }
    return Meteor.flashcard.showSide(_optsBack);

}

Template.myFlashcard.nextRepetition = function () {
    var _now = moment();
    if (_now.valueOf() >= this.nextRepetition.valueOf()) {
        return "Today";
    }
    else {
        return new moment(this.nextRepetition).fromNow();
    }
}

Template.myFlashcard.flashcardSelected = function () {
    console.log("selected in fS", _selected);
    return (_selected === true)
//    return ($.inArray(this._id, Session.get("selectedFlashcards")) > -1);
}

Template.myFlashcard.events({
    "click .badge-upVote": function(e) {
        e.preventDefault();
        e.stopPropagation();
        _opts = {
            flashcardId: this.flashcard
        }
        Meteor.call("flashcardVoteUp", _opts);
    },
    "click .badge-downVote": function(e) {
        e.preventDefault();
        e.stopPropagation();
        _opts = {
            flashcardId: this.flashcard
        }
        console.log("downVotes opts", _opts);
        Meteor.call("flashcardVoteDown", _opts);
    },
    "click .showAnswer": function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".showAnswer."+this._id).hide();
        $(".flashcard.back."+this._id).show();
    },
    "click .clickable": function (e) {
        console.log("are we seeing this clickable?");
        e.preventDefault();
        e.stopPropagation();
    },

    "click .btn-editFlashcard": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
//        Session.get("currentItemId");
        Session.set("currentItemId", this._id);
        Session.set("currentFlashcardId", this.flashcard);
        Meteor.theBrain.modals.editFlashcardModal();
//
//        $("#editFlashcardModal").modal("show").on("show", function() {
//            console.log("set to false");
//            Session.set("noRender", false);
//        }).on("hidden", function() {
//                console.log("set to true");
//                Session.set("noRender", true);
//            });
    },
    "click .btn-historyFlashcard": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("currentItemId", this._id);
        Meteor.theBrain.modals.flashcardHistory();
    },
    "click .btn-commentsFlashcard": function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("currentItemId", this._id);
        console.log("btn this.flashcard", this.flashcard);
        Session.set("currentFlashcardId", this.flashcard);
        Meteor.theBrain.modals.commentsFlashcard();
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
    }
})

_toggleFlashcard = function (flashcardId) {
    var _selectedFlashcards = Session.get("selectedFlashcards") || [];
    var _flashcardPosition = $.inArray(flashcardId, _selectedFlashcards);
    if (_flashcardPosition > -1) {
        _selectedFlashcards.splice(_flashcardPosition, 1);
        Session.set("selectedFlashcards", _selectedFlashcards);
        return true;
    }
    else {
        _selectedFlashcards.push(flashcardId);
        Session.set("selectedFlashcards", _selectedFlashcards);
        return false;
    }
}

Template.myFlashcard.isFlashcardSelected = function() {
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

Template.myFlashcard.isFlashcardSelectedButton = function() {
    var _selectedFlashcards = Session.get("selectedFlashcards");
    if ($.inArray(this._id, _selectedFlashcards) > -1) {
        return "Deselect";
    }
    return "Select";
}


Template.myFlashcard.rendered = function () {
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

Template.myFlashcard.reloadFlashcard = function () {
    console.log("in myFlashcard.reloadFlashcard");
    if (Session.get("reloadFlashcards")) {
        return true;
    }
    else {
        return false;
    }
}

Template.myFlashcard.destroyed = function() {
    Session.set("currentItemId", null);
    Session.set("currentFlashcardId", null);
}