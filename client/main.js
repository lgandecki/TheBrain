Meteor.subscribe("userData");
Meteor.subscribe("publicCourses");
Meteor.subscribe("myCourses");
Meteor.subscribe("myFlashcards");
Meteor.subscribe("myCollections");
Meteor.subscribe("myItems");
Meteor.subscribe("lessons");
Meteor.subscribe("theBrain");
Meteor.subscribe("unreadNotifications");

Meteor.autosubscribe(function() {
    Notifications.find({
        user: Meteor.userId(),
        read: false
    }).observe({
        added: function(item) {
            Meteor.popUp.notification(item.eventUserName, item.message, item.eventUserPicture);
        }
    });
});

Deps.autorun(function() {
    console.log("deps selectedCourse " + Session.get("selectedCourse"));
    Meteor.subscribe("selectedCourse", Session.get("selectedCourse"));
    setTimeout(function() {
        $("#transition").css("display", "block");
    }, 20);
});

Meteor.startup(function() {
    filepicker.setKey("AHkjyUnfjQku2SL4OTQbxz");
});


$.fn.modal.Constructor.prototype.enforceFocus = function() {}; // Fix to enable stacking modals
_runOnce = true;
Template.body.rendered = function() {
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
    },
    "click .mobile-nav li a[href!='#']": function (e, template) {
        console.log("test");
        $(".mobile-nav").slideToggle(600, "easeInOutBack");
    },
        'mouseenter li.dropdown': function(e, template) {
        console.log("here?");
        $(e.target).addClass("open");
        $(e.target).children(".dropdown-menu").show('normal', "easeInOutCubic");
    },
    'mouseleave li.dropdown.open': function(e, template) {
        $(e.target).removeClass("open");
        $(e.target).children(".dropdown-menu").hide('normal', "easeInOutCubic");

    },
    'mouseenter div.dropdown': function(e, template) {
        console.log("or here?");
        $(e.target).addClass("open");
        $(e.target).children(".dropdown-menu").show('normal', "easeInOutCubic");

    },
    'mouseleave div.dropdown.open ': function(e, template) {
        $(e.target).removeClass("open");
        $(e.target).children(".dropdown-menu").hide('normal', "easeInOutCubic");

    },
    "click .slimboxPicture": function(e) {
        e.preventDefault();
        _convert = 640
        if ($(window).width() < 640) {
            _convert = $(window).width() - 50;
        }
        jQuery.slimbox(e.target.parentElement.href + "/convert?w=" + _convert,  e.target.parentElement.title);
    }
})