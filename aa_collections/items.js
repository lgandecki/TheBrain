Items = new Meteor.Collection('items');

Items.allow({

    'insert': ownsDocument,
    'update': ownsDocument,
    'remove': ownsDocument

});


Meteor.methods({
    updateItem: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        var _item = Items.findOne({_id: opts.itemId, user: user._id});
        if (!_item)
            throw new Meteor.Error(403, "You can update personal information only on your personal flashcard");

        console.log("opts", opts);

        Items.update({_id: opts.itemId},
            {$set: {
                frontNote: opts.frontNote || _item.frontNote,
                backNote: opts.backNote || _item.backNote,
                personalFront: opts.personalFront || _item.personalFront,
                personalBack: opts.personalBack || _item.personalBack,
                personalFrontPicture: opts.personalFrontPicture || _item.personalFrontPicture,
                personalBackPicture: opts.personalBackPicture || _item.personalBackPicture,
                flashcardVersion: opts.flashcardVersion || _item.flashcardVersion,
                flashcardVersionSeen: opts.flashcardVersionSeen || _item.flashcardVersionSeen
            }
            });

    },
    useUpdatedFlashcardVersion: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        var _query = {_id: opts.itemId, user: user._id};
        console.log("_query", _query);
        var _item = Items.findOne(_query);
        if (!_item)
            throw new Meteor.Error(403, "You can update personal information only on your personal flashcard");

        var _flashcard = Flashcards.findOne({_id: opts.flashcardId});

        if (!_flashcard)
            throw new Meteor.Error(401, "Your update has to be based on existing flashcard");

//        var _selectedFlashcard = returnSelectedFlashcardVersion(_flashcard, opts.selectedVersion);
        var _selectedFlashcard;
        if (_flashcard.version === opts.selectedVersion) {
            _selectedFlashcard = _flashcard;
        }
        else {
            _selectedFlashcard = $.grep(_flashcard.previousVersions, function (previousVersion) {
                return previousVersion.version === opts.selectedVersion;
            });
        }
        var _opts = {};
        _opts.itemId = _item._id;
        _opts.personalFront = _selectedFlashcard.front;
        _opts.personalBack = _selectedFlashcard.back;
        _opts.personalFrontPicture = _selectedFlashcard.frontPicture;
        _opts.personalBackPicture = _selectedFlashcard.backPicture;
        _opts.flashcardVersion = _selectedFlashcard.version;
        _opts.flashcardVersionSeen = _flashcard.version;

        Meteor.call("updateItem", _opts);

    },
    extraRepeatItems: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        if (!opts.items) {
            throw new Meteor.Error(401, "You have to specify the list of Flashcards");
        }

        Items.update({_id: { $in: opts.items }, user: user._id, actualTimesRepeated: {$gt: 0}}, {$set: { extraRepeatToday: true}}, {multi: true});

    },
    examModeSchedule: function(opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");
        if (Meteor.isServer) {
            var _items = Items.find({user: user._id, collection: opts.collectionId, actualTimesRepeated: {$gt: 0}}, {limit: opts.items, sort: {easinessFactor: 1}}).fetch();
            var _itemIds = [];
            _items.forEach(function(item) {
                _itemIds.push(item._id);
            })
            var _opts = {
                items: _itemIds
            }
            console.log("_opts", _opts);
            Meteor.call("extraRepeatItems", _opts);
        }
    },
    changeItemsCollection: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        if (!opts.items) {
            throw new Meteor.Error(401, "You have to specify the list of flashcards");
        }

        if (!opts.newCollectionId) {
            throw new Meteor.Error(403, "You have to specify the new collection");
        }

        Items.update({_id: {$in: opts.items}, user: user._id}, {$set: {collection: opts.newCollectionId}}, {multi: true});
    },
    deactivateItems: function(opts) {
        var _user = Meteor.user();
        if (!_user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        if (!opts.items) {
            throw new Meteor.Error(401, "You have to specify the list of flashcards");
        }
        var _deactivatedCollectionId = Meteor.collections.returnId("Deactivated");

        if (!_deactivatedCollectionId) {
            var _opts = {
                name: "Deactivated"
            };
            _deactivatedCollectionId = Meteor.call("newCollection", _opts);
        }

        console.log("_deactivatedCollectionId", _deactivatedCollectionId);

        opts.items.forEach(function(item) {
            var _item = Items.findOne({_id: item, user: _user._id});
            if (_item) {
                Items.update({_id: _item._id}, {$set: {deactivated: true, previousCollection: _item.collection, collection: _deactivatedCollectionId}})
            }
        })

    },
    activateItems: function(opts) {
        var _user = Meteor.user();
        if (!_user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        if (!opts.items) {
            throw new Meteor.Error(401, "You have to specify the list of flashcards");
        }

        opts.items.forEach(function(item) {
            var _item = Items.findOne({_id: item, user: _user._id});
            if (_item) {
                Items.update({_id: _item._id}, {$set: {deactivated: false, collection: _item.previousCollection}})
            }
        })
    }
})
//
//function returnSelectedFlashcardVersion(flashcard, selectedVersion) {
//    var _selectedFlashcard;
//    if (flashcard.version === selectedVersion) {
//        _selectedFlashcard = _flashcard;
//    }
//    else {
//        _selectedFlashcard = $.grep(flashcard.previousVersions, function (previousVersion) {
//            return previousVersion.version === selectedVersion;
//        });
//    }
//    return _selectedFlashcard
//}