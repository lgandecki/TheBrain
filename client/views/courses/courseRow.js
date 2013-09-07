Template.courseRow.events({

    "click .badge-downVote": function (e) {
        console.log("click downVote", this._id);
        e.preventDefault();
        e.stopPropagation();
        Meteor.call("downVoteCourse", this._id);
//        $(e.target).stop().removeClass("badge-warning").removeClass('badge-warning-reversed').removeClass("badge-downVote").addClass("badge-downVoted");;
    },

    "click .badge-upVote": function (e) {
        console.log("click upVote");
        e.preventDefault();
        e.stopPropagation();
        Meteor.call("upVoteCourse", this._id);
//		$(e.target).stop().removeClass("badge-success-reversed").removeClass("badge-success").removeClass("badge-upVote").addClass("badge-upVoted");

    },
    "click .clickable": function (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // "mouseenter .btn-enterCourse": function(e) {
    // 	$(e.target).switchClass("btn-primary", "btn-primary-reversed");
    // },
    // "mouseleave .btn-enterCourse": function(e) {
    // 	$(e.target).switchClass("btn-primary-reversed", "btn-primary");
    // }

});

Template.courseRow.isDownVoted = function () {
    if (voted(this.downVotes)) {
        return "clickable badge-downVoted";
    }
    return "badge-downVote clickable badge-warning";
}


Template.courseRow.isUpVoted = function () {
    if (voted(this.upVotes)) {
        return "clickable badge-upVoted";
    }
    return "badge-upVote clickable badge-success";
}

Template.courseRow.flashcardsCount = function () {
    var _flashcards = 0;
    this.lessons.forEach(function (lesson) {
        if (lesson.studentsFlashcards) {
            _flashcards += lesson.studentsFlashcards.length;
            _flashcards += lesson.teacherFlashcards.length;
        }
    });
    return _flashcards;
}

voted = function (votes) {
    return ($.inArray(Meteor.userId(), votes) > -1)
}