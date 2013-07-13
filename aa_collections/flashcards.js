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


        flashcard = {};
        flashcard.lessons = {};

        if (flashcardAttributes.course) {
            if (!flashcardAttributes.lesson) {
                throw new Meteor.Error(422, "If you want to add a flashcard to a course you have to specify the lesson");
            }
            else if(Courses.find({lessons: flashcardAttributes.lesson}).count() < 1) {
                throw new Meteor.Error(422, "You have to add a flashcard to an existing lesson");
            }
            else {
                flashcard.lessons.push(flashcardAttributes.lesson);
            }
        }

        var flashcard = _.extend(_.pick(flashcardAttributes, "public", "front",
            "back", "source"), {
            user: user._id,
            "previousVersions": [],
            "suggestedVersions": [],
            "comments": [],
            "upVotes": [],
            "downVotes": []
        });



        var flashcardId = Flashcards.insert(flashcard);

        var item = _.extend(_.pick(flashcardAttributes, "collection"), {

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

        });

        Items.insert(item);


    }

})