Flashcards = new Meteor.Collection('flashcards');


Flashcards.allow({

    'insert': ownsDocument,
    'update': ownsDocument,

    'remove': function (userId, docs) {
        return false;
    }
});

//Posts.deny({
//    update: function(userId, post, fieldNames) {
//        // may only edit the following two fields:
//        return (_.without(fieldNames, 'url', 'title').length > 0);
//    }
//});

Meteor.methods({
    newFlashcard: function (flashcardAttributes) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add new flashcards");

        if (!flashcardAttributes.front)
            throw new Meteor.Error(422, "Please fill the front of your flashcard");


        if (flashcardAttributes.collection) {
            // check for existing collection
        }

        var flashcard = _.extend(_.pick(flashcardAttributes, "public", "front",
            "back", "source"), {
            user: user._id,
            "previousVersions": [],
            "suggestedVersions": [],
            "upVotes": [],
            "downVotes": []
        });

        if (flashcardAttributes.course) {
            if (!flashcardAttributes.lesson) {
                throw new Meteor.Error(422, "If you want to add a flashcard to a course you have to specify the lesson");
            }
            else if(Courses.find({"lessons._id": flashcardAttributes.lesson}).count() < 1) {
                throw new Meteor.Error(422, "You have to add a flashcard to an existing lesson");
            }
            else {
                flashcard.lessons = [{
                    "course": flashcardAttributes.course,
                    "lesson": flashcardAttributes.lesson
                }];
            }
        }


        var flashcardId = Flashcards.insert(flashcard);

        if (flashcardAttributes.collection) {
            var item = returnItem(flashcardAttributes.collection);
            Items.insert(item);
        }

        if (flashcard.lessons) {

            _course = Courses.findOne(flashcard.lessons[0].course);

            var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), flashcard.lessons[0].lesson);
            var modifier = {$addToSet: {}};
            modifier.$addToSet["lessons." + _lessonIndex + ".flashcards"] = flashcardId;


            Courses.update(_course._id, modifier);
        }


    },
    addFlashcardsToCollection: function(opts) {
        // _flashcardsIds = _opts.flashcardsIds;
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to add flashcards");


        if (Meteor.isServer && opts.flashcardsIds) {
            var _items = [];
            _course = Courses.findOne({_id: opts.courseId});

            if (!_course) {
                throw new Meteor.Error(401, "You need to add flashcards from existing course");
            }
            var _collectionIndex = _.indexOf(_.pluck(user.collections, 'name'), _course.name);

            if (_collectionIndex > -1) {
                collectionId = user.collections[_collectionIndex]._id;
            }
            else {
                collection = {
                    name: _course.name
                };
                collectionId = Meteor.call("newCollection", collection);
            }
            opts.flashcardsIds.forEach(function(flashcardId) {
                Items.insert(returnItem(collectionId, flashcardId));
                // _items.push(returnItem(collectionId, flashcardId));
            })

            // console.log("_items", _items);
            // Items.insert(_items);
        }
    }
});

returnItem = function(collectionId, flashcardId) {
    var user = Meteor.user();
    var item = {
        "collection": collectionId,
        "user": user._id,
        "flashcard": flashcardId,
        "easinessFactor": 2.5,
        "nextRepetition": "",
        "timesRepeated": 0,
        "actualTimesRepeated": 0,
        "previousDayChange": "",
        "extraRepeatToday": false,
        "frontNote": null,
        "backNote": null,
        "previousAnswers": [
        ],
        "personalFront": null,
        "personalBack": null

    }
    return item;
}