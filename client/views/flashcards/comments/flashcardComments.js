Template.addFlashcardComment.events({
    "click .btn-addNewComment": function(e) {
        e.preventDefault();
        Meteor.validations.clearErrors();
        $(e.target).attr("disabled", true).html("Adding...");
        if (validateNewFlashcardComment()) {
            newFlashcardComment = createNewFlashcardComment();
            Meteor.call('newFlashcardComment', newFlashcardComment, function(error, id) {
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

Template.flashcardComments.mainComment = function() {
    _currentFlashcardId = Session.get("currentFlashcardId");
    _flashcard = Flashcards.findOne({
        _id: _currentFlashcardId
    });



    if (_flashcard && _flashcard.comments) {
        _comments = _flashcard.comments;

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

Template.flashcardComments.subComment = function() {
    _currentFlashcardId = Session.get("currentFlashcardId");
    _flashcard = Flashcards.findOne({
        _id: _currentFlashcardId
    });



    if (_flashcard && _flashcard.comments) {
        _comments = _flashcard.comments;

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

validateNewFlashcardComment = function() {
    invalids = [];
    Meteor.validations.checkIfEmpty(".newComment");
    return !!(invalids.length === 0);
};

createNewFlashcardComment = function() {
    var _newFlashcardComment = {
        comment: $(".newComment").val(),
        flashcardId: Session.get("currentFlashcardId")
    };
    return _newFlashcardComment;
};


Template.flashcardComments.date = function() {
    return new moment(this.posted).fromNow();
};

Template.flashcardComments.events({
    "click .badge-upVote": function(e) {
        e.preventDefault();
        e.stopPropagation();
        _opts = {
            flashcardId: Session.get("currentFlashcardId"),
            commentId: this._id
        }
        Meteor.call("flashcardCommentVoteUp", _opts);
    },
    "click .badge-downVote": function(e) {
        e.preventDefault();
        e.stopPropagation();
        _opts = {
            flashcardId: Session.get("currentFlashcardId"),
            commentId: this._id
        }
        Meteor.call("flashcardCommentVoteDown", _opts);
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

        if (validateNewFlashcardReply(this._id)) {
            newFlashcardReply = createNewFlashcardReply(this._id);
            if (_parentId) {
                newFlashcardReply.repliedCommentId = _parentId;
            }
            Meteor.call('newFlashcardReply', newFlashcardReply, function(error, id) {
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


var validateNewFlashcardReply= function(commentId) {
    invalids = [];
    Meteor.validations.checkIfEmpty(".newReply[data-id='" + commentId + "']");
    return !!(invalids.length === 0);
};


var createNewFlashcardReply = function(commentId) {
    var _newFlashcardReply = {
        comment: $(".newReply[data-id='" + commentId + "']").val(),
        repliedCommentId: commentId,
        flashcardId: Session.get("currentFlashcardId")
    };
    return _newFlashcardReply;
};