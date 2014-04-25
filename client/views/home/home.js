
Template.quickButtons.events({
//    "mouseenter .quickButton": function(e) {
//        $(e.target).switchClass("quickButtonNormal", "quickButtonHover");
//    },
//    "mouseleave .quickButton": function(e) {
//        $(e.target).switchClass("quickButtonHover", "quickButtonNormal");
//    },
    "click .quickButton": function(e) {
        var _link = $(e.target).closest(".quickButton").attr("data-target");
        if (_link) {
            Router.go(_link);
        }
    }
})


Template.quickButtons.itemsToStudy = function() {
    var _itemsToReLearn = ItemsToReLearnCount.findOne(),
        _itemsToRepeat = ItemsToRepeatCount.findOne();

    if (_itemsToReLearn && _itemsToRepeat) {
        return _itemsToReLearn.count + _itemsToRepeat.count;
    }
}

var _tour;
Template.home.rendered = function() {
    setTimeout(function() {
    _tour = new Tour({
        backdrop: true,
        orphan: true,
        redirect: function(link) {
            console.log("running redirect");
            Session.set("tour", link);
            Router.go(link);
        }
    });
    _tour.addStep({
        title: "quick",
        element: "#quickButtons",
        content: "quick buttons"
    });
    _tour.addStep({
        title: "hey",
        element: '[data-target="/myCourses"]',
        content: "your courses"
    });
    _tour.addStep({
        title: "next page",
        content: "next page",
        path: "/calendar"
    });
    _tour.addStep({
        title: "siemka",
        content: "siemka2"
    })
    _tour.init();
    _tour.start();
    }, 600);
}