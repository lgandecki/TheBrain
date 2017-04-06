TheBrain = new Meteor.Collection('theBrain');

TheBrain.allow({

    'insert': function() {
        return false;
    },
    'update': function() {
        return false;
    },
    'remove': function() {
        return false;
    }

});

Meteor.methods({
    newConnection: function () {
          Meteor.theBrain.addConnections(15);
    }
});

