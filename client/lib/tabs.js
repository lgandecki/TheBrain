_setHeight = function() {
    tabsHeight = $(".tabs").height() - 20;
    $(".tab-content").animate({"min-height": tabsHeight});
}



if (!Meteor.tabs) Meteor.tabs = {};
_.extend(Meteor.tabs, {
    setHeight: _setHeight
});