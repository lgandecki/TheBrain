Template.logInForm.events({
    "click .btn-signUpWithFacebook": function(e, template) {
        e.preventDefault();
        Meteor.modal.hideClosest(e.target);
        Meteor.loginWithFacebook(function(err) {
            if (err) {
                Meteor.modal.error("TheBrain is confused<br/>Please make sure you are logged in to facebook")
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
});

