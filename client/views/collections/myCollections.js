

Template.myCollections.collection = function() {
    return Meteor.user() ? Meteor.user().collections : [];
};



Template.collectionRow.rendered = function() {
    
    $.fn.editable.defaults.mode = 'inline';

    $('.collection-name.editable:not(.editable-click)').editable('destroy').editable({
        success: function (response, newName) {
            collectionAttributes = {
                collectionId: $(this).attr("data-id"),
                name: newName
            }
            Meteor.call("updateCollectionName", collectionAttributes, function (error, id) {
                if (error) {
                    Meteor.popUp.error("TheBrain is confused", error.reason);
                }
                else {
                    Meteor.popUp.success("Collection name updated", "TheBrain made the neural connections changes you asked for.");
                }
            });
        }});
    
    console.log("this", this);
//    Meteor.subscribe("itemsToLearnIn", this._id);
}

Template.collectionRow.itemsToLearn = function() {
    Meteor.subscribe("itemsToLearnInCount", this._id);
    var _itemsToLearnIn = ItemsToLearnInCount.findOne({_id: this._id});
    if (_itemsToLearnIn) {
        return _itemsToLearnIn.count;
    }
//    return 0;

}

Template.collectionRow.itemsToRepeat = function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    Meteor.subscribe("itemsToRepeatInCount", this._id, _now);
    var _itemsToRepeatIn = ItemsToRepeatInCount.findOne({_id: this._id});
    if (_itemsToRepeatIn){
        return _itemsToRepeatIn.count;
    }
//    return 0;
//    return Items.find({user: Meteor.userId(), collection: this._id, nextRepetition: {$lte: _now}, actualTimesRepeated: {$gt: 0}}).count()
}

Template.collectionRow.itemsToReLearn = function() {
    Meteor.subscribe("itemsToReLearnInCount", this._id);
    var _itemsToReLearnIn = ItemsToReLearnInCount.findOne({_id: this._id});
    if (_itemsToReLearnIn){
        return _itemsToReLearnIn.count;
    }
//    return 0;
//    return Items.find({user: Meteor.userId(), collection: this._id, extraRepeatToday: true}).count();
}

Template.collectionRow.learnedItems = function() {
    var _now = moment().hours(0).minutes(0).seconds(0).milliseconds(0)._d;
    Meteor.subscribe("learnedItemsInCount", this._id, _now);
    var _learnedItemsIn = LearnedItemsInCount.findOne({_id: this._id});
    if (_learnedItemsIn){
        return _learnedItemsIn.count;
    }
//    return 0;
//    return Items.find({user: Meteor.userId(), collection: this._id, actualTimesRepeated: {$gt: 0}, extraRepeatToday: false}).count();
}

Template.myCollections.events({

    "click .btn-addCollectionModal": function (e, template) {
        e.preventDefault();
        $('#newCollectionModal').modal('show');
    }

});
Template.collectionRow.events({
    "click .collectionRow .editable": function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    "click .collectionRow .btn": function(e) {
        e.stopPropagation();
    },
    "click .collectionRow": function(e) {
        Meteor.Router.to('/myCollection/' + this._id);
    },
    "click .clickable": function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
})

Template.collectionRow.isRestricted = function() {
    return (this.name === "Main collection" || this.name === "Deactivated");
}