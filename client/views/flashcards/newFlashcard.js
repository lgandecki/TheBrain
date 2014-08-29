if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};


Template.flashcardForm.newFrontPicture = function () {
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

Template.flashcardForm.newBackPicture = function () {
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

Template.collectionGroup.events({
    "click .btn-collectionModal": function (e, template) {
        e.preventDefault();
        Meteor.theBrain.modals.newCollection();
    }
});

Template.flashcardForm.events({
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
    "click #newFront": function (e, template) {
        console.log("e", e);
        console.log("this", this);
        if ((e.target.className && e.target.className !== "editableImage")) {
            $(".flashcardFront").focus();
        }
    },
    "click #newBack": function (e, template) {
        if ((e.target.className && e.target.className !== "editableImage")) {
            $(".flashcardBack").focus();
        }
    }
});

Template.flashcardButtons.events({
    "click .btn-showAdvanced": function (e, template) {
        e.preventDefault();
        $(".btn-showAdvanced").attr("disabled", true).html("Loading...");
        $("#advancedSettings").slideDown(400,
            "easeInOutCubic",
            function () {
                $(".btn-showAdvanced").attr("disabled", false)
                    .html("Hide advanced settings")
                    .removeClass("btn-showAdvanced")
                    .addClass("btn-hideAdvanced");
                $(".btn-hideAdvanced").switchClass("btn-primary-reversed", "btn-primary-main", 400);
            });
    },
    "click .btn-hideAdvanced": function (e, template) {
        e.preventDefault();
        $(".btn-hideAdvanced").attr("disabled", true).html("Unloading...");
        $("#advancedSettings").slideUp(400,
            "easeInOutCubic",
            function () {
                $(".btn-hideAdvanced").attr("disabled", false)
                    .html("Show advanced settings")
                    .removeClass("btn-hideAdvanced")
                    .addClass("btn-showAdvanced");
                $(".btn-showAdvanced").switchClass("btn-primary-reversed", "btn-primary-main", 400);
            });
    },
    "click .btn-submit": function (e, template) {
        e.preventDefault();
        addFlashcard(e);
    }
});


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

validateNewFlashcard = function () {

    var invalids = [];
    if (!Session.get("newFrontPicture")) {
        Meteor.validations.checkIfEmptyDiv(".flashcardFront");
    }
    return !!(invalids.length === 0);
};

createNewFlashcard = function () {
    var _isPublic = ($("#public").val() === "true") ? true : false;

    var isNew = true;

    var _front = Meteor.flashcard.returnFront(isNew);
    var _back = Meteor.flashcard.returnBack(isNew);

//    var _front = $("#newFront .flashcardFront").justtext();
//
//    $.each($("#newFront .flashcardFront").children(), function(key, value) {
//        _front = _front + "\n" + $(value).text()
//    })
//
//    var _back = $("#newBack .flashcardBack").justtext();
//
//    $.each($("#newBack .flashcardBack").children(), function(key, value) {
//        _back = _back + "\n" + $(value).text()
//    })

//    console.log("_front", _front);


    ////    console.log("value", $(value).text()) })
//    $("#newFront .flashcardFront").children().forEach(function(child) {
//        _front = _front + "&#13;&#10;" + child.text();
//    })

    var _course, _lesson, _khanPlaylistSlug, _khanVideoSlug;

    var _currentRoute = window.location.pathname;
    _currentRoute = "/" + _currentRoute.split("/")[1];
    if (_currentRoute === "/videoLesson") {
        _course = Session.get("selectedCourse");

        var _selectedCourse = Courses.findOne({_id: Session.get("selectedCourse")});
        var _youtube_id = Session.get("youtube_id");
        console.log("Course in created", _selectedCourse);
        if (_selectedCourse && _youtube_id) {
            _lessonIndex = _.indexOf(_.pluck(_selectedCourse.lessons, 'youtube_id'), _youtube_id);
            if (_selectedCourse.khanPlaylistSlug) {
                _khanPlaylistSlug = _selectedCourse.khanPlaylistSlug;
                _khanVideoSlug = _selectedCourse.lessons[_lessonIndex].videoSlug;
            }
        }
        _lesson = _selectedCourse.lessons[_lessonIndex]._id;
    } else {
        _lesson = $("#lesson").val();
        _course = $("#course").val();
    }

    var _newFlashcard = {
        "public": _isPublic,
        "front": _front || null,
        "frontPicture": Session.get("newFrontPicture") || null,
        "back": _back || null,
        "backPicture": Session.get("newBackPicture") || null,
//        "course": $("#course").val(),
        "lesson": _lesson,
        "collection": $("#collection").val(),
        "source": {
            "youtube": $("#youtubeSource").val(),
            "wikipedia": $("#wikipediaSource").val(),
            "link": $("#linkSource").val(),
            "khan": $("#khanSource").val(),
            "other": $("#otherSource").val()
        },
    };
    var _youtube_id = Session.get("youtube_id");
    if (_youtube_id) {
        _newFlashcard.youtube_id = _youtube_id;
        var _playlistSlug;
        if (_khanPlaylistSlug) {
            _playlistSlug = _khanPlaylistSlug
        } else {
            _playlistSlug = Session.get("playlistSlug");
        }
        if (_playlistSlug) {
            var _videoSlug;
            if (_khanVideoSlug) {
                _videoSlug = _khanVideoSlug
            } else {
                _videoSlug = Session.get("videoSlug");
            }

            _newFlashcard.khanAcademy = {
                playlistSlug: _playlistSlug,
                videoSlug: _videoSlug
            }
        }
    }


    if (_course && _course != "Don't add to any courses") {
        _newFlashcard.course = _course;
    }

    Session.set("reloadFlashcards", Math.floor(Math.random() * 16777215).toString(16));
    return _newFlashcard;
};

Template.publicGroup.rendered = function () {
    $('#public').parent().bootstrapSwitch().on('switch-change', function (e, data) {
        $("#public").val(data.value);
    });
};


var _renderer;
Template.flashcardForm.rendered = function () {
    this.autorun(function () {
        var _currentItemId = Session.get("currentItemId");
        if (_currentItemId) {
            var _currentItem = Items.findOne({_id: _currentItemId});
            if (!_currentItem) {
                $(".itemSpecific").hide();
            } else {
                $(".itemSpecific").show();
            }
        }
        else {
            $(".itemSpecific").hide();
        }

        _originalFront = $("#newFront").html();
        _originalBack = $("#newBack").html();
    });


};


Template.flashcardForm.destroyed = function () {
    delete Session.keys["newBackPicture"];
    delete Session.keys["newFrontPicture"];
    delete Session.keys["newCollectionName"];
    console.log("running destroyed?");
    delete Session.keys["selectedCourseInForm"];
//    Session.set("selectedLesson", "");
};


Template.collectionGroup.rendered = function () {
    console.log("is this first, collectionGroup");

    this.autorun(function () {
        var _user = Meteor.user();
        var _collections = [];
        var _newCollection = Session.get("newCollectionName");
        var _selectedCollection;

        if (_newCollection) {
            _user.collections.forEach(function (collection) {
                if (collection.name === _newCollection) {
                    _selectedCollection = collection;
                }
                _collections.push({id: collection._id, text: collection.name})
            });
        } else {
            _user.collections.forEach(function (collection) {
                if (collection.name === "Main collection") {
                    _selectedCollection = collection;
                }
                _collections.push({id: collection._id, text: collection.name})
            });
        }


        console.log("_selectedCollection ", _selectedCollection);

        $("#collection").select2({
            query: function (query) {
                var data = {

                    results: _collections
                };
                query.callback(data);
            },
            initSelection: function (element, callback) {
                var data = {id: _selectedCollection._id, text: _selectedCollection.name};
                $("#collection").val(_selectedCollection._id);
                callback(data);
            }
        }).on("change", function (e) {
            var _collection = _.find(_user.collections, function (collection) {
                return collection._id === e.val;
            });

            Session.set("newCollectionName", _collection ? _collection.name : "");
        });
    })
};


var _flashcardModalTitle = function () {
    var _currentRoute = window.location.pathname;
    _currentRoute = "/" + _currentRoute.split("/")[1];
    if (_currentRoute === "/lesson" || _currentRoute === "/course") {
        var _selectedCourseSession = Session.get("selectedCourse");
        var _selectedCourse = Courses.findOne({_id: _selectedCourseSession});
        var _courseName = _selectedCourse ? _selectedCourse.name : "";
        var _selectedLesson = Session.get("selectedLesson");
        var _lesson;
        if (_selectedCourse && _selectedLesson) {
            var _lessonIndex = _.indexOf(_.pluck(_selectedCourse.lessons, '_id'), _selectedLesson);
            _lesson = _selectedCourse.lessons[_lessonIndex];
        }
        var _lessonName = _lesson ? _lesson.name : "";
        return "New Flashcard for " + _courseName + ", lesson: " + _lessonName;

    }
    return "New Flashcard";
};

Meteor.theBrain.modals.newFlashcard = function () {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
        okLabel: "Add Flashcard"
    };

    var _modal = Meteor.modal.initAndShow(Template.newFlashcardModal, _flashcardModalTitle(), _opts);
    _modal.buttons.ok.on('click', function (button) {
        addFlashcard(button)
    });
};


Meteor.theBrain.modals.editFlashcardModal = function () {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
        okLabel: "Save Changes"
    };

    var _modal = Meteor.modal.initAndShow(Template.editFlashcardModal, "Edit Flashcard", _opts);
    _modal.buttons.ok.on('click', function (button) {
        _editFlashcard(button)
    });

}

