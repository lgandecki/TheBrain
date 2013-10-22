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


        Meteor.loginWithPassword(_email, _password, function(err) {
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you are not trying to register account with the same email address again!");
            } else {

            }
        });
        $('#signUpWithEmailModal').modal('hide');
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
            }
        });
        // _collection = {
        //     "name": "Main collection"
        // };

        // Meteor.call('newCollection', _collection);
    }
})
//Accounts.createUser(user);