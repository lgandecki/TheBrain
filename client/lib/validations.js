invalids = [];
_checkIfEmpty = function (selector) {
    if ($(selector).val() === "") {
        invalids.push(selector);
    }
};

_checkIfUniqueNameForUser = function (selector, collection) {
    uniqueName = $(selector).val();
    if (collection.find({user: Meteor.userId(), name: uniqueName}).count() > 0) {
        invalids.push(selector);
    }
}

_checkIfUniqueCollectionName = function (selector) {
    // uniqueName = $(selector).val();
    // if ($.inArray(Meteor.user().collections, uniqueName) > -1)
    // if (Meteor.user().find({collections: uniqueName}).count() > 0) {
    //     invalids.push(selector);
    // }
}

_markInvalids = function () {
    _.each(invalids, function (i) {
        _invalid($(i));
    });
};

_invalid = function (element) {
    element.parents(".control-group").addClass("error");
};

_clearErrors = function() {
    $(".control-group").removeClass("error");
}

if (!Meteor.validations) Meteor.validations = {};
_.extend(Meteor.validations, {
    checkIfEmpty: _checkIfEmpty,
    markInvalids: _markInvalids,
    invalids: invalids,
    clearErrors: _clearErrors,
    checkIfUniqueNameForUser: _checkIfUniqueNameForUser,
    checkIfUniqueCollectionName: _checkIfUniqueCollectionName
});