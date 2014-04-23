Meteor.publish("userData", function () {
    return Meteor.users.find({
        _id: this.userId
    }, {
        fields: {
            'identity': 1,
            'points': 1,
            'achievements': 1,
            'profile': 1,
            'collections': 1,
            'courses': 1
        }
    });
});

Meteor.publish("usersPaginated", function (opts, limit) {
    var _query = {};
    if (opts.search) {
        _query = {"_id": {$ne: this.userId}, "identity.nick": new RegExp(opts.search, "i")};
    }
    return Meteor.users.find(_query, {options: {limit: limit}, fields: {
        'identity': 1,
        'points': 1,
        'profile': 1,
        'achievements': 1}});
});

Meteor.publish("otherUser", function(id){
    if (id) {
        return  Meteor.users.find({_id: id}, {fields: {
            'identity': 1,
            'points': 1,
            'profile': 1,
            'achievements': 1
        }})
    }
    return Meteor.users.find({}, {fields: {_id: 1}, limit: 1});
})