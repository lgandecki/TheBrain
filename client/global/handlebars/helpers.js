Handlebars.registerHelper('isLoggedIn', function() {
    return Meteor.user();
});

Handlebars.registerHelper('isActive', function(routeName) {
    return (Meteor.Router.page() === routeName) ? 'class=active' : "";
});