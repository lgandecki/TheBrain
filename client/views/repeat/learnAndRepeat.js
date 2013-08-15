var _renderer, _itemsToLearnCount = 0;
Template.myCollectionsList.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
};

Template.myCollectionsList.itemsInCollection = function() {
    Meteor.subscribe("itemsInCount", this._id);
    var _itemsIn = ItemsInCount.findOne({_id: this._id});
    if (_itemsIn){
        return _itemsIn.count;
    }
//    return Items.find({user: Meteor.userId(), collection: this._id}).count();
}

Template.myCollectionsList.itemsToLearn = function() {
    Meteor.subscribe("itemsToLearnInCount", this._id);
    var _itemsToLearnIn = ItemsToLearnInCount.findOne({_id: this._id});
    if (_itemsToLearnIn) {
        _itemsToLearnCount += _itemsToLearnIn.count;
        return _itemsToLearnIn.count;
    }

//    var _itemsToLearn = Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: 0}).count();
//    _itemsToLearnCount += _itemsToLearn;
//    return _itemsToLearn;
}

Template.myCollectionsList.itemsToRepeat = function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    Meteor.subscribe("itemsToRepeatInCount", this._id, _now);
    var _itemsToRepeatIn = ItemsToRepeatInCount.findOne({_id: this._id});
    if (_itemsToRepeatIn){
        return _itemsToRepeatIn.count;
    }
//    return Items.find({user: Meteor.userId(), collection: this._id, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count()
}

Template.myCollectionsList.itemsToReLearn = function() {
    Meteor.subscribe("itemsToReLearnInCount", this._id);
    var _itemsToReLearnIn = ItemsToReLearnInCount.findOne({_id: this._id});
    if (_itemsToReLearnIn){
        return _itemsToReLearnIn.count;
    }
//    return Items.find({user: Meteor.userId(), collection: this._id, extraRepeatToday: true}).count();
}

Template.myCollectionsList.learnedItems = function() {
    Meteor.subscribe("learnedItemsInCount", this._id);
    var _learnedItemsIn = LearnedItemsInCount.findOne({_id: this._id});
    if (_learnedItemsIn){
        return _learnedItemsIn.count;
    }
//    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: {$gt: 0}, extraRepeatToday: false}).count();
}

Template.myCollectionsList.noItemsToLearn = function() {

        console.log(_itemsToLearnCount);
        setTimeout(function() {
            return (_itemsToLearnCount && _itemsToLearnCount > 0) ? false : true;
        }, 200);

}