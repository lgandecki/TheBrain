var _renderer;
Template.login.rendered = function() {
    //    window.clearTimeout(_renderer);
    //    _renderer = window.setTimeout(function () {
//    $("#workInProgressModal").modal("show");

//    $(".btn-signUpWithFacebook").fitText(1.6, {maxFontSize: '40px'});
    ////
    ////        welcomeHeight = $(".loginWelcome .box-content").height();
    ////        console.log("Welcome height " + welcomeHeight);
    ////        btnWidth = $(".btn-signIn").width();
    ////        $(".signUp").css({"width": btnWidth - 15});
    ////        $(".loginSignUp .box-content").css({"min-height": welcomeHeight});
    //    }, 150);
}


Template.signUpWithEmailModal.events({
    'submit #signUp': function(e, t) {
        e.preventDefault();
        _email = $(".newEmail").val();
        _password = $(".newPassword").val();

        _user = {
            "email": _email,
            "password": _password
        };

        _id = Accounts.createUser(_user);

        $('#signUpWithEmailModal').modal('hide');


        Meteor.loginWithPassword(_email, _password, function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you are not trying to register account with the same email address again!");
            } else {

            }
        });
        // setTimeout(function() {
        //     _collection = {
        //         "name": "Main collection"
        //     };

        //     Meteor.call('newCollection', _collection);
        // }, 50);
    }
});

Template.login.events({
    "mouseenter .btn-mine": function(e) {
        $(e.target).switchClass("quickButtonNormal", "quickButtonHover");
    },
    "mouseleave .btn-mine": function(e) {
        $(e.target).switchClass("quickButtonHover", "quickButtonNormal");
    },
    "click .btn-signUpWithEmailModal": function(e, template) {
        e.preventDefault();
        $('#signUpWithEmailModal').modal('show');
    },
    "click .btn-signUpWithFacebook": function(e, template) {
        e.preventDefault();
        Meteor.loginWithFacebook(function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you are logged in to facebook");
            } else {
                console.log("sign up with facebook")
                var _user = Meteor.user();
                if (_user && ((_user.emails && _user.emails.length === 0) || !_user.emails)) {
                    console.log("before the call");
                    Meteor.call("addEmailFromFacebook", "", function(error, id) {
                        if (error) {
                            Meteor.popUp.error("TheBrain is confused", error.reason);
                        } else {
                            Meteor.popUp.success("Email updated", "TheBrain made the neural connections changes you asked for.");
                        }
                    });
                }
            }
        });
        // _collection = {
        //     "name": "Main collection"
        // };

        // Meteor.call('newCollection', _collection);
    }
})
//Accounts.createUser(user);