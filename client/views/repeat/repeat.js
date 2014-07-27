var currentFlashcard, currentItemId, itemsToLearn = [], _renderer, _renderer2;

//Meteor.subscribe("myItems");
//Meteor.subscribe("testItems");
//Meteor.subscribe("currentFlashcard");

var resizeTheBar = function(opts) {
    var _done = opts.total - opts.left;
    console.log("resizingTheBar", opts);
    var _newWidth = (_done / opts.total) * 100;
    if (_newWidth) {
        $(opts.progressBar).width(_newWidth + "%");
    } else {
        $(opts.progressBar).width(100 + "%");
    }
    $(opts.progressBar).width((_done / opts.total) * 100 + "%");
    $(opts.progressBar).siblings("span").text("" + _done + " / " + opts.total);
//    $(opts.progressBar).child(".progressbar-front-text").text("" + _done + " / " + opts.total);
}

Deps.autorun(function () {
    console.log("deps currentFlashcard " + Session.get("currentFlashcardId"));
    if (Session.get("currentFlashcardId")) {
        Meteor.subscribe("currentFlashcard", Session.get("currentFlashcardId"));
    }
    if (Session.get("currentItemId")) {
        Meteor.subscribe("singleItem", Session.get("currentItemId"));
    }
});
//
//function getNextItem() {
//    currentItem = Items.findOne();
//    if (currentItem) {
//        Session.set("currentFlashcard", currentItem.flashcard);
//    }
//}

function returnNextItem() {
    // Najpierw powtorki

    var _now = moment(Session.get("serverNextDay"))._d;
    var _nextItem = null;

    // Repetition first
    if (Session.get("repetitionsLeft") > 0) {
        _nextItem = Items.findOne({user: Meteor.userId(), nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}, {sort: {lastRepetition: 1}});
        if (_nextItem)
            return _nextItem._id;
    }


    // Items to learn
    for (var collectionId in itemsToLearn) {
        // console.log("collectionId " + collectionId);
        if (itemsToLearn.hasOwnProperty(collectionId) && itemsToLearn[collectionId] > 0) {

                itemsToLearn[collectionId]--;


                _nextItem = Items.findOne({user: Meteor.userId(), collection: collectionId, actualTimesRepeated: 0});
                // console.log("Items to learn");
                if (_nextItem)
                    return _nextItem._id;
        }
        delete itemsToLearn[collectionId];
    }

    if (Session.get("extraRepetitionsLeft") > 0) {
        _nextItem = Items.findOne({user: Meteor.userId(), extraRepeatToday: true}, {sort: {lastRepetition: 1}});
    }

    return (_nextItem) ? _nextItem._id : false;
    // Items to reLearn
}

Template.repeat.item = function () {
    return Items.findOne({_id: Session.get("currentItemId")});
}

Template.repeat.flashcard = function () {
    var _item = Items.findOne({user: Meteor.userId(), _id: Session.get("currentItemId")});
    if (_item) {
//        console.log("_item", _item);
        _flashcard = Flashcards.findOne({_id: _item.flashcard});
//        console.log("_flashcard", _flashcard);
        return _flashcard;
    }
}

Template.itemHistory.previousAnswer = function () {
//    console.log("ever here in previous answer?");

    var _item = Items.findOne({user: Meteor.userId(), _id: Session.get("currentItemId")});
//    console.log("_item", _item);
    if (_item) {
        return _item.previousAnswers.reverse();
    }
}

Template.itemHistory.historyDate = function () {
    return new moment(this.date).fromNow();
}

Template.itemHistory.extraRepetition = function () {
    if (this.extraRepetition === true) {
        return true;
    }
    else {
        return false;
    }
}

Template.itemHistory.historyEvaluation = function () {
    return Meteor.flashcard.returnEvaluationName(this.evaluation);
}

Template.itemHistory.daysChangeFormat = function () {
    if (this.daysChange === 1) {
        return "1 day";
    }
    else if (this.daysChange) {
        return this.daysChange + " days"
    }
    else {
        return "error";
    }
}
//Template.repeat.itemFlashcard = function () {
//    console.log("itemFlashcard");
//    return ItemFlashcards.findOne(currentItem);
//};


