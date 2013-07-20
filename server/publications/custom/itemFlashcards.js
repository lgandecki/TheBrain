Meteor.publish("itemFlashcards", function() {
    var _self = this;
    var _userId = this.userId;
    var _initializing = true;
    var _watchItems = Items.find({
        user: _userId
    }).observe({

        added: function(item) {
            console.log("You should add this one " + item._id);
            item.flashcardObject = Flashcards.findOne({
                _id: item.flashcard,
                $or: [{
                    user: _userId
                }, {
                    public: true
                }]
            });
            _self.added("itemFlashcards", item._id, item);
        },
        changed: function(item) {
            item.flashcardObject = Flashcards.findOne({
                _id: item.flashcard,
                $or: [{
                    user: _userId
                }, {
                    public: true
                }]
            });
            _self.changed("itemFlashcards", item._id, item);
        },
        removed: function(item) {
            item.flashcardObject = Flashcards.findOne({
                _id: item.flashcard,
                $or: [{
                    user: _userId
                }, {
                    public: true
                }]
            });
            _self.removed("itemFlashcards", item._id, item);
        }
    });
    _self.ready();

    _self.onStop(function() {
        _watchItems.stop();
    });

});