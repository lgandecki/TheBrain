Meteor.autosubscribe(function () {
//    if (Meteor.user() || Session.get("exploreMode")) {
        Meteor.subscribe("userData");
        Meteor.subscribe("publicCourses");
        Meteor.subscribe("myCourses");
//Meteor.subscribe("myFlashcards");
//Meteor.subscribe("myCollections");
//        Meteor.subscribe("myItems");
//        Meteor.subscribe("lessons");
        Meteor.subscribe("theBrain");
        Meteor.subscribe("unreadNotifications");
//    }
});

if (Meteor.isClient) {
    Meteor.startup(function () {
        Meteor.call("getServerNextDay", function (error, result) {
            Session.set("serverNextDay", result);
        });
        setInterval(function () {
            console.log("doing interval in getServer");
            Meteor.call("getServerNextDay", function (error, result) {
                Session.set("serverNextDay", result);
            });
        }, 600000);

    });

}


jQuery.fn.justtext = function() {

    return $(this).clone()
        .children()
        .remove()
        .end()
        .text();

};

stripHtml = function(str) {
    return jQuery('<div />', { html: str }).text();
}

var _renderer = null;

//Meteor.autosubscribe(function () {
if (Meteor.userId()) {
    window.clearTimeout(_renderer);
    _renderer = window.setTimeout(function () {
//        var _now = Meteor.moment.fullNow();
        Meteor.call("getServerTime", function (error, result) {
            var _serverTime = result;
            var _thirtyMinutesAgo = new Date(_serverTime - 60000 * 30);
            console.log("_thirtyMinutesAgo", _thirtyMinutesAgo);
            Notifications.find({
                user: Meteor.userId(),
                read: false
                ,created: {
                    $gte: _thirtyMinutesAgo
                }
            }).observe({
                    added: function (item) {

                        console.log("added again ", item);

                        var _eventUserName = Meteor.userDetails.getName(item.eventUserId);
                        var _eventUserPicture = Meteor.userDetails.getProfilePicture(item.eventUserId);
                        if (!_eventUserName) {
                            setTimeout(function () {
                                _eventUserName = Meteor.userDetails.getName(item.eventUserId);
                                _eventUserPicture = Meteor.userDetails.getProfilePicture(item.eventUserId);
                                console.log("from timeout username ", _eventUserName, "item", item);

                                Meteor.popUp.notification(_eventUserName, item.message, _eventUserPicture);
                            }, 2000);
                        } else {

                            Meteor.popUp.notification(_eventUserName, item.message, _eventUserPicture);
                        }
                    }
                });

        });

    }, 300);
}
//});

Meteor.autorun(function () {
    if (Meteor.userId()) {
        Meteor.subscribe("itemsToReLearnCount");
        var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
        console.log("_now", _now);
        Meteor.subscribe("itemsToRepeatCount", _now);
    }
});

Deps.autorun(function () {
    console.log("deps selectedCourse ", Session.get("selectedCourse"));
    Meteor.subscribe("selectedCourse", Session.get("selectedCourse"));
    setTimeout(function () {
        $("#transition").css("display", "block");
    }, 20);
});

Meteor.startup(function () {
    filepicker.setKey("AHkjyUnfjQku2SL4OTQbxz");
    new GA(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    window.ga('create', 'UA-33043573-4', 'thebrain.pro');
    console.log("creating GA");
});


$.fn.modal.Constructor.prototype.enforceFocus = function () {
}; // Fix to enable stacking modals


Template.body.events({
//    "mouseenter .btn-primary": function(e) {
//        $(e.target).stop(true, true).switchClass("btn-primary-main", "btn-primary-reversed", 400);
//    },
//    "mouseleave .btn-primary": function(e) {
//        $(e.target).stop(true, true).switchClass("btn-primary-reversed", "btn-primary-main", 400);
//    },
    "click .mobile-nav li a[href!='#']": function (e, template) {
        $(".mobile-nav").stop().slideToggle(600, "easeInOutBack");
    },
    "click .toggle-mobile": function (e, template) {
        $(".mobile-nav").slideToggle(600, "easeInOutBack");
    },
    'mouseenter li.dropdown': function (e, template) {
        $(e.target).stop(true, true).addClass("open");
        $(e.target).children(".dropdown-menu").stop(true, true).show('normal', "easeInOutCubic");
    },
    'mouseleave li.dropdown.open': function (e, template) {
        $(e.target).stop(true, true).removeClass("open");
        $(e.target).children(".dropdown-menu").stop(true, true).hide('normal', "easeInOutCubic");

    },
    'mouseenter div.dropdown': function (e, template) {
        $(e.target).stop(true, true).addClass("open");
        $(e.target).children(".dropdown-menu").stop(true, true).show('normal', "easeInOutCubic");

    },
    'mouseleave div.dropdown.open ': function (e, template) {
        $(e.target).stop(true, true).removeClass("open");
        $(e.target).children(".dropdown-menu").stop(true, true).hide('normal', "easeInOutCubic");

    },
//    "mouseenter .badge-downVote": function(e) {
//        $(e.target).switchClass("badge-warning", "badge-warning-reversed", 300);
//    },
//    "mouseleave .badge-downVote": function(e) {
//        $(e.target).switchClass("badge-warning-reversed", "badge-warning", 200);
//    },
//    "mouseenter .badge-upVote": function(e) {
//        $(e.target).switchClass("badge-success", "badge-success-reversed");
//    },
//    "mouseleave .badge-upVote": function(e) {
//        $(e.target).switchClass("badge-success-reversed", "badge-success");
//    },
    "click .slimboxPicture": function (e) {
        e.preventDefault();
        _convert = 640
        if ($(window).width() < 640) {
            _convert = $(window).width() - 50;
        }
        jQuery.slimbox(e.target.parentElement.href + "/convert?w=" + _convert, e.target.parentElement.title);
    }
})