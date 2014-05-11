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
            updatedBy: user._id,
            "previousVersions": [],
            "upVotes": [],
            "downVotes": [],
            "comments": [],
            "version": 1,
            "reason": null,
            "score": 0
        });

        if (flashcardAttributes.youtube_id) {
            flashcard.youtube_id = flashcardAttributes.youtube_id;
            if (flashcardAttributes.khanAcademy) {
                flashcard.khanAcademy = {
                    playlistSlug: flashcardAttributes.khanAcademy.playlistSlug,
                    videoSlug: flashcardAttributes.khanAcademy.videoSlug
                }
            }


        }

        if (flashcardAttributes.course) {
            console.log("flashcardAttributes", flashcardAttributes);
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

        flashcard._id = flashcardId;

        if (flashcardAttributes.collection) {
            var item = returnItem(flashcardAttributes.collection, flashcard);
            Items.insert(item);
        }


        if (flashcard.lessons) {
            var _addToLessonOpts = {
                "course": flashcardAttributes.course,
                "lesson": flashcardAttributes.lesson,
                "flashcardId": flashcard._id
            }
            addFlashcardToLesson(_addToLessonOpts);
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
            updatedBy: _flashcard.updatedBy,
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

        var _notificationOpts = {

        }

        _notificationOpts = {
            user: _user._id,
            flashcardId: _flashcard._id
        };
        updatedFlashcardNotification(_notificationOpts);


        // TODO Notification to owner

    },
    addFlashcardsToCollection: function (opts) {
        // _flashcardsIds = _opts.flashcardsIds;
        var user = Meteor.user(),
            collectionId, _course;
        if (!user)
            throw new Meteor.Error(401, "You need to login to add flashcards");


        if (Meteor.isServer && opts.flashcardsIds) {
            var _items = [];
            if (opts.courseId) {
                _course = Courses.findOne({_id: opts.courseId});

                if (!_course) {
                    throw new Meteor.Error(401, "You need to add flashcards from existing course");
                }
                var _collectionIndex = _.indexOf(_.pluck(user.collections, 'name'), _course.name);

                if (_collectionIndex > -1) {
                    collectionId = user.collections[_collectionIndex]._id;
                }
                else {
                    var collection = {
                        name: _course.name
                    };
                    collectionId = Meteor.call("newCollection", collection);
                }
            }
            else if (opts.collectionId) {
                collectionId = opts.collectionId;
            }
            else {
                throw new Meteor.Error(401, "You either have to specify the collection or add a flashcard from a course");
            }
//            var _flashcards = Flashcards.find({_id: {$all: opts.flashcardsIds} })
            console.log("flashcardsIds", opts.flashcardsIds);
            opts.flashcardsIds.forEach(function (flashcardId) {
                console.log("flashcardId", flashcardId);
                var _existingItem = Items.findOne({user: user._id, flashcard: flashcardId});
                if (!_existingItem) {
                    var _flashcard = Flashcards.findOne({_id: flashcardId});

                    Items.insert(returnItem(collectionId, _flashcard));
                }
                // _items.push(returnItem(collectionId, flashcardId));
            })

            // console.log("_items", _items);
            // Items.insert(_items);
        }
    },
    addVideoFlashcardsToCollection: function (opts) {
        // _flashcardsIds = _opts.flashcardsIds;
        var user = Meteor.user(),
            collectionId, _course;
        if (!user)
            throw new Meteor.Error(401, "You need to login to add flashcards");

        if (!opts.youtube_id)
            throw new Meteor.Error(403, "You need to specify youtube id");

        if (!opts.courseId)
            throw new Meteor.Error(403, "You need to specify course id");

        if (Meteor.isServer) {
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
                    var collection = {
                        name: _course.name
                    };
                    collectionId = Meteor.call("newCollection", collection);
                }

//            var _flashcards = Flashcards.find({_id: {$all: opts.flashcardsIds} })
            console.log("flashcardsIds", opts.flashcardsIds);
            var _flashcards = Flashcards.find({youtube_id: opts.youtube_id})
            _flashcards.forEach(function (flashcard) {
                console.log("flashcard", flashcard);
                var _existingItem = Items.findOne({user: user._id, flashcard: flashcard._id});
                if (!_existingItem) {

                    Items.insert(returnItem(collectionId, flashcard));
                }
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
    flashcardVoteUp: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on comments");

        var _flashcard = Flashcards.findOne(opts.flashcardId);
        if (!_flashcard)
            throw new Meteor.Error(401, "You need to vote on existing flashcard");

        Flashcards.update({
            _id: _flashcard._id,
            downVotes: user._id
        }, {
            $pull: {
                downVotes: user._id
            },
            $inc: {
                score: 1
            }
        });
        Flashcards.update({
            _id: _flashcard._id,
            upVotes: {
                $ne: user._id
            }
        }, {
            $addToSet: {
                upVotes: user._id
            },
            $inc: {
                score: 1
            }
        });


    },
    flashcardVoteDown: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on comments");

        var _flashcard = Flashcards.findOne(opts.flashcardId);
        if (!_flashcard)
            throw new Meteor.Error(401, "You need to vote on existing flashcard");

        Flashcards.update({
            _id: _flashcard._id,
            upVotes: user._id
        }, {
            $pull: {
                upVotes: user._id
            },
            $inc: {
                score: -1
            }
        });
        Flashcards.update({
            _id: _flashcard._id,
            downVotes: {
                $ne: user._id
            }
        }, {
            $addToSet: {
                downVotes: user._id
            },
            $inc: {
                score: -1
            }
        });
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
    },
    upVoteAFlashcardVersion: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on flashcard versions");

        var _flashcard = Flashcards.findOne({_id: opts.flashcardId});
        if (!_flashcard)
            throw new Meteor.Error(401, "You need to vote on existing flashcard");

        if (_flashcard.version === opts.selectedVersion) {
            _selectedFlashcard = _flashcard;
            var _opts = {
                flashcardId: _flashcard._id
            };
            Meteor.call("flashcardVoteUp", _opts);
        }
        else {

            var _versionIndex = _.indexOf(_.pluck(_flashcard.previousVersions, '_id'), opts.selectedVersion);

            var modifier = {
                $pull: {},
                $inc: {}
            };

            _query = {_id: _flashcard._id};
            _query["previousVersions." + _versionIndex + ".downVotes"] = user._id;

            modifier.$pull["previousVersions." + _versionIndex + ".downVotes"] = user._id;
            modifier.$inc["previousVersions." + _versionIndex + ".score"] = 1;

            console.log("modified in up vote", modifier);
            Flashcards.update(_query, modifier);

            var modifier = {
                $addToSet: {},
                $inc: {}
            };

            _query = {_id: _flashcard._id};
            _query["previousVersions." + _versionIndex + ".upVotes"] = { $ne: user._id};

            modifier.$addToSet["previousVersions." + _versionIndex + ".upVotes"] = user._id;
            modifier.$inc["previousVersions." + _versionIndex + ".score"] = 1;

            Flashcards.update(_query, modifier);

        }



    },
    downVoteAFlashcardVersion: function (opts) {
        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error(401, "You need to login to vote on flashcard versions");

        var _flashcard = Flashcards.findOne({_id: opts.flashcardId});
        if (_flashcard.version === opts.selectedVersion) {
            _selectedFlashcard = _flashcard;
            var _opts = {
                flashcardId: _flashcard._id
            };
            Meteor.call("flashcardVoteDown", _opts);
        }
        else {

            var _versionIndex = _.indexOf(_.pluck(_flashcard.previousVersions, '_id'), opts.selectedVersion);

            var modifier = {
                $pull: {},
                $inc: {}
            };

            _query = {_id: _flashcard._id};
            _query["previousVersions." + _versionIndex + ".upVotes"] = user._id;

            modifier.$pull["previousVersions." + _versionIndex + ".upVotes"] = user._id;
            modifier.$inc["previousVersions." + _versionIndex + ".score"] = -1;

            console.log("modified in down vote", modifier);


            Flashcards.update(_query, modifier);

            var modifier = {
                $addToSet: {},
                $inc: {}
            };

            _query = {_id: _flashcard._id};
            _query["previousVersions." + _versionIndex + ".downVotes"] = { $ne: user._id};

            modifier.$addToSet["previousVersions." + _versionIndex + ".downVotes"] = user._id;
            modifier.$inc["previousVersions." + _versionIndex + ".score"] = -1;

            Flashcards.update(_query, modifier);

        }


    },
    addFlashcardsToCourse: function (opts) {
        var user = Meteor.user(), _course, _flashcard;
        if (!user)
            throw new Meteor.Error(401, "You need to login to add flashcard to course");
        _course = Courses.findOne({_id: opts.courseId});

        if (!_course) {
            throw new Meteor.Error(401, "You need to add flashcards from existing course");
        }


        opts.flashcardsIds.forEach(function (flashcardId) {
            console.log("flashcardId", flashcardId);
            var _flashcard = Flashcards.findOne({_id: flashcardId});

            if (_flashcard) {
                var _addToLessonOpts = {
                    "course": opts.courseId,
                    "lesson": opts.lessonId,
                    "flashcardId": _flashcard._id
                }
                addFlashcardToLesson(_addToLessonOpts);
                addLessonToFlashcard(_addToLessonOpts);
            }

        })

    }
});

