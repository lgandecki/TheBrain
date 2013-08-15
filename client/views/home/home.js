
Template.quickButtons.events({
//    "mouseenter .quickButton": function(e) {
//        $(e.target).switchClass("quickButtonNormal", "quickButtonHover");
//    },
//    "mouseleave .quickButton": function(e) {
//        $(e.target).switchClass("quickButtonHover", "quickButtonNormal");
//    },
    "click .quickButton": function(e) {
        _link = $(e.target).closest(".quickButton").attr("data-target");
        if (_link) {
            Meteor.Router.to(_link);
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