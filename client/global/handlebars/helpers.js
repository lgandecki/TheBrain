Handlebars.registerHelper('isLoggedIn', function() {
    console.log("We are using the logged in from the helper");
    return Meteor.userId();
});

Handlebars.registerHelper('isActive', function(routeName) {
    return (Router.routes[0].name === routeName) ? 'class=active' : "";
});