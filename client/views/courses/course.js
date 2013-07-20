var _renderer;

Meteor.subscribe("courseEvents", Session.get("selectedCourse"));

// Template.course.course = function () {
//     var _selectedCourse = Session.get("selectedCourse");
//     return (_selectedCourse) ? Courses.findOne({_id: _selectedCourse}) : [];
// }

Template.course.name = function () {
    var _selectedCourse = Session.get("selectedCourse");

}

Template.course.isCourseOwner = function () {
    var _selectedCourse = Courses.findOne({_id: Session.get("selectedCourse")}, {fields: {admins: 1}});
    if ($.inArray(Meteor.userId(), _selectedCourse.admins) > -1) {
        return true
    }
    else {
        return false;
    }
}

Template.course.events({
    "click .tabLink": function(e) {
        e.preventDefault();
        $(e.target).closest('a').tab('show');
        Session.set("selectedCourseTab", $(e.target).closest('a').attr("href"));
    }
})

Template.course.destroyed = function () {
    Session.set("selectedCourse", "");
};

Template.course.rendered = function () {
   window.clearTimeout(_renderer);
   _renderer = window.setTimeout(function () {
       //_selectedCourseTab = Session.get("selectedCourseTab");
       //$('a[href='+_selectedCourseTab+']').tab('show');
       Meteor.tabs.setHeight();
   }, 50);
};
