Template.header.isLoggedIn = function() {
    return Meteor.user();
};

Template.header.containerType = function() {
	return ($(window).width() <= 768) ? "container-fluid" : "container";
};
