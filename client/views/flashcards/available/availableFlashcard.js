Template.availableFlashcard.userName = function () {
    var _userId = this.user;
    console.log("_userId in userName", _userId);
    var _user = Meteor.users.findOne(_userId);
    console.log("_user", _user);
    if (_user && _user.identity) {
        return _user.identity.nick;
    }

}

Template.availableFlashcard.rendered = function() {
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

Template.availableFlashcard.flashcardFront = function () {
//    var _currentItem = Items.findOne({_id: Session.get("currentItemId")});
    var front = stripHtml(this.front);


    var _frontPicture

    if (this.frontPicture) {
        _frontPicture = this.frontPicture;
    }


    if (_frontPicture) {
        front = '<a href="' + _frontPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + front + '"> \
        <img src="' + _frontPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="front" class="flashcardFront">' + front + '</div>';
        console.log("front after", front);
    }


    return front;

}

Template.availableFlashcard.flashcardBack = function () {
    var back = stripHtml(this.back);
    var _backPicture;

    if (this.backPicture) {
        _backPicture = this.backPicture;
    }

    if (_backPicture) {
        back = '<a href="' + _backPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + back + '"> \
        <img src="' + _backPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="back" class="flashcardBack">' + back + '</div>';
    }

    return back;


}


Template.availableFlashcard.events({
    'click .btn-addToCollectionFlashcard': function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var _flashcards = [];
        var _flashcard = this._id;
        _flashcards.push(_flashcard);
        Session.set("selectedFlashcard", _flashcards);

        $("#addToCollectionFlashcardModal").modal("show").on('hidden', function () {
            Session.set("selectedFlashcard", "");
        });
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

    "click .btn-commentsFlashcard": function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Session.set("currentFlashcardId", this._id);
        $("#commentsFlashcardModal").modal("show");
    }
});

stripHtml = function (str) {
    return jQuery('<div />', { html: str }).text();
}

Template.availableFlashcard.reloadFlashcard = function () {
    if (Session.get("reloadFlashcards")) {
        return true;
    }
    else {
        return false;
    }
}