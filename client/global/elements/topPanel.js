Template.topPanel.pageName = function() {
    return Meteor.Router.page();
}

Template.topPanel.connections = function() {
    _theBrain = TheBrain.findOne("global");
    return _theBrain ? _theBrain.connections : 0;
}

Template.topPanel.rendered = function() {
    $('li.active').removeClass('active');
    var _currentRoute = Meteor.Router.page();
    var _currentRoute = window.location.pathname;
    if (_currentRoute === "/home") {
    	_currentRoute = "/";
    }
    _currentRoute = "/" + _currentRoute.split("/")[1];
    switch (_currentRoute) {
        case '/lesson':
        case '/course':
            _currentRoute = Session.get("coursePath");
            break;
        case '/myCollection':
            _currentRoute = "/myCollections";
            break;
    }
//    console.log("currentRoute", _currentRoute);
    //var _link = Meteor.Router[_currentRoute + "Path"]();
    //var _element = $('a[href="'+_link+'"]');
    var _element = $('a[href="'+_currentRoute+'"]');
    _element.closest('li').addClass('active');
    _element.closest('li.topNav').addClass('active');
}