if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};

Meteor.theBrain.modals.newFlashcardVersion = function() {
    var _title;
    var _opts = {
        withCancel: false,
        closeOnOk: true,
        okLabel: "Close"
    };

    var _modal = Meteor.modal.initAndShow(Template.updatedFlashcardVersions, _title = "That flashcard has been updated!", _opts);
    //_modal.buttons.ok.on('click', function(button) {_newCollection(button)});
}


Template.updatedFlashcardVersions.flashcardVersion = function () {
    var _item = Items.findOne({user: Meteor.userId(), _id: Session.get("currentItemId")});
    var _flashcard = Flashcards.findOne({_id: Session.get("currentFlashcardId")});
    if (_item && _flashcard && _item.flashcardVersionSeen < _flashcard.version) {
        if (_flashcard) {
            var _updatedVersions = $.grep(_flashcard.previousVersions, function (previousVersion) {
                return previousVersion.version > _item.flashcardVersionSeen;
            });

            var _newestVersion = {
                updatedBy: _flashcard.updatedBy,
                front: _flashcard.front,
                frontPicture: _flashcard.frontPicture,
                back: _flashcard.back,
                backPicture: _flashcard.backPicture,
                version: _flashcard.version,
                reason: _flashcard.reason,
                upVotes: _flashcard.upVotes.length,
                downVotes: _flashcard.downVotes.length,
            }
            _updatedVersions.push(_newestVersion);

            _updatedVersions.sort(function (a, b) {
                if (a.version < b.version) {
                    return 1;
                } else if (a.version > b.version) {
                    return -1;
                }
                return 0;
            })

            return _updatedVersions;
        }
    }
}

Template.updatedFlashcardVersions.currentItem = function () {
    var _item = Items.findOne({_id: Session.get("currentItemId")});
    if (_item) {
        return _item;
    }
}

Template.updatedFlashcardVersions.currentItemFront = function () {

    var _optsFront = {
        side: this.personalFront,
        note: this.frontNote,
        picture: this.personalFrontPicture
    }
    return Meteor.flashcard.showSide(_optsFront);


}

Template.updatedFlashcardVersions.currentItemBack = function () {
    var _optsBack = {
        side: this.personalBack,
        note: this.backNote,
        picture: this.personalBackPicture
    }
    return Meteor.flashcard.showSide(_optsBack);

}
Template.updatedFlashcardVersions.flashcardFront = function () {

    var _optsFront = {
        side: this.front,
        picture: this.frontPicture
    }
    return Meteor.flashcard.showSide(_optsFront);



}


Template.updatedFlashcardVersions.flashcardBack = function () {
    var _optsBack = {
        side: this.back,
        picture: this.backPicture
    }
    return Meteor.flashcard.showSide(_optsBack);



}

Template.updatedFlashcardVersions.userName = function () {
    var _userId = this.updatedBy;
    console.log("_userId in userName", _userId);
    var _user = Meteor.users.findOne(_userId);
    if (_user) {
        return Meteor.userDetails.getName(_user._id);
    }
    return _userId;

}

Template.updatedFlashcardVersions.events({
    "click .btn-useThisNewVersion": function () {
        var _opts = {
            itemId: Session.get("currentItemId"),
            flashcardId: Session.get("currentFlashcardId"),
            selectedVersion: this.version
        };
        Meteor.call("useUpdatedFlashcardVersion", _opts, function (error) {
            if (error) {
                Meteor.popUp.error("Updating Flashcard server error", error.reason);
            } else {
                Meteor.popUp.success("Updating Flashcard success", "TheBrain made neural connections you asked for.");
            }
        });
        Meteor.modal.hideClosestTo(".updatedFlashcardVersions");
    },
    "click .badge-upVote": function(e) {
        e.preventDefault();
        e.stopPropagation();
        var _opts = {
            flashcardId: Session.get("currentFlashcardId"),
            selectedVersion: this.version
        }
        console.log("_opts in upVote", _opts);
        Meteor.call("upVoteAFlashcardVersion", _opts);
    },
    "click .badge-downVote": function(e) {
        e.preventDefault();
        e.stopPropagation();
        var _opts = {
            flashcardId: Session.get("currentFlashcardId"),
            selectedVersion: this.version
        }
        console.log("_opts in downVote", _opts);
        Meteor.call("downVoteAFlashcardVersion", _opts);
    }
})
