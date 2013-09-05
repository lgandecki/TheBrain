//callback for all user creation
Accounts.onCreateUser(function (options, user) {


    if (options._id) {
        user._id = options._id;
    }
    else {
        // user._id = 
    }

    if (options.identity) {
        user.identity = options.identity;
    } else {
        _.extend(user, {
            identity: {
                name: { firstName: '', lastName: '' },
                "nick": ""
            }
        });
    }

    user.points = options.points ? options.points : 0;

    if (options.collections) {
        user.collections = options.collections;
    }
    else {
        _.extend(user, {
            "collections": [
            {
                "_id": new Meteor.Collection.ObjectID()._str,
                "name": "Main collection"
            }]
        })
    }

    if (options.achievements) {
        user.achievements = options.achievements;
    }
    else {
        _.extend(user, {
            "achievements": []
        });


    }

    user.courses = [];

    if (options.profile && options.profile.picture) {
        user.profile = options.profile;
    }
    else if (options.profile) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square";
        user.profile = options.profile;
        _fbName = user.profile.name.split(" ");
        _fbNameLength = _fbName.length;
        _firstName = _fbName[0];
        _lastName = _fbName[_fbNameLength-1];
        user.identity.nick = _firstName + " " + _lastName;
        user.identity.name.firstName = _firstName;
        user.identity.name.lastName = _lastName;
    } else {
        user.identity.nick = user.emails[0].address.split("@")[0];
        user.profile = {
            picture: "http://elpaso.coloradogop.us/images/ui2013/dummy_user.png"
        };
    }


    return user;
});
