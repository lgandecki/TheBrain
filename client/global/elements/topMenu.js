Template.topMenu.rendered = function() {
	setTimeout(function() {
//        console.log("creating new nav");
		createSubNav()
	}, 100);
};

var _renderer = null;

//Meteor.autosubscribe(function () {


Template.topMenu.isLoggedIn = function() {
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function () {
        console.log("creating new nav from loggedIn");
        createSubNav()
    }, 200);
    return Meteor.userId();
};

