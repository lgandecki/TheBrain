var _renderer = false;

Meteor.subscribe("courseEvents", Session.get("selectedCourse"));

// Template.course.course = function () {
//     var _selectedCourse = Session.get("selectedCourse");
//     return (_selectedCourse) ? Courses.findOne({_id: _selectedCourse}) : [];
// }

Template.course.name = function() {
  var _selectedCourse = Session.get("selectedCourse");
  return _selectedCourse;
};

Template.course.isCourseOwner = function() {
  var _selectedCourse = Courses.findOne({
    _id: Session.get("selectedCourse")
  }, {
    fields: {
      admins: 1
    }
  });
  if (_selectedCourse) {
    return ($.inArray(Meteor.userId(), _selectedCourse.admins) > -1) ? true : false;
  } else {
    return false;
  }
};

Template.course.events({
  "click .tabLink": function(e) {
    e.preventDefault();
    $(e.target).closest('a').tab('show');
    Session.set("selectedCourseTab", $(e.target).closest('a').attr("href"));
  },
  "click .btn-courseDropOut": function(e) {
    courseId = Session.get("selectedCourse");
    Meteor.call("dropOutFromTheCourse", courseId);
  },
  "click .btn-courseEnroll": function(e) {
    courseId = Session.get("selectedCourse");
    Meteor.call("enrollInCourse", courseId);
  }
});

Template.course.destroyed = function() {
  Session.set("selectedCourse", "");
};

Template.course.rendered = function() {
  window.clearTimeout(_renderer);
  _renderer = window.setTimeout(function() {
    //_selectedCourseTab = Session.get("selectedCourseTab");
    //$('a[href='+_selectedCourseTab+']').tab('show');
    console.log("firing this?");
    Meteor.tabs.setHeight();
  }, 50);
};

Template.course.enrollBtnText = function() {
  return _isUserEnrolled() ? "Click to drop out" : "Click to Enroll!";
};

Template.course.enrollBtnAction = function() {
  return _isUserEnrolled() ? "btn-courseDropOut" : "btn-courseEnroll";
};

_isUserEnrolled = function() {
  if ($.inArray(Session.get("selectedCourse"), Meteor.user().courses) !== -1) {
    return true;
  } else {
    return false;
  }
};