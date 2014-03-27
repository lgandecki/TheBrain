Meteor.methods( {
    'addMyPassword':function(newPassword) {
        console.log("in add my password");
        if (this.userId) {
//            Accounts.sendResetPasswordEmail();
            console.log("setting password", this.userId);
            Accounts.setPassword(this.userId, newPassword);
        }
    },
    'changeJenniferPassword': function(newPassword) {
        Accounts.setPassword("qftpcSTaDLPzfE2Zd", newPassword);
    }
});