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
    },
    'mouseenter .theme-colors > li > span ': function(e){
        console.log("First one");
    var $el = $(e.target),
    body = $('body');
    body.attr("class","").addClass("theme-"+$el.attr("class"));
    },
    'mouseleave .theme-colors > li > span ': function(e){
        console.log("second one");
    var $el = $(e.target),
    body = $('body');
    if(body.attr("data-theme") !== undefined) {
        body.attr("class","").addClass(body.attr("data-theme"));
    } else {
        body.attr("class","");
    }
    },
    'click .theme-colors > li  > span ': function(e){
        console.log("third one");
   var $el = $(e.target);
   $("body").addClass("theme-"+$el.attr("class")).attr("data-theme","theme-"+$el.attr("class"));
}
})