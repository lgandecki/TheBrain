var _renderer = false;

Meteor.subscribe("courseEvents", Session.get("selectedCourse"));

// Template.course.course = function () {
//     var _selectedCourse = Session.get("selectedCourse");
//     return (_selectedCourse) ? Courses.findOne({_id: _selectedCourse}) : [];
// }


Template.course.created = function() {
    if (!Session.equals("courseOpened", "true")) {
        console.log("We set it again");
        Session.set("courseTab", "#events");
        Session.set("courseOpened", "true");
    }
}

Deps.autorun(function() {
    var _courseTab = Session.get("courseTab");
    setTimeout(function() {

        $('.nav a[href="' + _courseTab + '"]').tab('show');
    })

})



Handlebars.registerHelper("isCourseTabActive", function(tab) {
    console.log("e", tab);
    if (Session.equals("courseTab", tab)) {
        setTimeout(function() {

            console.log("are we getting here?");
//            $('.nav a[href="' + tab + '"]').tab('show');
        }, 100);
        return true;
    }
    else if ( Session.equals("previousCourseTab", tab)) {
        return true;
    }
    return false;
    // console.log("template ", thisCache);
    // return true;
});



Template.course.name = function() {
  var _selectedCourse = Session.get("selectedCourse");
  return _selectedCourse;
};

Template.course.commentsLength = function() {
    var _selectedCourse = Courses.findOne({
        _id: Session.get("selectedCourse")
    });
    if (_selectedCourse && _selectedCourse.comments) {
        return _selectedCourse.comments.length;
    }
    else {
        return 0;
    }
}

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
        e.stopImmediatePropagation();
        console.log("clicked on tab ", e);
        Session.set("previousCourseTab", Session.get("courseTab"));
        Session.set("courseTab", e.target.hash || e.target.parentElement.hash);

    },
//  "click .tabLink": function(e) {
//    e.preventDefault();
//    $(e.target).closest('a').tab('show');
//    Session.set("selectedCourseTab", $(e.target).closest('a').attr("href"));
//  },
  "click .btn-courseDropOut": function(e) {
    courseId = Session.get("selectedCourse");
    Meteor.call("dropOutFromTheCourse", courseId, function(error, id) {
      if (error) {
        Meteor.popUp.error("TheBrain is confused", error.reason);
      } else {
        Meteor.popUp.success("Dropped the course", "TheBrain made the neural connections changes you asked for.");
      }
    });
  },
  "click .btn-courseEnroll": function(e) {
    courseId = Session.get("selectedCourse");
    Meteor.call("enrollInCourse", courseId, function(error, id) {
      if (error) {
        Meteor.popUp.error("TheBrain is confused", error.reason);
      } else {
        Meteor.popUp.success("Enrolled to the course", "TheBrain made the neural connections changes you asked for.");
      }
    });
  }
});

Template.course.destroyed = function() {
  Session.set("selectedCourse", "");
};

Template.course.rendered = function() {
  window.clearTimeout(_renderer);
  _renderer = window.setTimeout(function() {
      $('.tabs').tabs()
          .bind('change', function (e) {
              $(this).next().hide().fadeIn();
          });
    //_selectedCourseTab = Session.get("selectedCourseTab");
    //$('a[href='+_selectedCourseTab+']').tab('show');
    console.log("firing this?");
//      $('.nav a[href="' + Session.get("courseTab") + '"]').tab('show');

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
  if (Meteor.user() && $.inArray(Session.get("selectedCourse"), Meteor.user().courses) !== -1) {
    return true;
  } else {
    return false;
  }
};