Template.repeat.created = function () {

};

_firstRender = true;

Template.repeat.rendered = function () {
//

    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function () {
        Meteor.tabs.setHeight();

        if (_firstRender) {

            $(".currentFlashcard > .back").prop("disabled", true);
            $(".currentFlashcard > .front").prop("disabled", true);

            _firstRender = false;
            Session.set("itemsToRepeat", "");

            $(".evaluation.popoverUp").popover({trigger: 'hover', animation: true, placement: 'top',  delay: { show: 750, hide: 100 }});
            $(".evaluation.popoverLeft").popover({trigger: 'hover', animation: true, placement: 'left',  delay: { show: 750, hide: 100 }});
            $(".evaluation.popoverRight").popover({trigger: 'hover', animation: true, placement: 'right',  delay: { show: 750, hide: 100 }});

            // var _itemsToLearn = {};
            // myCollections = Meteor.user().collections || [];
            // myCollections.forEach(function(collection) {
            //     _itemsToLearn[collection._id] = 99999;
            // });

            // console.log("myCollections ", myCollections);

            // Session.set("itemsToLearn", _itemsToLearn);

            // console.log("_itemsToLearn " + _itemsToLearn);
            // itemsToLearn = Session.get("itemsToLearn");

            if (Session.equals("showScheduleModal", true)) {
                $("#scheduleModal").modal("show").on('hidden', function () {
                    itemsToLearn = Session.get("itemsToLearn");
                    _setAmountOfReps();
                    $('#setStudyFirstTour').crumble("clear");

                }).on("shown", function() {
//                        setTimeout(function() {



                            Meteor.tour.showIfNeeded("setStudyFirstTour");
//                        }, 500);
                    });
            }
            else {
                _setAmountOfReps();
            }

        }


    }, 150);
    fillTemplate();
};

Template.repeat.destroyed = function () {
    Session.set("showScheduleModal", false);
    Session.set("currentItemId", null);
    Session.set("currentFlashcardId", null);
    _firstRender = true;
}

_setAmountOfReps = function() {
//    console.log("ladujemy to?");
    var _now =  moment(Session.get("serverNextDay"))._d;
//    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;

    Meteor.subscribe("itemsToRepeat", _now);

    Meteor.subscribe("itemsToRepeatCount", _now);
    var _repetitionsLeft = ItemsToRepeatCount.findOne({_id: Meteor.userId()}).count;


//    var _repetitionsLeft = Items.find({nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count();
    Session.set("repetitionsLeft", _repetitionsLeft);
    Session.set("repetitionsTotal", _repetitionsLeft);


    var _optsRepetitions = {
        total: _repetitionsLeft,
        left: _repetitionsLeft,
        progressBar: ".barRepetitions"
    }

    resizeTheBar(_optsRepetitions);

    var _newFlashcardsLeft = 0;




    for (var collectionId in itemsToLearn) {
        // console.log("collectionId " + collectionId);
        if (itemsToLearn.hasOwnProperty(collectionId) && itemsToLearn[collectionId] > 0) {
            // console.log("second step,, items To learn " + itemsToLearn[collectionId]);

            var _itemsToLearnCount = ItemsToLearnCount.findOne({_id: collectionId});
            var _currentCollectionItemsToLearn = _itemsToLearnCount.count;

//            var _currentCollectionItemsToLearn = Items.find({collection: collectionId, actualTimesRepeated: 0}, {limit: itemsToLearn[collectionId]}).count();
//            _newFlashcardsLeft = _newFlashcardsLeft + _currentCollectionItemsToLearn;

            if (_currentCollectionItemsToLearn && _currentCollectionItemsToLearn > 0) {
                if (itemsToLearn[collectionId] > _currentCollectionItemsToLearn) {
                    itemsToLearn[collectionId] = _currentCollectionItemsToLearn;
                }
                Meteor.subscribe("itemsToLearn", collectionId);
                _newFlashcardsLeft = _newFlashcardsLeft + itemsToLearn[collectionId];
            }
            else {
                delete itemsToLearn[collectionId];
            }
        }
    }

    Session.set("newFlashcardsLeft", _newFlashcardsLeft);
    Session.set("newFlashcardsTotal", _newFlashcardsLeft);




    var _optsNewFlashcards = {
        total: _newFlashcardsLeft,
        left: _newFlashcardsLeft,
        progressBar: ".barNew"
    }

    resizeTheBar(_optsNewFlashcards);


    Meteor.subscribe("itemsToExtraRepeat");


    var _extraRepetitionsTotal = ItemsToReLearnCount.findOne({_id: Meteor.userId()}).count;

//    var _extraRepetitionsTotal = Items.find({extraRepeatToday: true}).count();

    Session.set("extraRepetitionsLeft", _extraRepetitionsTotal);
    Session.set("extraRepetitionsTotal", _extraRepetitionsTotal);

    var _optsExtraRepetitions = {
        total: _extraRepetitionsTotal,
        left: _extraRepetitionsTotal,
        progressBar: ".barExtraRepetitions"
    }

    resizeTheBar(_optsExtraRepetitions);



//    setTimeout(function() {
//        $(".progress .bar").progressbar({display_text: 2,
//            use_percentage: false})
//    }, 200);
    setTimeout(function() {
        displayNextRepetition();
    }, 500);

}

