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
    extraRepeatItems: function(opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to update flashcards");

        if (!opts.items) {
            throw new Meteor.Error(401, "You have to specify the list of Flashcards");
        }

        Items.update({_id: { $in : opts.items }, user: user._id}, {$set: { extraRepeatToday: true}}, {multi: true});

    },
    changeItemsCollection: function(opts) {
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
    }
})