// server: publish the current size of a collection
Meteor.publish("itemsToLearnInCount", function (collection) {
    var self = this;
    var count = 0;
    var initializing = true;
    var handle = Items.find({user: this.userId, collection: collection, actualTimesRepeated: 0}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("itemsToLearnInCount", collection, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("itemsToLearnInCount", collection, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("itemsToLearnInCount", collection, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});

// server: publish the current size of a collection
Meteor.publish("itemsToRepeatInCount", function (collection, now) {
    var self = this;
    var count = 0;
    var initializing = true;
    var handle = Items.find({user: this.userId, collection: collection, nextRepetition: {$lte: now}, actualTimesRepeated: {$gt: 0}}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("itemsToRepeatInCount", collection, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("itemsToRepeatInCount", collection, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("itemsToRepeatInCount", collection, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});

Meteor.publish("itemsToReLearnInCount", function (collection) {
    var self = this;
    var count = 0;
    var initializing = true;
    var handle = Items.find({user: this.userId, collection: collection, extraRepeatToday: true}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("itemsToReLearnInCount", collection, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("itemsToReLearnInCount", collection, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("itemsToReLearnInCount", collection, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});

Meteor.publish("learnedItemsInCount", function (collection) {
    var self = this;
    var count = 0;
    var initializing = true;
    var handle = Items.find({user: this.userId, collection: collection, extraRepeatToday: true}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("learnedItemsInCount", collection, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("learnedItemsInCount", collection, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("learnedItemsInCount", collection, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});

Meteor.publish("itemsInCount", function (collection) {
    var self = this;
    var count = 0;
    var initializing = true;
    var handle = Items.find({user: this.userId, collection: collection}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("itemsInCount", collection, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("itemsInCount", collection, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("itemsInCount", collection, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});

Meteor.publish("itemsToRepeatCount", function (now) {
    var self = this;
    var count = 0;
    var initializing = true;
    var that = this;
    console.log("that.userId 1", that.userId);
    var handle = Items.find({user: this.userId, nextRepetition: {$lte: now}, actualTimesRepeated: {$gt: 0}}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed("itemsToRepeatCount", that.userId, {count: count});
        },
        removed: function (doc, idx) {
            count--;
            self.changed("itemsToRepeatCount", that.userId, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;
    console.log("that.userId 2", that.userId);
    self.added("itemsToRepeatCount", that.userId, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});



Meteor.publish("itemsToReLearnCount", function () {
    var self = this;
    var count = 0;
    var initializing = true;
    var that = this;
    var handle = Items.find({user: this.userId, extraRepeatToday: true}).observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing) {
//                console.log("that.userId", that.userId);
//                console.log("count here", count);
                self.changed("itemsToReLearnCount", that.userId, {count: count});
            }
        },
        removed: function (doc, idx) {
            count--;
            self.changed("itemsToReLearnCount", that.userId, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;

    self.added("itemsToReLearnCount", that.userId, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});



Meteor.publish("calendarItemsToRepeat", function (month, year) {
    console.log("calendarItemsToRepeat", month, year);
    var self = this;
    var count = {};
    var initializing = true;
    var that = this;
//    var _start = moment(""+month+"-"+year+"", "MM-YYYY");
//    var _end = moment(""+month+"-"+year+"", "MM-YYYY").add("months", 1);
//    var _startDate = new Date(_start.valueOf());
//    var _endDate = new Date(_end.valueOf());
//    console.log("_start", _start.valueOf(), " _end ", _end.valueOf());
    var _nextRepetition;
    console.log("that.userId 1 calendar", that.userId);
//    var handle = Items.find({user: this.userId, nextRepetition: {$gte: _startDate, $lt: _endDate}, actualTimesRepeated: {$gt: 0}}).observeChanges({
    var handle = Items.find({user: this.userId, nextRepetition: {$gte: month, $lt: year}, actualTimesRepeated: {$gt: 0}}).observeChanges({
        added: function (doc, idx) {
            console.log("added", idx);
            _nextRepetition = idx.nextRepetition;
            var _date = "" + _nextRepetition.toDateString();
//            _date = 04;
            if (count[_date]) {
                count[_date].title++;
                count[_date].title = "" + count[_date].title
            }
            else {
                count[_date] = {};
                count[_date].start = _nextRepetition.toDateString();
                count[_date].title = 1;
                count[_date].title = "" + count[_date].title
            }
            if (!initializing)
                self.changed("calendarItemsToRepeat", that.userId, {count: count});
        },
        removed: function (doc, idx) {
            _nextRepetition = idx.nextRepetition;
            var _date = "" + _nextRepetition.toDateString();
            if (count[_date].title >= 1) {
                count[_date]--;
                count[_date].title = "" + count[_date].title
            }
            else {
                count[_date] = {};
            }
            self.changed("calendarItemsToRepeat", that.userId, {count: count});
        }
        // don't care about moved or changed
    });

    initializing = false;
    console.log("that.userId 2", that.userId);
    console.log("count", count);
    self.added("calendarItemsToRepeat", that.userId, {count: count});
    self.ready();

    self.onStop(function () {
        handle.stop();
    });
});