displayNextRepetition = function () {
    var _nextItem = returnNextItem();
//    console.log("nextItem ", _nextItem);
    if (_nextItem) {
        currentItemId = _nextItem;
        Session.set("currentItemId", currentItemId);
        var _item = Items.findOne({_id: currentItemId});
        if (_item) {
            Session.set("currentFlashcardId", _item.flashcard);
        }
        fillTemplate();
    }
    else {
        Session.set("currentItemId", null);
        Session.set("currentFlashcardId", null);
        emptyTemplate();
        $("#doneForTodayModal").modal("show").on('hidden', function () {
            Router.go("/");
        });
        // Info that you've done all repetitions for given day.
    }
}

fillTemplate = function () {
    var _currentItem = Items.findOne({_id: Session.get("currentItemId")});
    if (_currentItem) {

        var _optsFront = {
            side: _currentItem.personalFront,
            note: _currentItem.frontNote,
            picture: _currentItem.personalFrontPicture
        }
        var _optsBack = {
            side: _currentItem.personalBack,
            note: _currentItem.backNote,
            picture: _currentItem.personalBackPicture

        }

        var _front = Meteor.flashcard.showSide(_optsFront);
        var _back = Meteor.flashcard.showSide(_optsBack);
        var _collectionName = "";
        if (_currentItem.collection) {
            _collectionName = Meteor.collections.returnName(_currentItem.collection);
        }



        $(".currentFlashcard > h5.collectionName").html("Collection: " + _collectionName);

        $(".currentFlashcard > .front").html(_front);
        $(".currentFlashcard > .back").html(_back);
        $(".currentFlashcard > .evaluate").attr("item-id", _currentItem._id);


    }
}

emptyTemplate = function () {
    $(".currentFlashcard > .front").html("");
    $(".currentFlashcard > .answer").html("").prop("disabled", true);
    $(".currentFlashcard > .back").html("");
    $(".currentFlashcard > .answer").prop("disabled", true);
}

Template.repeat.currentFlashcard = function () {

    // Bierzemy wszystkie wybrane kolekcje. Dodajemy numer karteczek do powtorek.
    // szukamy jednej karteczki, z najwczesniejsza data kolejnego powtorzenia
    // az przejdziemy wszystkie inne od extraRepeat.

    // Pozniej bierzemy karteczki nowe, do nauki.

    // a pozniej extraRepeat

};

