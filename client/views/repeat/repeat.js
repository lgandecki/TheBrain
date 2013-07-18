var currentFlashcard, currentItemId, itemsToLearn = [], _renderer, _renderer2;

Meteor.subscribe("itemFlashcards");

function getNextItem() {
    currentItem = Items.findOne();
    console.log("jestesmy tutaj " + currentItem);
    if (currentItem) {
        console.log("a pozniej tutaj " + currentFlashcard);
        currentFlashcard = Flashcards.findOne(currentItem.flashcard);
    }
}

function returnNextItem() {
    // Najpierw powtorki
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    var _nextItem = "";

    // Repetition first
    if (ItemFlashcards.find({nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count() > 0) {
        console.log("Repetition");
        _nextItem = ItemFlashcards.findOne({nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}});
        return _nextItem;
    }


    // Items to learn
    for (var collectionId in itemsToLearn) {
        console.log("collectionId " + collectionId);
        if (itemsToLearn.hasOwnProperty(collectionId) && itemsToLearn[collectionId] > 0) {
            console.log("second step,, items To learn " + itemsToLearn[collectionId]);
            _currentCollectionItemsToLearn = ItemFlashcards.find({collection: collectionId, actualTimesRepeated: 0}).count();
            console.log("collections count " + _currentCollectionItemsToLearn);
            console.log("currentCollection " + collectionId);
            if (_currentCollectionItemsToLearn && _currentCollectionItemsToLearn > 0) {
                if (itemsToLearn[collectionId] > _currentCollectionItemsToLearn) {
                    itemsToLearn[collectionId] = _currentCollectionItemsToLearn;
                }
                else {
                    itemsToLearn[collectionId]--;
                }
                _nextItem = ItemFlashcards.findOne({collection: collectionId, actualTimesRepeated: 0});
                console.log("Items to learn");
                return _nextItem;
            }
            else {
                delete itemsToLearn[collectionId];
            }
        }
    }

    _nextItem = ItemFlashcards.findOne({extraRepeatToday: true});
    return (_nextItem) ? _nextItem : false;
    // Items to reLearn
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
                console.log("Are we supposed to show the modal?");

                $("#scheduleModal").modal("show").on('hidden', function() {
                    displayNextRepetition();
                });
            }
            else {
                console.log("Or not?");
                displayNextRepetition();
            }
        }


    }, 150);
};

Template.repeat.destroyed = function() {
    Session.set("showScheduleModal", false);
    _firstRender = true;
}

displayNextRepetition = function() {
    _nextItem = returnNextItem();
    console.log("nextItem ", _nextItem);
    if (_nextItem) {
        currentItemId = _nextItem;
        fillTemplate();
    }
    else {
        emptyTemplate();
        $("#doneForTodayModal").modal("show").on('hidden', function() {
            Meteor.Router.to("/");
        });
        // Info that you've done all repetitions for given day.
    }
}

fillTemplate = function() {
    var _currentItem = ItemFlashcards.findOne(currentItemId);
    front = (_currentItem.personalFront) ? personalFront : _currentItem.flashcardObject.front;
    back =  (_currentItem.personalBack) ? personalBack : _currentItem.flashcardObject.back;

    $(".currentFlashcard > .front").val(front);
//    $(".currentFlashcard > .answer").focus();
$(".currentFlashcard > .back").val(back)
$(".currentFlashcard > .evaluate").attr("item-id", _currentItem._id);

}

emptyTemplate = function() {
    $(".currentFlashcard > .front").val("");
    $(".currentFlashcard > .answer").val("").prop("disabled", true);
    $(".currentFlashcard > .back").val("");
    $(".currentFlashcard > .answer").prop("disabled", true);
}

Template.repeat.currentFlashcard = function () {

    // Bierzemy wszystkie wybrane kolekcje. Dodajemy numer karteczek do powtorek.
    // szukamy jednej karteczki, z najwczesniejsza data kolejnego powtorzenia
    // az przejdziemy wszystkie inne od extraRepeat.

    // Pozniej bierzemy karteczki nowe, do nauki.

    // a pozniej extraRepeat

};

Template.repeat.events({

    "keyup .answer": function (e) {
        if (e.keyCode === 13 || e.keyCode === 10) {
            e.preventDefault();
            showBackAndEvaluation();
        }
    },
    "click .btn-show-answer": function(e) {
        e.preventDefault();
        $(".btn-show-answer").removeClass("visible-phone").hide();
        showBackAndEvaluation();
    },
    "click .evaluation": function (e) {
        hideBackAndEvaluation();
        var _evaluation = $(e.target).val();
        var _itemId = $(e.target).parent().attr("item-id");
        var _item = Items.findOne(_itemId);
        setNextRepetition(_evaluation, _item);
    }, 
    "click a[href='#picture']": function (e) {
        console.log("click on picture");
        $(".mainBox").switchClass("span8", "span12");
    },
    "click a[href='#repeatFlashcards']": function (e) {
        $(".mainBox").switchClass("span12", "span8");
    }
});

