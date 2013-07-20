Meteor.publish("myFlashcards", function() {
    return Flashcards.find({user: this.userId});
});

Meteor.publish("lessonFlashcards", function(opts) {
	// console.log("Are we doing this I mean lessonflashcards?", lessonId);
	_query = {public: true, "lessons.lesson": opts.lessonId};
	if (opts.onlyAdmin) {
		_query.user = {$in: opts.adminIds};
	}
	console.log("query ", _query);
	return Flashcards.find(_query);
})