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
    //"submit form": function(e) {
    //    console.log("submmited form");
    //    e.preventDefault();
    //},
    "submit #login-form": function(e) {
        e.preventDefault();
        console.log("submmited from #");

        var _email = $('#login-email').val();
        var _password = $("#login-password").val();

        Meteor.loginWithPassword(_email, _password, function (err) {
            if (err) {
                Meteor.modal.error("TheBrain is confused<br/>Please make sure you provided the correct username and password!")
            } else {
                Meteor.modal.hideClosestTo("#login-email");
                Router.go("/");
            }
        });
    }
});

