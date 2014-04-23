Template.header.isLoggedIn = function() {
    console.log("logged in from the header");
    return Meteor.userId();
};

Template.header.isLoggedInOrExplore = function() {
    return Meteor.user() || Session.get("exploreMode");
}

Template.header.isExplore = function() {
    return Session.get("exploreMode") && !Meteor.user();
}

Template.header.containerType = function() {
	return ($(window).width() <= 768) ? "container-fluid" : "container";
};


Template.header.events({
    "click .btn-exitExplore": function() {
        Session.set("exploreMode", false);
    },
    "click .btn-explore": function() {
        Session.set("exploreMode", true);
    }
})
