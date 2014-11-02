Template.logInHeader.events({
    'click .btn-logInModal': function() {
        Meteor.modal.login();
    }
});