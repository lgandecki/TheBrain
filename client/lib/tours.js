var _showIfNeeded = function(tourName) {
    if (!Meteor.users.findOne({_id: Meteor.userId(), "profile.tours": tourName})) {
        $('#'+tourName).crumble();
        Meteor.users.update(Meteor.userId(), {$addToSet: {'profile.tours': tourName }});
    }
};


if (!Meteor.tour) Meteor.tour = {};
_.extend(Meteor.tour, {
    showIfNeeded: _showIfNeeded
});