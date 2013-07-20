var _renderer;

Template.myCollections.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
};

Template.myCollections.rendered = function() {
}

Template.myCollections.itemsToLearn = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: 0}).count();
}

Template.myCollections.itemsToRepeat = function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    return Items.find({user: Meteor.userId(), collection: this._id, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count()
}

Template.myCollections.itemsToReLearn = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, extraRepeatToday: true}).count();
}

Template.myCollections.learnedItems = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: {$gt: 0}, extraRepeatToday: false}).count();
}