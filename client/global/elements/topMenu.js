Template.topMenu.rendered = function() {
    // console.log("test")
    // $('li[class="active"]').removeClass('active');
    // var _currentRoute = Meteor.Router.page();
    // //var _link = Meteor.Router[_currentRoute + "Path"]();
    // //var _element = $('a[href="'+_link+'"]');
    // var _element = $('a[href="/'+_currentRoute+'"]');
    // _element.closest('li').addClass('active');
    // _element.closest('li[class="topNav"]').addClass('active');
};

Template.topMenu.events({
    'mouseenter li.topNav': function(e, template) {
        $(e.target).addClass("open");
    },
    'mouseleave li.topNav.open ': function(e, template) {
        $(e.target).removeClass("open");
    }
});