setNextRepetition = function (evaluation, _item) {
    console.log("evaluation " + evaluation + " itemID " + _item._id);
    if (_item) {
        if (_item.extraRepeatToday) {
            if (evaluation >= 3) {
                _item.extraRepeatToday = false;
            }
        }
        else {
            newParameteres = calculateItem(evaluation, _item.easinessFactor, _item.timesRepeated, _item.previousDaysChange);

            _item.nextRepetition = moment().add("days", newParameteres.daysChange).hours(0).minutes(0).seconds(0).milliseconds(0)._d;
            //_item.nextRepetition = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
            _item.easinessFactor = newParameteres.easinessFactor;

            if (newParameteres.resetTimesRepeated) {
                _item.extraRepeatToday = true;
                _item.timesRepeated = 0;
            }
            else {
                _item.timesRepeated++;
            }
            _item.actualTimesRepeated++;
            _item.previousDaysChange = daysChange;

        }
        console.log("_item._id " + _item._id + "user " + _item.user);
        Items.update(_item._id, {$set: {
            nextRepetition: _item.nextRepetition,
            easinessFactor: _item.easinessFactor,
            extraRepeatToday: _item.extraRepeatToday,
            timesRepeated: _item.timesRepeated,
            actualTimesRepeated: _item.actualTimesRepeated,
            previousDaysChange: _item.previousDaysChange}
        }, function(err) {
            if (err) {
                console.log("err " + err);
            }
        });
    }

}

calculateItem = function (evaluation, easinessFactor, timesRepeated, previousDaysChange) {
    resetTimesRepeated = false;
    easinessFactor = calculateEasinessFactor(evaluation, easinessFactor);
    if (evaluation < 3) {
        daysChange = 1;
        resetTimesRepeated = true;
    }
    else if (timesRepeated == 0) {
        daysChange = 1;
    }
    else if (timesRepeated == 1) {
        daysChange = 5;
    }
    else {
        daysChange = Math.round(previousDaysChange * easinessFactor);
    }
    return {
        'daysChange': daysChange,
        'easinessFactor': easinessFactor,
        'resetTimesRepeated': resetTimesRepeated
    }
};

calculateEasinessFactor = function (evaluation, easinessFactor) {
    easinessFactor = roundToTwo(easinessFactor - 0.8 + (0.28 * evaluation) - (0.02 * evaluation * evaluation));
    return (easinessFactor >= 1.3) ? easinessFactor : 1.3;
}

roundToTwo = function (value) {
    return(Math.round(value * 100) / 100);
}
showBackAndEvaluation = function () {
    $(".currentFlashcard > .answer").blur();
    $(".currentFlashcard > .evaluate").focus();
    $(".currentFlashcard > .back").css({"visibility": ""}).show('400', function () {
        $(".currentFlashcard > .evaluate").css({"visibility": ""}).show('400', function () {
            $(".answer").focus();
        })
    })
};

hideBackAndEvaluation = function () {
    _fDiv = $(".flashcards");
    _fDiv.animate({"left": (_fDiv.width() + 40) * -1}, function() {
        displayNextRepetition();
        $(".currentFlashcard > .answer").val("");
        $(".currentFlashcard > .evaluate").css({"visibility": "hidden"}).hide('10');
        $(".currentFlashcard > .back").css({"visibility": "hidden"}).hide('10');
        _fDiv.css({"left": (_fDiv.width() + 40)}).animate({"left": 0});
        $(".btn-show-answer").addClass("visible-phone").show();
    }
    )
};


Template.myCollectionsList.rendered = function() {
    window.clearTimeout(_renderer2);
    _renderer2 = window.setTimeout(function () {
        var _sliderTimeout;
        _collectionId = "";
        $(".slider-custom").slider({value: 0}).on("slideStart", function(ev) {
            _collectionId = $(this).attr("data-id");
            itemsToLearn[_collectionId] = ev.value;
        }).on("slide", function(ev) {
                if (itemsToLearn[_collectionId] !== ev.value) {
                    
                    $(".toLearn.editable[data-id='"+ _collectionId + "']").editable("setValue", ev.value);
                    itemsToLearn[_collectionId] = ev.value;
            }
        });

//        $.fn.editable.defaults.mode = 'inline';
$(".toLearn.editable:not(.editable-click)").editable('destroy').editable({
    anim: '100',
    mode: 'inline',
    showbuttons: false,
    success: function(response, newValue) {
        _collectionId = $(this).attr("data-id");
        $(".slider-custom[data-id='" + _collectionId + "']").slider("setValue", newValue);

        itemsToLearn[_collectionId] = newValue;
    },
    validate: function(value) {
        _value = parseFloat(value);
        var intRegex = /^\d+$/;
        if (!intRegex.test(_value)){
            return "Has to be decimal";
        }
    }

})

}, 150);
}

