Template.myProfile.user = function() {
	return Meteor.user();
};

Template.myProfile.rendered = function() {

	$.fn.editable.defaults.mode = 'inline';

	$('.user-firstName.editable:not(.editable-click)').editable('destroy').editable({
		success: function(response, newFirstName) {
			Meteor.call("updateUserFirstName", newFirstName, function(error, id) {
				if (error) {
					Meteor.popUp.error("TheBrain is confused", error.reason);
				} else {
					Meteor.popUp.success("First Name updated", "TheBrain made the neural connections changes you asked for.");
				}
			});
		}
	});

	$('.user-lastName.editable:not(.editable-click)').editable('destroy').editable({
		success: function(response, newLastName) {
			Meteor.call("updateUserLastName", newLastName, function(error, id) {
				if (error) {
					Meteor.popUp.error("TheBrain is confused", error.reason);
				} else {
					Meteor.popUp.success("Last Name updated", "TheBrain made the neural connections changes you asked for.");
				}
			});
		}
	});

	$('.user-nick.editable:not(.editable-click)').editable('destroy').editable({
		success: function(response, newNick) {
			Meteor.call("updateUserNick", newNick, function(error, id) {
				if (error) {
					Meteor.popUp.error("TheBrain is confused", error.reason);
				} else {
					Meteor.popUp.success("Display name updated", "TheBrain made the neural connections changes you asked for.");
				}
			});
		}
	});

	// filepicker.constructWidget(document.getElementById('attachment'));


};

Template.myProfile.email = function() {
    var _user = Meteor.user();
    return _user.emails && _user.emails[0] && _user.emails[0].address;
}

Template.myProfile.events({
	'click .changeProfilePicture': function(evt) {
		filepicker.pick({
				mimetypes: ['image/*'],
				container: 'modal',
				services: ['COMPUTER', 'FACEBOOK', 'GMAIL', 'INSTAGRAM', 'WEBCAM', 'URL']
			},
			function(InkBlob) {
				_newProfilePicture = InkBlob.url + "/convert?h=180&w=180&fit=crop"
				Meteor.call("updateUserProfilepicture", _newProfilePicture, function(error, id) {
					if (error) {
						Meteor.popUp.error("TheBrain is confused", error.reason);
					} else {
						Meteor.popUp.success("Profile picture changed", "TheBrain says: Aren't you beautiful?.");
					}
				});
			},
			function(FPError) {
				Meteor.popUp.error("TheBrain is confused", FPError.toString());
			}
		);
	},
    'click .changePassword': function(evt) {
        if ($(".pw1").val() === $(".pw2").val()) {
            Meteor.call("addMyPassword", $(".pw2").val(), function(error){
                if (error) {
                    console.log("changing password error", error);
                }
                else {
                    console.log("password changed");
                }
            });
//            Accounts.changePassword($(".pw").val(), $(".pw2").val(), function(error) {
//                if (error) {
//                    console.log("changing password error", error);
//                }
//                else {
//                    console.log("password changed");
//                }
//            });
        }
        else {
            console.log("Passwords don't match");
        }
    }
});