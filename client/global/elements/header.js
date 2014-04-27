var _renderer = null;

Template.header.isLoggedIn = function () {
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function () {
        console.log("creating new nav from loggedIn");
        createSubNav()
    }, 200);
    console.log("logged in from the header");
    return Meteor.userId();
};

Template.header.isLoggedInOrExplore = function () {
    return Meteor.user() || Session.get("exploreMode");
}

Template.header.isExplore = function () {
    var _currentRoute = window.location.pathname;
    if (_currentRoute === "/home") {
        _currentRoute = "/";
    }
    _currentRoute = "/" + _currentRoute.split("/")[1];
    return !Meteor.user() && _currentRoute !== "/login" && _currentRoute !== "/";
}

Template.header.containerType = function () {
    return ($(window).width() <= 768) ? "container-fluid" : "container";
};


Template.header.events({
    "click .btn-exitExplore": function () {
        Session.set("exploreMode", false);
    },
    "click .btn-explore": function () {
        Session.set("exploreMode", true);
    }
})