Meteor.theBrain.modals.editFlashcardPrompt = function () {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
    };

    var _modal = Meteor.modal.initAndShow(Template.editFlashcardPrompt, "Are You Sure?", _opts);
    _modal.buttons.ok.on('click', function (button) {
        _saveChanges(button)
    });
}

var _originalFront, _originalBack;


Template.flashcardForm.front = function () {
    var _currentItemId = Session.get("currentItemId");

    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem) {
            var _front = splitFlashcard(_currentItem.personalFront);
            setTimeout(function () {
                _originalFront = $("#newFront").html();
            }, 200);
            return _front;

//            return _currentItem.personalFront;
        }
    }
    else {
        var _currentFlashcardId = Session.get("currentFlashcardId");
        if (_currentFlashcardId) {
            var _currentFlashcard = Flashcards.findOne({_id: _currentFlashcardId});
            if (_currentFlashcard && _currentFlashcard.front) {
                var _front = splitFlashcard(_currentFlashcard.front)
                setTimeout(function () {
                    _originalFront = $("#newFront").html();
                }, 200);
                return _front;

            }
        }
    }

    return false;
}

var splitFlashcard = function (text) {
    text = stripHtml(text);
    var _splittedFront = text.split("\n");
    var _firstElement = _splittedFront.shift();
    var _front;
    if (_firstElement !== "") {
        _front = _firstElement;
    }
    else {
        _front = "<div>&nbsp;</div>";
    }

    _splittedFront.forEach(
        function (line) {
            if (line !== "") {
                _front = _front + "<div>" + line + "</div>";
            }
            else {
                _front = _front + "<div>&nbsp;</div>";
            }
        })
    return _front;

}
Template.flashcardForm.back = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem) {
            var _back = splitFlashcard(_currentItem.personalBack);
            setTimeout(function () {
                _originalBack = $("#newBack").html();
            }, 200);
            return _back;
//            return _currentItem.personalBack;
        }
    }
    else {
        var _currentFlashcardId = Session.get("currentFlashcardId");
        if (_currentFlashcardId) {
            var _currentFlashcard = Flashcards.findOne({_id: _currentFlashcardId});
            if (_currentFlashcard && _currentFlashcard.back) {
                var _back = splitFlashcard(_currentFlashcard.back);
                setTimeout(function () {
                    _originalBack = $("#newBack").html();
                }, 200);
                return _back;

            }
        }
    }
    return false;
}


