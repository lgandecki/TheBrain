var _returnSide = function(side, isNew) {
    var _selector;
    if (isNew) {
        if (side === "front") {
            _selector = "#newFront .flashcardFront"
        }
        else {
            _selector = "#newBack .flashcardBack"
        }
    }
    else {
        if (side === "front") {
            _selector = "#front .flashcardFront";
        }
        else {
            _selector = "#back .flashcardBack";
        }
    }

    var html = $(_selector).html();
    var justText = $(_selector).justtext();
    var html2 = html.replace(justText, "<div>"+justText+"</div>")
    $(_selector).html(html2);
    var _side = "";

    $.each($(_selector).children(), function(key, value) {
        if (_side !== "") {
            _side = _side + "\n" + $(value).text();
        }
        else {
            _side = $(value).text();
        }

    })
    console.log("_side", _side);
    console.log("selector", _selector);
    return _side;
}


var _returnFront = function (isNew) {
    return _returnSide("front", isNew);
}

var _returnBack = function(isNew) {
    return _returnSide("back", isNew);
}

var _showSide = function(opts) {
    var _side = _stripHtml(opts.side);
    _side = _side.replace(/\n/g, "<br />");

    if (opts.note) {
        _side = _side + "<br/><span class='note'>" + stripHtml(opts.note) + "</span>";
    }

    if (opts.picture) {
        _side = '<a href="' + opts.picture + '" class="flashcardPicture pull-right slimboxPicture" title="' + opts.side + '"> \
        <img src="' + opts.picture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div class="flashcardFront">' + _side + '</div>';
    }

    return _side;
}

var _stripHtml = function (str) {
    return jQuery('<div />', { html: str }).text();
}

if (!Meteor.flashcard) Meteor.flashcard = {};
_.extend(Meteor.flashcard, {
    returnFront: _returnFront,
    returnBack: _returnBack,
    showSide: _showSide
});