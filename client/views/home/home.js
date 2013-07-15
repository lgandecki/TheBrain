
Template.quickButtons.events({
    "mouseenter .quickButton": function(e) {
        $(e.target).switchClass("quickButtonNormal", "quickButtonHover");
    },
    "mouseleave .quickButton": function(e) {
        $(e.target).switchClass("quickButtonHover", "quickButtonNormal");
    },
    "click .quickButton": function(e) {
        _link = $(e.target).closest(".quickButton").attr("data-target");
        console.log("_link ", _link);
        if (_link) {
            Meteor.Router.to(_link);
        }
    }
})
