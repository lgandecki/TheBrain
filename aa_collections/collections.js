Meteor.methods({
    newCollection: function (collectionAttributes) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new collection");
        if (!collectionAttributes.name) {
            throw new Meteor.Error(422, "Please fill the name of your collection");
        }

        var collection = _.extend(_.pick(collectionAttributes, "name"), {
            _id: new Meteor.Collection.ObjectID()._str
        });

        Meteor.users.update({_id: user._id}, {$addToSet: {collections: collection}});
        //Meteor.theBrain.addConnections(10);
        return collection._id;
    }
})