_addConnections = function(connections) {

    TheBrain.update({_id: "global"}, {$inc: {connections: connections}});

}


if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};
_.extend(Meteor.theBrain, {
    addConnections: _addConnections
});