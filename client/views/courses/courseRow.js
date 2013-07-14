Template.courseRow.events({
	"click .badge-upVote": function(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("click");
	},
	"mouseenter .badge-upVote": function(e) {
		$(e.target).switchClass("badge-success", "badge-success-reversed");
	},
	"mouseleave .badge-upVote": function(e) {
		$(e.target).switchClass("badge-success-reversed", "badge-success");
	},
	"click .badge-downVote": function(e) {
		e.preventDefault();
		e.stopPropagation();
		Meteor.call("downVoteCourse", this._id);

	},
	"mouseenter .badge-downVote": function(e) {
		$(e.target).switchClass("badge-warning", "badge-warning-reversed", 300);
	},
	"mouseleave .badge-downVote": function(e) {
		$(e.target).switchClass("badge-warning-reversed", "badge-warning", 200);
	},
		"click .badge-upVote": function(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("upVote");
		Meteor.call("upVoteCourse", this._id);
		$(e.target).removeClass("badge-success-reversed").removeClass("badge-success");

	},

	// "mouseenter .btn-enterCourse": function(e) {
	// 	$(e.target).switchClass("btn-primary", "btn-primary-reversed");
	// },
	// "mouseleave .btn-enterCourse": function(e) {
	// 	$(e.target).switchClass("btn-primary-reversed", "btn-primary");
	// }

});

Template.courseRow.isUpVoted = function() {
	console.log("this", this);
	if (voted(this.upVotes)) {
		return "";
	}
	return "badge-downVote clickable badge-success";
}


Template.courseRow.isDownVoted = function() {
	console.log("this", this);
	if (voted(this.downVotes)) {
		return "";	
	}
	return "badge-upVote clickable badge-warning";
}

voted = function(votes) {
	return ($.inArray(Meteor.userId(), votes) > -1)
}