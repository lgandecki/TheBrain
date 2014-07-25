var _renderer, _itemsToLearnCount = 0, itemsToLearn = {};
Template.scheduleModal.rendered = function() {
    console.log("scheduleModal rendered");
    Meteor.subscribe("itemsToLearnCount");
};

Template.myCollectionsList.created = function() {
    _itemsToLearnCount = 0;
    Session.set("itemsToLearnCount", 0);
    console.log("myCollectionsList created");
    delete Session.keys['itemsToLearn'];
};

Template.myCollectionsList.destroyed = function() {
    _itemsToLearnCount = 0;
    Session.set("itemsToLearnCount", 0);
}

Template.collectionStudyRow.rendered = function() {
    var _collectionId = "";

    $(".slider-custom").slider({value: 0}).on("slideStart", function (ev) {
        _collectionId = $(this).attr("data-id");
        itemsToLearn[_collectionId] = ev.value;
        Session.set("itemsToLearn", itemsToLearn);
        $(".toLearn.editable[data-id='" + _collectionId + "']").editable("setValue", ev.value);
    }).on("slide", function (ev) {
        if (itemsToLearn[_collectionId] !== ev.value) {

            $(".toLearn.editable[data-id='" + _collectionId + "']").editable("setValue", ev.value);
            itemsToLearn[_collectionId] = ev.value;
            Session.set("itemsToLearn", itemsToLearn);
        }
    });

//        $.fn.editable.defaults.mode = 'inline';
    $(".toLearn.editable:not(.editable-click)").editable('destroy').editable({
        anim: '100',
        mode: 'inline',
        showbuttons: false,
        success: function (response, newValue) {
            _collectionId = $(this).attr("data-id");
            $(".slider-custom[data-id='" + _collectionId + "']").slider("setValue", newValue);

            itemsToLearn[_collectionId] = newValue;
            Session.set("itemsToLearn", itemsToLearn);

        },
        validate: function (value) {
            var _value = parseFloat(value);
            var intRegex = /^\d+$/;
            if (!intRegex.test(_value)) {
                return "Has to be decimal";
            }
        }

    })
}

Template.myCollectionsList.collection = function() {
    return ItemsToLearnCount.find();
//    return Meteor.user() ? Meteor.user().collections : [];
};

Template.myCollectionsList.noNewItems = function() {
    return !ItemsToLearnCount.findOne();
}

Template.collectionStudyRow.name = function() {

    var _collectionId = this._id;
    var _collection = _.find(Meteor.user().collections, function(collection) {
        return collection._id === _collectionId;
    });
    return _collection ? _collection.name : "";
}

Template.collectionStudyRow.itemsInCollection = function() {
    return Meteor.collections.returnItemsIn(this._id);
//    Meteor.subscribe("itemsInCount", this._id);
//    var _itemsIn = ItemsInCount.findOne({_id: this._id});
//    if (_itemsIn){
//        return _itemsIn.count;
//    }
//    return Items.find({user: Meteor.userId(), collection: this._id}).count();
}

Template.collectionStudyRow.itemsToLearn = function() {
   return this.count;
}

