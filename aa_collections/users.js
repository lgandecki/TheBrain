Meteor.methods({
    addEmailFromFacebook: function() {
        console.log("Doing the addEmail");
        var _user = Meteor.user();
        if (Meteor.isServer) {
            if (!_user)
                throw new Meteor.Error(401, "You need to login to add email");
            if (_user && _user.services && !_user.services.facebook)
                throw new Meteor.Error(404, "You need a facebook account to do that!");

            var _facebookEmail = _user.services.facebook.email;

            if (!(_facebookEmail && _facebookEmail !== ""))
                throw new Meteor.Error(404, "You need a working facebook email to do that!");

            console.log("_facebookEmail", _facebookEmail);

            Meteor.users.update({_id: _user._id}, {$set: {emails: [{address: _facebookEmail, verified: false}]}})
//            Meteor.users.update({_id: _user._id}, {$set: "services.password": {}});
        }
    },
	updateUserNick: function(newNick) {
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(401, "You need to login to change your display name");

		Meteor.users.update({
			_id: user._id
		}, {
			$set: {
				"identity.nick": newNick
			}
		});
	},

	updateUserFirstName: function(newFirstName) {
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(401, "You need to login to change your first name");

		Meteor.users.update({
			_id: user._id
		}, {
			$set: {
				"identity.name.firstName": newFirstName
			}
		});

	},

	updateUserLastName: function(newLastName) {
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(401, "You need to login to change your last name");

		Meteor.users.update({
			_id: user._id
		}, {
			$set: {
				"identity.name.lastName": newLastName
			}
		});

	},

	updateUserProfilepicture: function(newProfilePicture) {
			var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(401, "You need to login to change your last name");

		Meteor.users.update({
			_id: user._id
		}, {
			$set: {
				"profile.picture": newProfilePicture
			}
		});	
	}
});