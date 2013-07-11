Template.topPanel.pageName = function() {
    return Meteor.Router.page();
}

Template.topPanel.connections = function() {
    _theBrain = TheBrain.findOne("global");
    return _theBrain ? _theBrain.connections : 0;
}