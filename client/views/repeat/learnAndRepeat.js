var _renderer, _itemsToLearnCount = 0;
Template.myCollectionsList.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
};

Template.myCollectionsList.itemsInCollection = function() {
    return Items.find({user: Meteor.userId(), collection: this._id}).count();
}

Template.myCollectionsList.itemsToLearn = function() {
    var _itemsToLearn = Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: 0}).count();
    _itemsToLearnCount += _itemsToLearn;
    return _itemsToLearn;
}

Template.myCollectionsList.itemsToRepeat = function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    return Items.find({user: Meteor.userId(), collection: this._id, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count()
}

Template.myCollectionsList.itemsToReLearn = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, extraRepeatToday: true}).count();
}

Template.myCollectionsList.learnedItems = function() {
    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: {$gt: 0}, extraRepeatToday: false}).count();
}

Template.myCollectionsList.anyItemsToLearn = function() {
    return (_itemsToLearnCount > 0) ? true : false;
}