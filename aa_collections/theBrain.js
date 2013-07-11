TheBrain = new Meteor.Collection('theBrain');

TheBrain.allow({

    'insert': false,
    'update': false,
    'remove': false

});

Meteor.methods({
    newConnection: function () {
          Meteor.theBrain.addConnections(15);
    }
});

