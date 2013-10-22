var _returnName = function (collectionId) {
    var _user = Meteor.user();

    if (_user) {
        var _collectionIndex = _.indexOf(_.pluck(_user.collections, '_id'), collectionId);

        if (_collectionIndex > -1 && _user.collections && _user.collections[_collectionIndex]) {
            return _user.collections[_collectionIndex].name;
        }
    }

    else {
        return "My Flashcards";
    }
}

var _returnItemsIn = function (collectionId) {
    Meteor.subscribe("itemsInCount", collectionId);
    var _itemsIn = ItemsInCount.findOne({_id: collectionId});
    if (_itemsIn){
        return _itemsIn.count;
    }
}

if (!Meteor.collections) Meteor.collections = {};
_.extend(Meteor.collections, {
    returnName: _returnName,
    returnItemsIn: _returnItemsIn
});