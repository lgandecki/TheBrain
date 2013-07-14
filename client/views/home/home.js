var _renderer;
Template.collections.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
};


Template.collections.rendered = function() {
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function () {
        $(".slider-custom").slider();
//        $.fn.editable.defaults.mode = 'inline';
        $(".toLearn.editable:not(.editable-click)").editable('destroy').editable({
            anim: '100',
            mode: 'inline',
            showbuttons: false,
            success: function(response, newValue) {
                console.log("newValue " + newValue + "collection Id " + $(this).attr("data-id"));
            },
            validate: function(value) {
                if (result > Math.floor(result)) {
                    return "Has to be decimal";
                }
            }

        })

    }, 150);
}

Template.collections.itemsToLearn = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: 0}).count();
}

Template.collections.itemsToRepeat = function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    return Items.find({user: Meteor.userId(), collection: this._id, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count()
}

Template.collections.itemsToReLearn = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, extraRepeatToday: true}).count();
}

Template.collections.learnedItems = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: {$gt: 0}, extraRepeatToday: false}).count();
}