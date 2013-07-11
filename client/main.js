Meteor.subscribe("userData");
Meteor.subscribe("publicCourses");
Meteor.subscribe("myCourses");
Meteor.subscribe("myFlashcards");
Meteor.subscribe("myCollections");
Meteor.subscribe("myItems");
Meteor.subscribe("lessons");
Meteor.subscribe("theBrain");

$.fn.modal.Constructor.prototype.enforceFocus = function () {}; // Fix to enable stacking modals