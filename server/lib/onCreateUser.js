//callback for all user creation
Accounts.onCreateUser(function (options, user) {


    if (options._id) {
        user._id = options._id;
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


    if (options.achievements) {
        user.achievements = options.achievements;
    }
    else {
        _.extend(user, {
            "achievements": []
        });


    }

    if (options.profile) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        user.profile = options.profile;
    }


    return user;
});
