Meteor.methods({
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