var _parseEvaluation = function(evaluation, itemId) {
    hideBackAndEvaluation();
    var _now = moment(Session.get("serverNextDay"))._d;
    var _action = Meteor.flashcard.setNextRepetition(evaluation, itemId, _now);
    switch (_action) {
        case 'decrementExtraRepetitionsLeft':
            decrementExtraRepetitionsLeft();
            break;
        case 'decrementNewFlashcardsLeftAndIncrementExtraRepetitionsTotal':
            incrementExtraRepetitionsTotal();
        case 'decrementNewFlashcardsLeft':
            decrementNewFlashcardsLeft();
            break;
        case 'decrementRepetitionsLeftAndIncrementExtraRepetitionsTotal':
            incrementExtraRepetitionsTotal();
        case 'decrementRepetitionsLeft':
            decrementRepetitionsLeft();
            break;
        case 'incrementExtraRepetitionsTotal':
            incrementExtraRepetitionsTotal();
            break;

    }
}
Template.repeat.events({

    "keydown #answer": function (e) {
        if (e.keyCode === 13 || e.keyCode === 10) {
            e.preventDefault();
            showBackAndEvaluation();
        } else {
            if ($('#evaluate').is(':visible')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var _evaluation;
                switch (e.keyCode) {
                    case 49:  // 1 - blackout
                        _evaluation = 0;
                        break;
                    case 50: // 2 - terrible
                        _evaluation = 1;
                        break;
                    case 51: // 3 - Bad
                        _evaluation = 2;
                        break;
                    case 52: // 4 - Hardly
                        _evaluation = 3;
                        break;
                    case 53: // 5 - Good
                        _evaluation = 4;
                        break;
                    case 54: // 6 - Perfect
                        _evaluation = 5;
                        break;

                }
                if (_evaluation || _evaluation === 0) {
                    var _itemId = $('#evaluate').attr("item-id");
                    console.log("_evaluation", _evaluation);
                    _parseEvaluation(_evaluation, _itemId)
                }
                return;
            }
        }
    },
    "click .btn-show-answer": function (e) {
        e.preventDefault();
        showBackAndEvaluation();
    },
    "click .evaluation": function (e) {
        var _evaluation = parseInt($(e.target).val());
        var _itemId = $('#evaluate').attr("item-id");
        _parseEvaluation(_evaluation, _itemId)
    },
    "click a[href='#picture']": function (e) {
        $(".mainBox").switchClass("col-md-8", "col-md-11", 800, "easeInOutBack");
    },
    "click a[href='#repeatFlashcards']": function (e) {
        $(".mainBox").switchClass("col-md-11", "col-md-8", 800, "easeInOutBack");
    }
});

Template.repeat.newFlashcardsDone = function() {
   var _newFlashcardsDone = Session.get("newFlashcardsTotal") - Session.get("newFlashcardsLeft");
   return _newFlashcardsDone;
}

Template.repeat.repetitionsDone = function() {
    var _repetitionsDone = Session.get("repetitionsTotal") - Session.get("repetitionsLeft");
    return _repetitionsDone;
}

Template.repeat.extraRepetitionsDone = function() {
    var _extraRepetitionsDone = Session.get("extraRepetitionsTotal") - Session.get("extraRepetitionsLeft");
    return _extraRepetitionsDone;
}

Template.repeat.newFlashcardsTotal = function() {
    return Session.get("newFlashcardsTotal");
}

Template.repeat.repetitionsTotal = function() {
    return Session.get("repetitionsTotal");
}

Template.repeat.extraRepetitionsTotal = function() {
    return Session.get("extraRepetitionsTotal");
}



var decrementExtraRepetitionsLeft = function() {
    var _extraRepetitionsLeft = Session.get("extraRepetitionsLeft");
    Session.set("extraRepetitionsLeft", --_extraRepetitionsLeft);
    var _extraRepetitionsTotal = Session.get("extraRepetitionsTotal");


    var _opts = {
        total: _extraRepetitionsTotal,
        left: _extraRepetitionsLeft,
        progressBar: ".barExtraRepetitions"
    }

    resizeTheBar(_opts);
//    setTimeout(function() {
//        $(".progress .bar").progressbar({display_text: 2,
//            use_percentage: false})
//    }, 200);
}



var incrementExtraRepetitionsTotal = function() {
    var _extraRepetitionsTotal = Session.get("extraRepetitionsTotal");
    var _extraRepetitionsLeft = Session.get("extraRepetitionsLeft");
    Session.set("extraRepetitionsTotal", ++_extraRepetitionsTotal);
    Session.set("extraRepetitionsLeft", ++_extraRepetitionsLeft);

    var _opts = {
        total: _extraRepetitionsTotal,
        left: _extraRepetitionsLeft,
        progressBar: ".barExtraRepetitions"
    }

    resizeTheBar(_opts);

//    setTimeout(function() {
//        $(".progress .bar").progressbar({display_text: 2,
//            use_percentage: false})
//    }, 200);
}

