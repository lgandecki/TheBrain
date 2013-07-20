Meteor.subscribe("userData");
Meteor.subscribe("publicCourses");
Meteor.subscribe("myCourses");
Meteor.subscribe("myFlashcards");
Meteor.subscribe("myCollections");
Meteor.subscribe("myItems");
Meteor.subscribe("lessons");
Meteor.subscribe("theBrain");

Deps.autorun(function () {
    console.log("deps selectedCourse " + Session.get("selectedCourse"));
    Meteor.subscribe("selectedCourse", Session.get("selectedCourse"));
    setTimeout(function () {
    	
    	$("#transition").css("display", "block");
	}, 20);
});

console.log("How often are we rereading this?");

$.fn.modal.Constructor.prototype.enforceFocus = function () {}; // Fix to enable stacking modals
_runOnce = true;
Template.body.rendered = function() {
    console.log("everytime the page changes");
    if (_runOnce === true) {
        new GA(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-33043573-4', 'thebrain.pro');
       _runOnce = false;
    }
}

Template.body.events({
        "mouseenter .btn-primary": function(e) {
        $(e.target).switchClass("btn-primary-main", "btn-primary-reversed", 400);
    },
    "mouseleave .btn-primary": function(e) {
        $(e.target).switchClass("btn-primary-reversed", "btn-primary-main", 400);
    }
})