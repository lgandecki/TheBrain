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

        if (!flashcardAttributes.front && !flashcardAttributes.frontPicture)
            throw new Meteor.Error(422, "Please either fill the front of your flashcard or add picture");


        if (flashcardAttributes.collection) {
            // check for existing collection
        }

        var flashcard = _.extend(_.pick(flashcardAttributes, "public", "front",
            "back", "source", "frontPicture", "backPicture"), {
            user: user._id,
            "previousVersions": [],
            "upVotes": [],
            "downVotes": [],
            "comments": [],
            "version": 1,
            "reason": null,
            "score": 0,
            "updatedBy": null
        });

        if (flashcardAttributes.course) {
            if (!flashcardAttributes.lesson) {
                throw new Meteor.Error(422, "If you want to add a flashcard to a course you have to specify the lesson");
            }
            else if (Courses.find({"lessons._id": flashcardAttributes.lesson}).count() < 1) {
                throw new Meteor.Error(422, "You have to add a flashcard to an existing lesson");
            }
            else {
                flashcard.lessons = [
                    {
                        "course": flashcardAttributes.course,
                        "lesson": flashcardAttributes.lesson
                    }
                ];
            }
        }


        var flashcardId = Flashcards.insert(flashcard);

        flashcard.id = flashcardId;

        if (flashcardAttributes.collection) {
            var item = returnItem(flashcardAttributes.collection, flashcard);
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
    updateFlashcard: function (opts) {
        var _user = Meteor.user();
        if (!_user)
            throw new Meteor.Error(401, "You need to login to update flashcard");
        var _flashcard = Flashcards.findOne({_id: opts.flashcardId});

//        if (!_user.confirmed)
//            throw new Meteor.Error(401, "You have to be active user to update flashcards");

        if (!_flashcard)
            throw new Meteor.Error(401, "You can't edit non existing flashcard");

        if (!opts.reason) {
            throw new Meteor.Error(401, "You have to give reason for changing the flashcard");
        }

        var _previousFlashcard = {
            _id: new Meteor.Collection.ObjectID()._str,
            front: _flashcard.front,
            back: _flashcard.back,
            frontPicture: _flashcard.frontPicture,
            backPicture: _flashcard.backPicture,
            version: _flashcard.version,
            reason: _flashcard.reason,
            upVotes: _flashcard.upVotes,
            downVotes: _flashcard.downVotes,
            score: _flashcard.score
        };

        Flashcards.update({_id: _flashcard._id},
            {
                $addToSet: {previousVersions: _previousFlashcard},
                $inc: {version: 1},
                $set: {
                    updatedBy: _user._id,
                    front: opts.front || _flashcard.front,
                    back: opts.back || _flashcard.back,
                    frontPicture: opts.frontPicture || _flashcard.frontPicture,
                    backPicture: opts.backPicture || _flashcard.backPicture,
                    reason: opts.reason,
                    upVotes: [],
                    downVotes: [],
                    score: 0
                }
            });

        _flashcard = Flashcards.findOne(opts.flashcardId);

        if (opts.itemOpts) {
            opts.itemOpts.personalFront = _flashcard.front;
            opts.itemOpts.personalBack = _flashcard.back;
            opts.itemOpts.personalFrontPicture = _flashcard.frontPicture;
            opts.itemOpts.personalBackPicture = _flashcard.backPicture;
            opts.itemOpts.flashcardVersion = _flashcard.version;
            opts.itemOpts.flashcardVersionSeen = _flashcard.version;
            Meteor.call("updateItem", opts.itemOpts);
        }

        // TODO Notification to owner

    },
    addFlashcardsToCollection: function (opts) {
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
            var _flashcards = Flashcards.find({_id: {$all: _opts.flashcardsIds} })
            opts.flashcardsIds.forEach(function (flashcardId) {
                //  _flashcard = Flashcards.find({_id: flashcardId});
                Items.insert(returnItem(collectionId, _flashcard));
                // _items.push(returnItem(collectionId, flashcardId));
            })

            // console.log("_items", _items);
            // Items.insert(_items);
        }
    },
    newFlashcardComment: function (newFlashcardComment) {
        var _user = Meteor.user();
        if (!_user)
            throw new Meteor.Error(401, "You need to login to comment");
        _flashcard = Flashcards.findOne(newFlashcardComment.flashcardId);

        if (!_flashcard)
            throw new Meteor.Error(401, "You have to comment on existing flashcard");

        var comment = _.extend(_.pick(newFlashcardComment, "comment"), {
            _id: new Meteor.Collection.ObjectID()._str,
            user: _user._id,
            userName: _user.identity.nick,
            userPicture: _user.profile.picture,
            posted: Meteor.moment.fullNow(),
            parent: null,
            upVotes: [],
            downVotes: [],
            score: 0
        });

        Flashcards.update({_id: _flashcard._id}, {$addToSet: {comments: comment}});


        var _opts = {
            flashcardId: _flashcard._id,
            userId: _user._id
        };

//        flashcardCommentNotification(_opts);


    },
    newFlashcardReply: function (newFlashcardComment) {
        var _user = Meteor.user();
        if (!_user)
            throw new Meteor.Error(401, "You need to login to comment");
        var _flashcard = Flashcards.findOne(newFlashcardComment.flashcardId);

        if (!_flashcard)
            throw new Meteor.Error(401, "You have to comment on existing flashcard");

        var comment = _.extend(_.pick(newFlashcardComment, "comment"), {
            _id: new Meteor.Collection.ObjectID()._str,
            user: _user._id,
            userName: _user.identity.nick,
            userPicture: _user.profile.picture,
            posted: Meteor.moment.fullNow(),
            parent: newFlashcardComment.repliedCommentId,
            upVotes: [],
            downVotes: [],
            score: 0
        });

        Flashcards.update({_id: _flashcard._id}, {$addToSet: {comments: comment}});


        var _opts = {
            flashcardId: _flashcard._id,
            userId: _user._id
        };

//        flashcardCommentNotification(_opts);
        var _opts2 = {
            flashcardId: _flashcard._id,
            userId: _user._id,
            commentId: newFlashcardComment.repliedCommentId
        };
//        flashcardReplyNotification(_opts2);
    },
    flashcardCommentVoteUp: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on comments");

        _flashcard = Flashcards.findOne(opts.flashcardId);

        var _commentIndex = _.indexOf(_.pluck(_flashcard.comments, '_id'), opts.commentId);


        var modifier = {
            $pull: {},
            $inc: {}
        };

        _query = {_id: _flashcard._id};
        _query["comments." + _commentIndex + ".downVotes"] = user._id;

        modifier.$pull["comments." + _commentIndex + ".downVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = 1

        Flashcards.update(_query, modifier);

        var modifier = {
            $addToSet: {},
            $inc: {}
        };

        _query = {_id: _flashcard._id};
        _query["comments." + _commentIndex + ".upVotes"] = { $ne: user._id};

        modifier.$addToSet["comments." + _commentIndex + ".upVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = 1;

        Flashcards.update(_query, modifier);
        _opts = {
            user: user._id,
            commentId: opts.commentId,
            flashcardId: _flashcard._id
        };
//        flashcardCommentUpVoteNotification(_opts);
    },
    flashcardCommentVoteDown: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on comments");

        _flashcard = Flashcards.findOne(opts.flashcardId);

        var _commentIndex = _.indexOf(_.pluck(_flashcard.comments, '_id'), opts.commentId);

        var modifier = {
            $pull: {},
            $inc: {}
        };

        _query = {_id: _flashcard._id};
        _query["comments." + _commentIndex + ".upVotes"] = user._id;

        modifier.$pull["comments." + _commentIndex + ".upVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = -1;

        console.log("modifier first ", modifier);

        Flashcards.update(_query, modifier);


        var modifier = {
            $addToSet: {},
            $inc: {}
        };

        _query = {_id: _flashcard._id};
        _query["comments." + _commentIndex + ".downVotes"] = { $ne: user._id};

        modifier.$addToSet["comments." + _commentIndex + ".downVotes"] = user._id;
        modifier.$inc["comments." + _commentIndex + ".score"] = -1;


        console.log("modifier second ", modifier);


        Flashcards.update(_query, modifier);

        _opts = {
            user: user._id,
            commentId: opts.commentId,
            flashcardId: _flashcard._id
        };
//        flashcardCommentDownVoteNotification(_opts);
    }
});

returnItem = function (collectionId, flashcard) {
    var user = Meteor.user();
    var item = {
        "collection": collectionId,
        "user": user._id,
        "flashcard": flashcard.id,
        "easinessFactor": 2.5,
        "nextRepetition": "",
        "timesRepeated": 0,
        "actualTimesRepeated": 0,
        "previousDaysChange": 0,
        "extraRepeatToday": false,
        "frontNote": null,
        "backNote": null,
        "previousAnswers": [
        ],
        "personalFront": flashcard.front,
        "personalBack": flashcard.back,
        "personalFrontPicture": flashcard.frontPicture,
        "personalBackPicture": flashcard.backPicture,
        "flashcardVersion": 1,
        "flashcardVersionSeen": 1
    }
    return item;
}