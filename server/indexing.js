Meteor.startup(function() {
    Notifications._ensureIndex({"user": 1, "read": 1});

    Messages._ensureIndex({"from": 1});
    Messages._ensureIndex({"to": 1});

    Items._ensureIndex({"user": 1, "extraRepeatToday": 1});
    Items._ensureIndex({"user": 1, "nextRepetition": 1, "actualTimesRepeated": 1});
    Items._ensureIndex({"user": 1, "collection": 1, "actualTimesRepeated": 1});

    Items._ensureIndex({"flashcard": 1});

    Courses._ensureIndex({"admins": 1});
    Courses._ensureIndex({"score": 1});

    Conversations._ensureIndex({"me": 1, "sent": 1});


})