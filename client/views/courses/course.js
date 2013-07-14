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
        console.log("Ever here?");
        e.preventDefault();
        console.log("this ", e);
        $(e.target).closest('a').tab('show');
        Session.set("selectedCourseTab", $(e.target).closest('a').attr("href"));
    }
})

Template.course.destroyed = function () {
    console.log("are we destroying the course?");
    Session.set("selectedCourse", "");
};

Template.course.rendered = function () {
   window.clearTimeout(_renderer);
   _renderer = window.setTimeout(function () {
       //_selectedCourseTab = Session.get("selectedCourseTab");
       //console.log("SelectedCourseTab", _selectedCourseTab);
       //$('a[href='+_selectedCourseTab+']').tab('show');
       Meteor.tabs.setHeight();
   }, 50);
};
