Template.addCourseComment.events({
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

Template.courseComments.mainComment = function() {
    _selectedCourse = Session.get("selectedCourse");
    _course = Courses.findOne({
        _id: _selectedCourse
    });



    if (_course && _course.comments) {
        _comments = _course.comments;

//        var _mainComments = [];
        var _mainComments = $.grep(_comments, function(comment) {
            return comment.parent === null;
        });


        _mainComments.sort(function(a, b) {
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
        return _mainComments;
    }
};

Template.courseComments.subComment = function() {
    _selectedCourse = Session.get("selectedCourse");
    _course = Courses.findOne({
        _id: _selectedCourse
    });



    if (_course && _course.comments) {
        _comments = _course.comments;

//        var _mainComments = [];
        console.log("this._id", this._id);
        var _that = this;
        var _subComments = $.grep(_comments, function(comment) {
            console.log("_that._id", _that._id);
            return comment.parent === _that._id;
        });


        _subComments.sort(function(a, b) {
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
        console.log("subComments", _subComments);
        return _subComments;
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

Template.courseComments.userName = function() {
    return Meteor.userDetails.getName(this.user);
}

Template.courseComments.userPicture = function() {
    return Meteor.userDetails.getProfilePicture(this.user);
}

Template.courseComments.date = function() {
    return new moment(this.posted).fromNow();
};

Template.courseComments.events({
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
    "click .btn-reply": function(e) {
        e.preventDefault();
        e.stopPropagation();
        var _commentId = this._id;
        console.log("_commentId", _commentId);
        $(".row-reply").slideUp(function() {
            console.log("ile razy ? ");
        });
        setTimeout(function() {
            $(".row-reply[data-id='" + _commentId + "']").slideDown();
        }, 50);
    },
    "click .btn-addReply": function(e) {
        e.preventDefault();
        Meteor.validations.clearErrors();
        $(e.target).attr("disabled", true).html("Adding...");
        var _parentId = $(e.target).attr("data-parentId");

        if (validateNewCourseReply(this._id)) {
            newCourseReply = createNewCourseReply(this._id);
            if (_parentId) {
                newCourseReply.repliedCommentId = _parentId;
            }
            Meteor.call('newCourseReply', newCourseReply, function(error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", "Reply adding server error: " + error.reason);
                } else {
                    Meteor.popUp.success("Reply added", "TheBrain prepared new neural path you asked for.");
                    $(".newReply[data-id='" + this._id + "']").val("");
                }
            });
        } else {
            Meteor.validations.markInvalids();
            Meteor.popUp.error("TheBrain is confused", " Comment adding error. Make sure you actually said something!");
        }
        $(e.target).removeAttr("disabled").html("Post Comment");
    }
});


var validateNewCourseReply= function(commentId) {
    invalids = [];
    Meteor.validations.checkIfEmpty(".newReply[data-id='" + commentId + "']");
    return !!(invalids.length === 0);
};


var createNewCourseReply = function(commentId) {
    var _newCourseReply = {
        comment: $(".newReply[data-id='" + commentId + "']").val(),
        repliedCommentId: commentId,
        courseId: Session.get("selectedCourse")
    };
    return _newCourseReply;
};