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

        Items.update({_id: opts.itemId},
            {$set: {
                frontNote: opts.frontNote || _item.frontNote,
                backNote: opts.backNote || _item.backNote,
                personalFront: opts.personalFront || _item.personalFront,
                personalBack: opts.personalBack || _item.personalBack,
                personalFrontPicture: opts.personalFrontPicture || _item.personalFrontPicture,
                personalBackPicture: opts.personalBackPicture || _item.personalBackPicture,
                flashcardVersion: opts.flashcardVersion || _item.flashcardVersion,
                flashcardVersioneen: opts.flashcardVersionSeen || _item.flashcardVersionSeen
            }
            });

    }
})