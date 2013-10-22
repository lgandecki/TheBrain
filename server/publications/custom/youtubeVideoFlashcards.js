// server: publish the current size of a collection
Meteor.publish("youtubeVideoFlashcardsCount", function (youtube_id) {
    var self = this;
    var count = 0;
    var initializing = true;
    var handle = Flashcards.find({public: true, youtube_id: youtube_id}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("youtubeVideoFlashcardsCount", youtube_id, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("youtubeVideoFlashcardsCount", youtube_id, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("youtubeVideoFlashcardsCount", youtube_id, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});