Template.logInForm.events({
    "click .btn-signUpWithFacebook": function(e, template) {
        e.preventDefault();
        Meteor.loginWithFacebook(function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you are logged in to facebook");
            }
        });
    },
    "click .btn-signUpWithGoogle": function(e, template) {
        e.preventDefault();
        Meteor.loginWithGoogle(function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you are logged in to google");
            }
        });
    },
    "mouseenter .btn-mine": function(e) {
        $(e.target).switchClass("quickButtonNormal", "quickButtonHover");
    },
    "mouseleave .btn-mine": function(e) {
        $(e.target).switchClass("quickButtonHover", "quickButtonNormal");
    },
    'submit #login-form': function(e, t) {
        e.preventDefault();
        // retrieve the input field values
        var email = t.find('#login-email').value,
            password = t.find('#login-password').value;

        Meteor.loginWithPassword(email, password, function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you provided the correct username and password!");
            } else {
                $("#logInModal").modal("hide");
            }
        });
        return false;
    }
});

