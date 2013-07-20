var _course, _lesson, _flashcardSubscription;

Template.lesson.created = function() {
	// _course = Courses.findOne({_id: Session.get("selectedCourse")});
	// console.log("_course", _course);
	// console.log("selectedCourse ", Session.get("selectedCourse"));
	// if (_course) {
	// var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
	// _lesson = _course.lessons[_lessonIndex];

	// console.log("_lesson ", _lesson);
	// }
}

Template.flashcardsOptions.events({
		"click .btn-hideStudentsFlashcards": function(e) {
		console.log("hide button clicked");
		e.preventDefault();
		e.stopPropagation();
		setTimeout(function() {
			$(".btn-hideStudentsFlashcards").addClass("btn-showStudentsFlashcards").removeClass("btn-hideStudentsFlashcards").html("Show students flashcards");
			$(".btn-addAll").html("Add teachers flashcards");
		}, 20);
		_flashcardSubscription.stop();
		_query = {lessonId: _lesson._id, onlyAdmin: true, adminIds: _course.admins} 
		_query.adminIds.push(Meteor.userId());
		_flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
				Session.set("_optionsQuery", _query);

	},
	"click .btn-showStudentsFlashcards": function(e) {
		console.log("showButtonClicked");
		e.preventDefault();
		e.stopPropagation();
		$(".btn-showStudentsFlashcards").removeClass("btn-showStudentsFlashcards").addClass("btn-hideStudentsFlashcards").html("Hide students flashcards");
		$(".btn-addAll").html("Add students flashcards");
		_flashcardSubscription.stop();
		_query = {lessonId: _lesson._id, onlyAdmin: false};
		_flashcardSubscription = Meteor.subscribe("lessonFlashcards", _query);
		Session.set("_optionsQuery", _query);

	},
	"click .btn-addAll": function(e) {
		_flashcards = _getFlashcards().fetch();
		if (_flashcards) {
			_flashcardsIds = _.pluck(_flashcards, '_id');
			_opts = {
				flashcardsIds: _flashcardsIds,
				courseId: Session.get("selectedCourse")
			}
			Meteor.call("addFlashcardsToCollection", _opts);
			console.log("_flashcards from btn-all ", _opts.flashcardsIds);
		}
	}

})

Template.lesson.rendered = function() {
		_course = Courses.findOne({_id: Session.get("selectedCourse")});
	console.log("_course", _course);
	console.log("selectedCourse ", Session.get("selectedCourse"));
	if (_course) {
	var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
	_lesson = _course.lessons[_lessonIndex];

	console.log("_lesson ", _lesson);
	_flashcardSubscription = Meteor.subscribe("lessonFlashcards", {lessonId: _lesson._id, onlyAdmin: true, adminIds: _course.admins});
	}
}
Template.lesson.courseName = function () {
	_course = Courses.findOne({_id: Session.get("selectedCourse")});
	return _course ? _course.name : "";
}

Template.lesson.lessonName = function () {
	_course = Courses.findOne({_id: Session.get("selectedCourse")});
	var _lesson;
		if (_course) {
	var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), Session.get("selectedLesson"));
	_lesson = _course.lessons[_lessonIndex];
}
	return _lesson ? _lesson.name : "";
}

Template.lessonFlashcardsList.flashcard = function () {
	return _getFlashcards();
}

_getFlashcards = function() {
	_courseId = Session.get("selectedCourse");
	_lessonId = Session.get("selectedLesson");
	_course = Courses.findOne({_id: _courseId});
	if (_course) {
	var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), _lessonId);
	_lesson = _course.lessons[_lessonIndex];
	console.log("_lessonId", _lessonId);
	console.log("_course", _course);
	_optionsQuery = Session.get("_optionsQuery") || {};
	if (_lesson) {
		_query = {public: true, "lessons.lesson": _lesson._id};
		_query._id = {$in: _lesson.flashcards};
		if (_optionsQuery.onlyAdmin) {
			_query.user = {$in: _optionsQuery.adminIds};
		}
		return Flashcards.find(_query);
	}
	}	
	return [];
}

Template.flashcardsOptions.rendered = function () {
	$('#onlyByTeacher').parent().bootstrapSwitch();
}

Template.flashcardRow.upVotes = function () {
	return this.upVotes ? this.upVotes.length : "0";
}

Template.flashcardRow.downVotes = function() {
	return this.downVotes ? this.downVotes.length : "0";
}
