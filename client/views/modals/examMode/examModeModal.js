if (!Meteor.theBrain) Meteor.theBrain = {modals: {}};


var itemsToLearn = 0;
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
        $(".slider-custom").slider({value: 0}).on("slideStart",function (ev) {
            _collectionId = $(this).attr("data-id");
            itemsToLearn = ev.value;
            $(".toLearn.editable[data-id='" + _collectionId + "']").editable("setValue", ev.value);
        }).on("slide", function (ev) {
                console.log("ItemsToLearn", itemsToLearn);
                if (itemsToLearn !== ev.value) {

                    $(".toLearn.editable[data-id='" + _collectionId + "']").editable("setValue", ev.value);
                    itemsToLearn = ev.value;
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

                itemsToLearn = newValue;
            },
            validate: function (value) {
                _value = parseFloat(value);
                var intRegex = /^\d+$/;
                if (!intRegex.test(_value)) {
                    return "Has to be decimal";
                }
            }

        })

}

var _scheduleExamMode = function (e) {
        var _collectionId = Session.get("selectedCollection");

        var _callOpts = {
            function: "examModeSchedule",
            arguments: {
                collectionId: _collectionId,
                items: itemsToLearn
            },
            errorTitle: "Setting extra repetitions error",
            successTitle: "Extra repetition sessions applied"
        };

        Meteor.myCall(_callOpts);

//        console.log("This many we want to schedule extra", itemsToLearn);
        $("#examModeModal").modal("hide");
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



