Template.userHeader.events({
    "click #logOut": function (e, template) {
        e.preventDefault();
        Meteor.logout();
    }
    , "click .toggle-mobile": function (e, template) {
        console.log("Are we clicking?");
        $(".mobile-nav").slideToggle();
    }
});

Template.userHeader.user = function() {
    return Meteor.user();
};

Template.userHeader.events({
    'mouseenter li.dropdown': function(e, template) {
        $(e.target).addClass("open");
    },
    'mouseleave li.dropdown.open': function(e, template) {
        $(e.target).removeClass("open");
    },
    'mouseenter div.dropdown': function(e, template) {
        $(e.target).addClass("open");
    },
    'mouseleave div.dropdown.open ': function(e, template) {
        $(e.target).removeClass("open");
    }
})