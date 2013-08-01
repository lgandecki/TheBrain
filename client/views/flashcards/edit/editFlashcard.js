var _originalFront, _originalBack;
Template.editFlashcardForm.newFrontPicture = function () {

    var _newFrontPicture = Session.get("newFrontPicture");
    if (_newFrontPicture) {
        return _newFrontPicture;
    }
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem && _currentItem.personalFrontPicture) {
            return _currentItem.personalFrontPicture;
        }
    }
    else {
        var _currentFlashcardId = Session.get("currentFlashcardId");
        if (_currentFlashcardId) {
            var _currentFlashcard = Flashcards.findOne({_id: _currentFlashcardId});
            if (_currentFlashcard && _currentFlashcard.frontPicture) {
                return _currentFlashcard.frontPicture;
            }
        }
    }


    return false;
}

Template.editFlashcardForm.newBackPicture = function () {

    var _newBackPicture = Session.get("newBackPicture");

    if (_newBackPicture) {
        return _newBackPicture;
    }
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem && _currentItem.personalBackPicture) {
            return _currentItem.personalBackPicture;
        }
    }
    else {
        var _currentFlashcardId = Session.get("currentFlashcardId");
        if (_currentFlashcardId) {
            var _currentFlashcard = Flashcards.findOne({_id: _currentFlashcardId});
            if (_currentFlashcard && _currentFlashcard.backPicture) {
                return _currentFlashcard.backPicture;
            }
        }
    }


    return false;
}

Template.editFlashcardForm.front = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem) {
            return _currentItem.personalFront;
        }
    }
    else {
        var _currentFlashcardId = Session.get("currentFlashcardId");
        if (_currentFlashcardId) {
            var _currentFlashcard = Flashcards.findOne({_id: _currentFlashcardId});
            if (_currentFlashcard && _currentFlashcard.front) {
                return _currentFlashcard.front;
            }
        }
    }
    return false;
}

Template.editFlashcardForm.back = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem) {
            return _currentItem.personalBack;
        }
    }
    else {
        var _currentFlashcardId = Session.get("currentFlashcardId");
        if (_currentFlashcardId) {
            var _currentFlashcard = Flashcards.findOne({_id: _currentFlashcardId});
            if (_currentFlashcard && _currentFlashcard.back) {
                return _currentFlashcard.back;
            }
        }
    }
    return false;
}


Template.editFlashcardForm.backNote = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem && _currentItem.backNote) {
            return _currentItem.backNote;
        }
    }
    return "";
}


Template.editFlashcardForm.frontNote = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem && _currentItem.frontNote) {
            return _currentItem.frontNote;
        }
    }
    return "";
}

Template.editFlashcardForm.rendered = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (!_currentItem) {
            $(".itemSpecific").hide();
        }
    }
    else {
        $(".itemSpecific").hide();
    }

    _originalFront = $("#front").html();
    _originalBack = $("#back").html();

}


Template.editFlashcardForm.destroyed = function () {
    Session.set("newBackPicture", "");
    Session.set("newFrontPicture", "");
};


Template.editFlashcardForm.events({
    "click .btn-addPictureToFront": function (e, template) {
        e.preventDefault();
        filepicker.pick({
                mimetypes: ['image/*'],
                container: 'modal',
                services: ['COMPUTER', 'FACEBOOK', 'GMAIL', 'INSTAGRAM', 'WEBCAM', 'URL']
            },
            function (InkBlob) {
                Session.set("newFrontPicture", InkBlob.url);
                Meteor.popUp.success("Front picture added", "TheBrain made the neural connection changes you asked for");

            },
            function (FPError) {
                Meteor.popUp.error("TheBrain is confused", FPError.toString());
            }
        );
    },
    "click .btn-addPictureToBack": function (e, template) {
        e.preventDefault();
        filepicker.pick({
                mimetypes: ['image/*'],
                container: 'modal',
                services: ['COMPUTER', 'FACEBOOK', 'GMAIL', 'INSTAGRAM', 'WEBCAM', 'URL']
            },
            function (InkBlob) {
                Session.set("newBackPicture", InkBlob.url);
                Meteor.popUp.success("Back picture added", "TheBrain made the neural connection changes you asked for");

            },
            function (FPError) {
                Meteor.popUp.error("TheBrain is confused", FPError.toString());
            }
        );
    },
    "click #front": function (e, template) {
        if ((e.target.className && e.target.className !== "editableImage")) {
            $(".flashcardFront").focus();
        }
    },
    "click #back": function (e, template) {
        if ((e.target.className && e.target.className !== "editableImage")) {

            $(".flashcardBack").focus();
        }
    }
})


Template.editFlashcardButtons.events({
    "click .btn-submit": function (e, template) {
        e.preventDefault();
        if (isFrontChanged() || isBackChanged() || Session.get("newFrontPicture") || Session.get("newBackPicture")) {
            bootbox.prompt("You are about to change the FlashCard, your changes will affect all TheBrain users. " +
                "If you want to add personal information to the FlashCard please use the 'notes' fields. " +
                "If you do want to change the FlashCard, please provide a reason for change.", function (result) {
                if (result === null) {
                    console.log("cancelled");
                } else {

                    var _flashcardOpts = {
                        flashcardId: Session.get("currentFlashcardId"),
                        "front": $("#front .flashcardFront").text(),
                        "frontPicture": Session.get("newFrontPicture") || null,
                        "back": $("#back .flashcardBack").text(),
                        "backPicture": Session.get("newBackPicture") || null,
                        "reason": result || null
                    }

                    if (Session.get("currentItemId")) {
                        _flashcardOpts.itemOpts = {
                            itemId: Session.get("currentItemId"),
                            frontNote: $("#frontNote").text() || null,
                            backNote: $("#backNote").text() || null
                        }
                    }

                    Meteor.call("updateFlashcard", _flashcardOpts, function (error, id) {
                        if (error) {
                            Meteor.popUp.error("TheBrain is confused", error.reason);
                        }
                        else {
                            Meteor.popUp.success("Flashcard updated", "TheBrain made the neural connections changes you asked for.");
                        }
                    })
                    console.log("Reason: ", result);
                }
            });
        }
        else {
            if (Session.get("currentItemId")) {
                var _itemOpts = {
                    itemId: Session.get("currentItemId"),
                    frontNote: $("#frontNote").text() || null,
                    backNote: $("#backNote").text() || null
                }
                Meteor.call("updateItem", _itemOpts, function (error, id) {
                    if (error) {
                        Meteor.popUp.error("TheBrain is confused", error.reason);
                    }
                    else {
                        Meteor.popUp.success("Personal Flashcard updated", "TheBrain made the neural connections changes you asked for.");
                    }
                });
            }
            // Update Item
//        updateFlashcard(e);
        }
    }
});

var isFrontChanged = function () {
    return (_originalFront !== $("#front").html());
}

var isBackChanged = function () {
    return (_originalBack !== $("#back").html());
}