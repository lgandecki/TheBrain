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
        _query = {"identity.nick": new RegExp(opts.search, "i")};
    }
    return Meteor.users.find(_query, {options: {limit: limit}});
});

Meteor.publish("otherUser", function(id){
    return id && Meteor.users.find({_id: id}, {fields: {
        'identity': 1,
        'points': 1,
        'profile': 1,
        'achievements': 1
    }})
})