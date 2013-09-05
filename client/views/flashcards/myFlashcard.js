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
    var front = this.personalFront;


    if (this.frontNote) {
        front = front + "<br/><span class='note'>" + this.frontNote + "</span>";
    }


    var _frontPicture;
    if (this.personalFrontPicture) {
        _frontPicture = this.personalFrontPicture;
    }


    if (_frontPicture) {
        console.log("in front before ", front);
        front = '<a href="' + _frontPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + front + '"> \
        <img src="' + _frontPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="front" class="flashcardFront">' + front + '</div>';
        console.log("front after", front);
    }

    return front;
}

Template.myFlashcard.currentItemBack = function () {
    var back = this.personalBack;

    if (this.backNote) {
        back = back + "<br/><span class='note'>" + this.backNote + "</span>";
    }

    var _backPicture;
    if (this.personalBackPicture) {
        _backPicture = this.personalBackPicture;
    }

    if (_backPicture) {
        back = '<a href="' + _backPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + back + '"> \
        <img src="' + _backPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="back" class="flashcardBack">' + back + '</div>';
    }

    return back;
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
        $("#editFlashcardModal").modal("show");
    },
    "click .btn-historyFlashcard": function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("currentItemId", this._id);
        $("#historyFlashcardModal").modal("show");

    },
    "click .btn-commentsFlashcard": function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("currentItemId", this._id);
        console.log("btn this.flashcard", this.flashcard);
        Session.set("currentFlashcardId", this.flashcard);
        $("#commentsFlashcardModal").modal("show");
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
    if (Session.get("reloadFlashcards")) {
        return true;
    }
    else {
        return false;
    }
}