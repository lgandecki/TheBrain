Items = new Meteor.Collection('items');

Items.allow({

    'insert': ownsDocument,
    'update': ownsDocument,
    'remove': ownsDocument

});