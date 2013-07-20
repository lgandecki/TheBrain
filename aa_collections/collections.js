Meteor.methods({
    newCollection: function (collectionAttributes) {
        console.log("ever here?");
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new collection");
        console.log("after user");
        if (!collectionAttributes.name) {
            console.log("collectionAttributes", collectionAttributes);
            console.log("are we getting error?");
            throw new Meteor.Error(422, "Please fill the name of your collection");
        }
        console.log("after name");

        var collection = _.extend(_.pick(collectionAttributes, "name"), {
            _id: new Meteor.Collection.ObjectID()._str
        });

        console.log("POjawiamy sie tutaj?");
        Meteor.users.update({_id: user._id}, {$addToSet: {collections: collection}});
        //Meteor.theBrain.addConnections(10);
        return collection._id;
    }
})