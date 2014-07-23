var _setNextRepetition = function (evaluation, _itemId, _now) {
    var _return = "";
    console.log("hello from inside setNext", _itemId);
    var _item = _itemId && Items.findOne(_itemId);
    if (_item) {
        console.log("not getting even here?", Meteor.userId());
        if (!_now) {
            Meteor.call("getServerNextDay", function (error, result) {
                _now = result;
            });
        }

        var _opts = {};
        var _item2 = Items.findOne({_id: _itemId, user: Meteor.userId(), nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}});
        if (!_item2 && _item.extraRepeatToday) {
            console.log("deeper inside");
            // check if the time..
            if (evaluation >= 4) {
                _item.extraRepeatToday = false;
                _return = "decrementExtraRepetitionsLeft";
//                decrementExtraRepetitionsLeft();
            }
            _opts = {
                easinessFactor: _item.easinessFactor,
                extraRepetition: true,
                evaluation: evaluation
            }
        }
        else {
            console.log('deeper inside2');
            var newParameteres = _calculateItem(evaluation, _item.easinessFactor, _item.timesRepeated, _item.previousDaysChange);

            _item.nextRepetition = moment(_now).add("days", newParameteres.daysChange-1).add("hours", 6)._d;
            //_item.nextRepetition = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
            _item.easinessFactor = newParameteres.easinessFactor;

            if (newParameteres.resetTimesRepeated) {
                _return = "incrementExtraRepetitionsTotal";

                _item.extraRepeatToday = true;
                _item.timesRepeated = 0;
            }
            else {
                console.log("evaluation", evaluation);
                if (evaluation === 3) {
                    console.log("are we inside?");
                    _return = "incrementExtraRepetitionsTotal";

                    _item.extraRepeatToday = true;
                }
                _item.timesRepeated++;
            }

            if (_item.actualTimesRepeated === 0) {
                if (_return === "incrementExtraRepetitionsTotal") {
                    _return = "decrementNewFlashcardsLeftAndIncrementExtraRepetitionsTotal";
                } else {
                    _return = "decrementNewFlashcardsLeft";
                }

            } else {
                if (_return === "incrementExtraRepetitionsTotal") {
                    _return = "decrementRepetitionsLeftAndIncrementExtraRepetitionsTotal";
                } else {
                    _return = "decrementRepetitionsLeft";
                }

            }


            _item.actualTimesRepeated++;
            _item.previousDaysChange = daysChange;
            _opts = {
                extraRepetition: false,
                easinessFactor: _item.easinessFactor,
                daysChange: _item.previousDaysChange,
                evaluation: evaluation
            }

        }
        var _repetitionTime = Meteor.moment.fullNow();
        Items.update(_item._id, {$set: {
            nextRepetition: _item.nextRepetition,
            easinessFactor: _item.easinessFactor,
            extraRepeatToday: _item.extraRepeatToday,
            timesRepeated: _item.timesRepeated,
            actualTimesRepeated: _item.actualTimesRepeated,
            previousDaysChange: _item.previousDaysChange,
            lastRepetition: _repetitionTime}
        }, function (err) {
            if (err) {
                console.log("err ", err);
            }
        });

        var _currentEvaluation = _returnCurrentEvaluation(_opts);
        Items.update({_id: _item._id}, {$addToSet: {previousAnswers: _currentEvaluation}});
        return _return;
    }

}

var _returnCurrentEvaluation = function (opts) {
    var _now = Meteor.moment.fullNow();
    var _currentEvaluation = {
        evaluation: opts.evaluation,
        date: opts.fakeDate || _now,
    }
    if (Meteor.isServer) {
        _currentEvaluation.answer = "No answer. Evaluated with Iphone app";
    }
    else {
        _currentEvaluation.answer = $(".currentFlashcard > .answer").text() || "No answer provided";

    }
    if (opts.extraRepetition) {
        _currentEvaluation.extraRepetition = true;
    }
    else {
        _currentEvaluation.extraRepetition = false;
        _currentEvaluation.daysChange = opts.daysChange;
    }
    _currentEvaluation.easinessFactor = opts.easinessFactor;
    return _currentEvaluation;
}

var _calculateItem = function (evaluation, easinessFactor, timesRepeated, previousDaysChange) {
    resetTimesRepeated = false;
    easinessFactor = _calculateEasinessFactor(evaluation, easinessFactor);
    if (evaluation < 3) {
        daysChange = 1;
        resetTimesRepeated = true;
    }
    else if (timesRepeated === 0) {
        daysChange = 1;
    }
    else if (timesRepeated === 1) {
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

var _calculateEasinessFactor = function (evaluation, easinessFactor) {
    easinessFactor = roundToTwo(easinessFactor - 0.8 + (0.28 * evaluation) - (0.02 * evaluation * evaluation));
    if (easinessFactor <= 1.3 ) {
        return 1.3;
    }
    else if (easinessFactor >= 3.0 ) {
        return 3.0;
    }
    else {
        return easinessFactor;
    }
}


roundToTwo = function (value) {
    return(Math.round(value * 100) / 100);
}

var _returnEvaluationName = function(evaluation) {
    var _evaluationName;
    switch (parseInt(evaluation)) {
        case 0:
            _evaluationName = "Blackout";
            break;
        case 1:
            _evaluationName = "Terrible";
            break;
        case 2:
            _evaluationName = "Bad";
            break;
        case 3:
            _evaluationName = "Hardly";
            break;
        case 4:
            _evaluationName = "Good";
            break;
        case 5:
            _evaluationName = "Perfect!";
            break;
    }
    return _evaluationName ? _evaluationName : "";
}

if (!Meteor.flashcard) Meteor.flashcard = {};
_.extend(Meteor.flashcard, {
    setNextRepetition: _setNextRepetition,
    returnEvaluationName: _returnEvaluationName
});