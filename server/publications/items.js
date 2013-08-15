Meteor.publish("itemsToExtraRepeat", function() {
    return Items.find({user: this.userId, extraRepeatToday: true}, {limit: 3});
//    return Items.find({user: this.userId}, {fields: {_id: 1, collection: 1, user: 1, nextRepetition: 1, actualTimesRepeated: 1, extraRepeatToday: 1}});
});

Meteor.publish("itemsToRepeat", function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    return Items.find({user: this.userId, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}, {limit: 3});
})

Meteor.publish("itemsToLearn", function(collection) {
    return Items.find({user: this.userId, collection: collection, actualTimesRepeated: 0}, {limit: 3});
})

Meteor.publish("paginatedItems", function(opts, limit) {
    var _query = {user: this.userId};
    if (opts.collectionId) {
        _query.collection = opts.collectionId;
    }
    if (opts.search) {
        _query.$or = [
            {personalFront: new RegExp(opts.search)},
            {personalBack: new RegExp(opts.search)}
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
                    }
                }
            }
        ]
    })
})

Meteor.publish("singleItem", function(id){
    return id && Items.find({_id: id});
})