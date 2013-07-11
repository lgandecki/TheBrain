Meteor.publish("myFlashcards", function() {
    return Flashcards.find({user: this.userId});
});