var decrementNewFlashcardsLeft = function() {
    var _newFlashcardsLeft = Session.get("newFlashcardsLeft");
    Session.set("newFlashcardsLeft", --_newFlashcardsLeft );
    var _newFlashcardsTotal = Session.get("newFlashcardsTotal");

    var _opts = {
        total: _newFlashcardsTotal,
        left: _newFlashcardsLeft,
        progressBar: ".barNew"
    }

    resizeTheBar(_opts);


//    setTimeout(function() {
//        $(".progress .bar").progressbar({display_text: 2,
//            use_percentage: false})
//    }, 200);
}

var decrementRepetitionsLeft = function() {
    var _repetitionsLeft = Session.get("repetitionsLeft");
    Session.set("repetitionsLeft", --_repetitionsLeft);
    var _repetitionsTotal = Session.get("repetitionsTotal");

    var _opts = {
        total: _repetitionsTotal,
        left: _repetitionsLeft,
        progressBar: ".barRepetitions"
    }

    resizeTheBar(_opts);




//    setTimeout(function() {
//        $(".progress .bar").progressbar({display_text: 2,
//            use_percentage: false})
//    }, 200);
}

//generateRepetitions = function() {
//    var _answers = [
//        [0, 4,
//        5,
//        5,
//        3, 4,
//        4,
//        4,
//        5,
//        2, 4,
//        3, 5,
//        5,
//        5],
//         [3, 5,
//             5,
//             5,
//             4,
//             4,
//             4,
//             2, 4,
//             1, 3, 4,
//             2, 4,
//             3, 5,
//             5,
//             5],
//        [4,
//            5,
//            5,
//            5,
//            4,
//            4,
//            4,
//            3, 4,
//            3, 4,
//            2, 3, 4,
//            2, 4,
//            3, 5,
//            5,
//            5,
//            5],
//        [4,
//            5,
//            5,
//            5,
//            4,
//            4,
//            4,
//            3, 4,
//            3, 4,
//            2, 3, 4,
//            2, 4,
//            3, 5,
//            5,
//            5,
//            5],
//        [3,
//            4,
//            5,
//            5,
//            4,
//            4,
//            4,
//            3, 4,
//            3, 4,
//            2, 3, 4,
//            2, 4,
//            3, 5,
//            5,
//            5,
//            5],
//
//    ];
//    var weight = [0.01, 0.05, 0.15, 0.5, 0.4, 0.4];
//    var list = [0, 1, 2, 3, 4, 5];
//    var rand = function(min, max) {
//        return Math.random() * (max - min) + min;
//    };
//
//    var getRandomItem = function(list, weight) {
//        var total_weight = weight.reduce(function (prev, cur, i, arr) {
//            return prev + cur;
//        });
//
//        var random_num = rand(0, total_weight);
//        var weight_sum = 0;
//        //console.log(random_num)
//
//        for (var i = 0; i < list.length; i++) {
//            weight_sum += weight[i];
//            weight_sum = +weight_sum.toFixed(2);
//
//            if (random_num <= weight_sum) {
//                return list[i];
//            }
//        }
//
//        // end of function
//    };
//    for (var i = 0; i < 100; i++) {
//    Items.find({user: {$ne: "TYMaLrb495sKhfFh4"}}, {sort: {"nextRepetition": 1}, limit: 1}).fetch().forEach(function(item) {
//
//
//        weight[0] = weight[0] + 0.01;
//        weight[1] = weight[1] + 0.02;
//
//        weight[2] = weight[2] + 0.04;
//        weight[3] = weight[3] + 0.1;
//        weight[4] = weight[4] + 0.15;
//        weight[5] = weight[5] + 0.2;
//
//
//
//        var random_evaluation = getRandomItem(list, weight);
//
//            setFakeNextRepetition(random_evaluation, item);
//    })
//    }
//}