Template.flashcardForm.backNote = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem && _currentItem.backNote) {
            return _currentItem.backNote;
        }
    }
    return "";
}


Template.flashcardForm.frontNote = function () {
    var _currentItemId = Session.get("currentItemId");
    if (_currentItemId) {
        var _currentItem = Items.findOne({_id: _currentItemId});
        if (_currentItem && _currentItem.frontNote) {
            return _currentItem.frontNote;
        }
    }
    return "";
}

var _saveChanges = function () {
    var _reason = $("#reason").val();
    if (_reason && _reason !== "") {
        var _front = Meteor.flashcard.returnFront();
        var _back = Meteor.flashcard.returnBack();

//                    var _back = $("#newBack .flashcardBack").justtext();


        var _flashcardOpts = {
            flashcardId: Session.get("currentFlashcardId"),
            "front": _front || null,
            "frontPicture": Session.get("newFrontPicture") || null,
            "back": _back || null,
            "backPicture": Session.get("newBackPicture") || null,
            "reason": $("#reason").val() || null
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
                setTimeout(function () {
                    delete Session.keys["newFrontPicture"];
                    delete Session.keys["newBackPicture"];
                }, 500);
                Meteor.modal.hideClosestTo("#editFlashcardModal");
                Meteor.modal.hideClosestTo("#editFlashcardPrompt");
            }
        });
    } else {
        Meteor.popUp.error("TheBrain is confused", "I need a reason for update :(");
    }
    console.log("Reason: ", $("#reason").val());
}

