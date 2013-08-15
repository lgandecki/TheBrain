

_getName = function(userId) {
    var _user = Meteor.users.findOne(userId);
    if (_user && _user.identity) {
        return _user.identity.nick;
    }
}

_getFullName = function(userId) {
    var _user = Meteor.users.findOne(userId);
    if (_user && _user.name && _user.name.firstName) {
        return _user.name.firstName + " " + _user.name.lastName;
    }
    else if (_user && _user.identity) {
            return _user.identity.nick;
    }
}

_getProfilePicture = function(userId) {
    var _user = Meteor.users.findOne(userId);
    if (_user && _user.profile) {
        return _user.profile.picture;
    }
}



if (!Meteor.userDetails) Meteor.userDetails = {};
_.extend(Meteor.userDetails, {
    getName: _getName,
    getFullName: _getFullName,
    getProfilePicture: _getProfilePicture

});