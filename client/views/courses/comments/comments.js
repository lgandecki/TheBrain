Template.addComment.events({
	"click .btn-addNewComment": function(e) {
		e.preventDefault();
		Meteor.validations.clearErrors();
		$(e.target).attr("disabled", true).html("Adding...");
		if (validateNewCourseComment()) {
			newCourseComment = createNewCourseComment();
			Meteor.call('newCourseComment', newCourseComment, function(error, id) {
				if (error) {
					Meteor.popUp.error("TheBrain is confused", "Comment adding server error: " + error.reason);
				} else {
					Meteor.popUp.success("Comment added", "TheBrain prepared new neural path you asked for.");
					$(".newComment").val("");
				}
			});
		} else {
			Meteor.validations.markInvalids();
			Meteor.popUp.error("TheBrain is confused", " Comment adding error. Make sure you actually said something!");
		}
		$(e.target).removeAttr("disabled").html("Post Comment");
	}
});

Template.comments.mainComment = function() {
	_selectedCourse = Session.get("selectedCourse");
	_course = Courses.findOne({
		_id: _selectedCourse,
		parent: null
	});

	if (_course && _course.comments) {
		_comments = _course.comments;
		_comments.sort(function(a, b) {
			if (a.score < b.score) {
				return 1;
			} else if (a.score > b.score) {
				return -1;
			} else if (a.posted < b.posted) {
				return 1;
			} else if (a.posted > b.posted) {
				return -1;
			}
			return 0;
		})
		return _course.comments;
	}
}

validateNewCourseComment = function() {
	invalids = [];
	Meteor.validations.checkIfEmpty(".newComment");
	return !!(invalids.length === 0);
};

createNewCourseComment = function() {
	var _newCourseComment = {
		comment: $(".newComment").val(),
		courseId: Session.get("selectedCourse")
	};
	return _newCourseComment;
};


Template.comments.date = function() {
	return new moment(this.posted).fromNow();
};

Template.comments.events({
	"click .badge-upVote": function(e) {
		e.preventDefault();
		e.stopPropagation();
		_opts = {
			courseId: Session.get("selectedCourse"),
			commentId: this._id
		}
		Meteor.call("courseCommentVoteUp", _opts);
	},
	"click .badge-downVote": function(e) {
		e.preventDefault();
		e.stopPropagation();
		_opts = {
			courseId: Session.get("selectedCourse"),
			commentId: this._id
		}
		Meteor.call("courseCommentVoteDown", _opts);
	},
});