//setFakeNextRepetition = function (evaluation, _item) {
//    if (_item) {
//        var _opts = {};
//        _opts.fakeDate = _item.nextRepetition;
//        console.log("_item", _item);
//        if (_item.extraRepeatToday) {
//            if (evaluation >= 4) {
//                _item.extraRepeatToday = false;
//                decrementExtraRepetitionsLeft();
//            }
//            _opts = {
//                easinessFactor: _item.easinessFactor,
//                fakeDate: _item.nextRepetition,
//                extraRepetition: true,
//                evaluation: evaluation
//            }
//            console.log("_opts in extra", _opts);
//        }
//        else {
//            var _tmpNextRepetition = _item.nextRepetition;
//            newParameteres = calculateItem(evaluation, _item.easinessFactor, _item.timesRepeated, _item.previousDaysChange);
//            if (_item.nextRepetition) {
//                _item.nextRepetition = moment(_item.nextRepetition).add("days", newParameteres.daysChange).add("minutes", Math.floor(Math.random() * 30) + 1).seconds(0).milliseconds(0)._d;
//
//            }
//            else {
//                _item.nextRepetition = moment().add("days", newParameteres.daysChange).add("minutes", Math.floor(Math.random() * 30) + 1).seconds(0).milliseconds(0)._d;
//            }
//            //_item.nextRepetition = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
//            _item.easinessFactor = newParameteres.easinessFactor;
//
//            if (newParameteres.resetTimesRepeated) {
//                incrementExtraRepetitionsTotal();
//                _item.extraRepeatToday = true;
//                _item.timesRepeated = 0;
//            }
//            else {
//                if (evaluation === 4) {
//                    _item.extraRepeatToday = true;
//                }
//                _item.timesRepeated++;
//            }
//
//            if (_item.actualTimesRepeated === 0) {
//                decrementNewFlashcardsLeft();
//            } else {
//                decrementRepetitionsLeft();
//            }
//
//
//            _item.actualTimesRepeated++;
//            _item.previousDaysChange = daysChange;
//            _opts = {
//                extraRepetition: false,
//                easinessFactor: _item.easinessFactor,
//                daysChange: _item.previousDaysChange,
//                evaluation: evaluation,
//                fakeDate: _tmpNextRepetition
//            }
//
//        }
//        Items.update(_item._id, {$set: {
//            nextRepetition: _item.nextRepetition,
//            easinessFactor: _item.easinessFactor,
//            extraRepeatToday: _item.extraRepeatToday,
//            timesRepeated: _item.timesRepeated,
//            actualTimesRepeated: _item.actualTimesRepeated,
//            previousDaysChange: _item.previousDaysChange}
//        }, function (err) {
//            if (err) {
//                console.log("err ", err);
//            }
//        });
//
//        var _currentEvaluation = returnCurrentEvaluation(_opts);
//        Items.update({_id: _item._id}, {$addToSet: {previousAnswers: _currentEvaluation}});
//    }
//
//}






showBackAndEvaluation = function () {
    $(".btn-show-answer").hide();
    $(".currentFlashcard > .back").show('400', function () {
        $(".currentFlashcard > .evaluate").show('400', function () {
//            $("#answer").focus();
        })
    })
    var _item = Items.findOne({_id: Session.get("currentItemId")});
    if (_item) {
        var _opts = {
            flashcardId: _item.flashcard,
            itemId: _item._id
        }
        checkIfFlashcardUpdated(_opts);
    }
};

hideBackAndEvaluation = function () {
    var _fDiv = $(".flashcards");
    _fDiv.animate({"left": (_fDiv.width() + 40) * -1}, 500, "easeInOutBack", function () {
            displayNextRepetition();
            $(".currentFlashcard > .answer").html("");
            $(".currentFlashcard > .evaluate").hide('10');
            $(".currentFlashcard > .back").hide('10');
            _fDiv.css({"left": (_fDiv.width() + 40)}).animate({"left": 0}, 500, "easeInOutBack");
            $(".btn-show-answer").show();
        }
    )
};

var checkIfFlashcardUpdated = function(opts) {
    var _item = Items.findOne({user: Meteor.userId(), _id: opts.itemId});
    var _flashcard = Flashcards.findOne(opts.flashcardId);

    if (_item && _flashcard && _item.flashcardVersionSeen < _flashcard.version) {
        $("#newFlashcardVersionModal").modal("show").on("hidden", function() {
//            console.log("are we ever here in hidden modal");
        });
    }
}

