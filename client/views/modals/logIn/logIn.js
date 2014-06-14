Template.logInForm.events({
    "click .btn-signUpWithFacebook": function(e, template) {
        e.preventDefault();
        $("#logInModal").modal("hide");
        Meteor.loginWithFacebook(function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you are logged in to facebook");
            } else {
                Router.go("/");
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
        $("#logInModal").modal("hide");

        Meteor.loginWithPassword(email, password, function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you provided the correct username and password!");
            } else {
                Router.go("/");
            }
        });
        return false;
    }
});