var _editFlashcard = function () {

    if (isFrontChanged() || isBackChanged() || Session.get("newFrontPicture") || Session.get("newBackPicture")) {
        Meteor.theBrain.modals.editFlashcardPrompt();
    }
    else if (Session.get("currentItemId")) {
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
                Meteor.modal.hideClosestTo("#editFlashcardModal");
            }
        });
    }
    else {
        Meteor.popUp.error("TheBrain is confused", "I don't detect any changes!")
    }
    // Update Item
//        updateFlashcard(e);
}


var isFrontChanged = function () {
    return (_originalFront !== $("#newFront").html());
}

var isBackChanged = function () {
    return (_originalBack !== $("#newBack").html());
};

Template.editFlashcardButtons.events({
    "click .btn-submit": function (e, template) {
        e.preventDefault();
        _editFlashcard();
    }
});

Template.lessonGroup.rendered = function () {
    this.autorun(function () {
        $("#lesson.select2").select2();
        $("#course.select2").select2().on("change", function (e) {
            Session.set("selectedCourseInForm", e.val);
        });
        if (Session.get("selectedCourse")) {
            $("#coursesControlGroup").hide();
        }
    });
};

Template.lessonGroup.course = function () {
    return Courses.find();
};

Template.lessonGroup.lesson = function () {
    var _selectedCourse, _course;
    _selectedCourse = Session.get("selectedCourse") || Session.get("selectedCourseInForm") || $("#courseId.select2").val();

    if (_selectedCourse) {
        _course = Courses.findOne({
            _id: _selectedCourse
        });
    }
    return _course ? _course.lessons : [];
};

Template.lessonGroup.selectIfSelectedCourse = function () {
    var _selectedCourse = Session.get("selectedCourse") || Session.get("selectedCourseInForm") || $("#courseId.select2").val();

    if (_selectedCourse) {
        return this._id === _selectedCourse ? "selected" : "";
    }
    return "";

};

Template.lessonGroup.selectIfSelectedLesson = function () {

    var _selectedLesson = Session.get("selectedLesson");
    if (_selectedLesson) {
        return this._id === _selectedLesson ? "selected" : "";
    }
    return "";
};

Template.lessonGroup.destroyed = function () {
    delete Session.keys["selectedCourseInForm"];
};