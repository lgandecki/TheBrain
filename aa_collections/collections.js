Collections = new Meteor.Collection("collections");

Collections.allow({

    'insert': ownsDocument,
    'update': ownsDocument,
    'remove': ownsDocument

});

Meteor.methods({
    newCollection: function (collectionAttributes) {
        console.log("ever here?");
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new collection");

        if (!collectionAttributes.name)
            throw new Meteor.Error(422, "Please fill the name of your collection");

        var collection = _.extend(_.pick(collectionAttributes, "name"), {
            user: user._id
        });

        Collections.insert(collection);
    }
})