returnItem = function (collectionId, flashcard) {
    var user = Meteor.user();
    var item = {
        "collection": collectionId,
        "user": user._id,
        "flashcard": flashcard._id,
        "deactivated": false,
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
        "flashcardVersion": flashcard.version,
        "flashcardVersionSeen": flashcard.version
    }
    return item;
}

var addFlashcardToLesson = function (opts) {
    var _course = Courses.findOne(opts.course);

    var _lessonIndex = _.indexOf(_.pluck(_course.lessons, '_id'), opts.lesson);
    var modifier = {$addToSet: {}, $pull: {}};
    if (_.indexOf(_course.admins, Meteor.user()._id) > -1) {
        if (_.indexOf(_course.lessons[_lessonIndex].studentsFlashcards, opts.flashcardId) > -1) {
            modifier.$addToSet["lessons." + _lessonIndex + ".teacherFlashcards"] = opts.flashcardId;
            modifier.$pull["lessons." + _lessonIndex + ".studentsFlashcards"] = opts.flashcardId;
        } else {
            modifier.$addToSet["lessons." + _lessonIndex + ".teacherFlashcards"] = opts.flashcardId;
        }
    }
    else {
        if (_.indexOf(_course.lessons[_lessonIndex].teacherFlashcards, opts.flashcardId) === -1) {
            modifier.$addToSet["lessons." + _lessonIndex + ".studentsFlashcards"] = opts.flashcardId;
        }
    }

    Courses.update(_course._id, modifier);

}

var addLessonToFlashcard = function (opts) {
    var _newLesson =
        {
            "course": opts.course,
            "lesson": opts.lesson
        };

    Flashcards.update({_id: opts.flashcardId}, {$addToSet: {lessons: _newLesson}});


}