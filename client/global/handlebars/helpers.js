Handlebars.registerHelper('isLoggedIn', function() {
    return Meteor.user();
});

Handlebars.registerHelper('isActive', function(routeName) {
    console.log("Are we going home ? " + routeName);
    return (Meteor.Router.page() === routeName) ? 'class=active' : "";
});