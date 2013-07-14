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

	},
	"mouseenter .badge-downVote": function(e) {
		$(e.target).switchClass("badge-warning", "badge-warning-reversed");
	},
	"mouseleave .badge-downVote": function(e) {
		$(e.target).switchClass("badge-warning-reversed", "badge-warning");
	}


});