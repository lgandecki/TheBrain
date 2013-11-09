Meteor.publish("itemsToExtraRepeat", function() {
    return Items.find({user: this.userId, extraRepeatToday: true, deactivated: false}, {limit: 3, sort: {lastRepetition: 1}});
//    return Items.find({user: this.userId}, {fields: {_id: 1, collection: 1, user: 1, nextRepetition: 1, actualTimesRepeated: 1, extraRepeatToday: 1}});
});

Meteor.publish("itemsToRepeat", function(now) {
    var _now = moment().add("days", 1).hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    console.log("_now", _now);
    console.log("now", now);
    var _query = {user: this.userId, deactivated: false, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}};
    console.log("_query", _query);
    console.log("Items Found", Items.find(_query, {limit: 3}).count());
    return Items.find(_query, {limit: 3});
})

Meteor.publish("itemsToLearn", function(collection) {
    return Items.find({user: this.userId, collection: collection, deactivated: false, actualTimesRepeated: 0}, {limit: 3});
})

Meteor.publish("paginatedItems", function(opts, limit) {
    var _query = {user: this.userId};
    if (opts.collectionId) {
        _query.collection = opts.collectionId;
    }
    else {
        _query.deactivated = false;
    }
    if (opts.search) {
        _query.$or = [
            {personalFront: new RegExp(opts.search, "i")},
            {personalBack: new RegExp(opts.search, "i")}
        ]
    }
    console.log("_query", _query);
    console.log("limit", limit);
//    return Items.find(_query, {limit: limit});

    return Meteor.publishWithRelations({
        handle: this,
        collection: Items,
        filter: _query,
        options: {
            limit: limit
        },
        mappings: [
            {
                key: 'flashcard',
                collection: Flashcards,
                options: {
                    fields: {
                        'comments._id': 1,
                        'upVotes': 1,
                        'downVotes': 1
                    }
                }
            }
        ]
    })
})

Meteor.publish("singleItem", function(id){
    return id && Items.find({_id: id, user: this.userId});
})
//
//
//Meteor.publish("testItems", function() {
//    return Items.find();
//})