if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};


var _collectionName = function () {
    var _selectedCollection = Session.get("selectedCollection");
    var _collectionName = "";
    if (_selectedCollection) {
        _collectionName = Meteor.collections.returnName(_selectedCollection);
    }
    return _collectionName + " - exam mode!";
}

Template.examModeModal.collectionId = function() {
    return Session.get("selectedCollection");
}

Template.examModeModal.itemsInCollection = function () {
    var _selectedCollection = Session.get("selectedCollection");
    return Meteor.collections.returnItemsIn(_selectedCollection);

}

var _renderer2;

Template.examModeModal.rendered = function () {
        var _collectionId = "";
        var _itemsToLearn = 0;
        Session.set("itemsForExamMode", _itemsToLearn);
        $(".slider-custom").slider({value: 0}).on("slideStart",function (ev) {
            _collectionId = $(this).attr("data-id");
            _itemsToLearn = ev.value;
            $(".toLearn.editable[data-id='" + _collectionId + "']").editable("setValue", ev.value);
            Session.set("itemsForExamMode", _itemsToLearn);
        }).on("slide", function (ev) {
                console.log("ItemsToLearn", _itemsToLearn, ev.value);
                if (_itemsToLearn !== ev.value) {

                    $(".toLearn.editable[data-id='" + _collectionId + "']").editable("setValue", ev.value);
                    _itemsToLearn = ev.value;
                    Session.set("itemsForExamMode", _itemsToLearn);
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

                _itemsToLearn = newValue;
                Session.set("itemsForExamMode", _itemsToLearn);

            },
            validate: function (value) {
                var _value = parseFloat(value);
                var intRegex = /^\d+$/;
                if (!intRegex.test(_value)) {
                    return "Has to be decimal";
                }
            }

        })

};

Template.examModeModal.destroyed = function() {
    delete Session.keys["itemsForExamMode"];
};

var _scheduleExamMode = function (e) {
        var _collectionId = Session.get("selectedCollection");
        console.log("itemsForExamMode", Session.get("itemsForExamMode"));
        var _callOpts = {
            function: "examModeSchedule",
            arguments: {
                collectionId: _collectionId,
                items: parseInt(Session.get("itemsForExamMode")) || 0
            },
            errorTitle: "Setting extra repetitions error",
            successTitle: "Extra repetition sessions applied"
        };

        Meteor.myCall(_callOpts);
        Meteor.modal.hideClosestTo("#examModeModal");
};

Meteor.theBrain.modals.examMode = function() {
    var _opts = {
        withCancel: true,
        closeOnOk: true,
        okLabel: "Schedule extra repetitions!"
    };

    var _modal = Meteor.modal.initAndShow(Template.examModeModal, _collectionName(), _opts);
    _modal.buttons.ok.on('click', function(button) {_scheduleExamMode()});

}



