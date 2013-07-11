Template.logInHeader.events({

    'submit #login-form' : function(e, t){
        e.preventDefault();
        // retrieve the input field values
        var email = t.find('#login-email').value
            , password = t.find('#login-password').value;

        Meteor.loginWithPassword(email, password, function(err){
            if (err) {
                bootbox.alert("TheBrain is confused<br/>Please make sure you provided the correct username and password!");
            }
        });
        return false;
    }
});