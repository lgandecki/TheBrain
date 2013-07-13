bootstrapData = {
    "users": [
        {   "_id": "adminUser",
            "email": "lgandecki@css.edu",
            "identity": {
                "name": {"firstName": "Lukasz", "lastName": "Gandecki"},
                "nick": "gozda"
            },
            "password": "testowe",
            "points": 50,
            "achievements": []
        },
        {   "_id": "normalUser",
            "email": "andy@css.edu",
            "identity": {
                "name": {"firstName": "Andy", "lastName": "Marquis"}
            },
            "password": "testowe2",
            "points": 100,
            "collections": [
                {
                    "name": "Main collection",
                    "itemsToLearn": [],
                    "itemsToRepeat": []
                }
            ],
            "achievements": []
        },
        {   "_id": "normalUser2",
            "email": "taylor@css.edu",
            "identity": {
                "name": {"firstName": "Taylor", "lastName": "McGiness"}
            },
            "password": "testowe3",
            "points": 500,
            "collections": [
                {
                    "name": "Main collection",
                    "itemsToLearn": [],
                    "itemsToRepeat": []
                }
            ],
            "achievements": []
        },

    ],
    "courses": [
        {
            "_id": "multiplicationCourse",
            "name": "Multiplication table",
            "public": true,
            "admins": ["adminUser", "normalUser"],
            "tags": ["math"],
            "upVotes": [],
            "downVotes": [],
            "news": [],
            "lessons": [],
            "events": [],
            "shortDescription": "",
            "longDescription": "",
            "comments": [
                {   "_id": "firstComment",
                    "user": "normalUser",
                    "posted": "",
                    "comment": "Very good course! Taught me multiplication!",
                    "parent": [],
                    "upVotes": [],
                    "downVotes": []
                },
                {
                    "user": "adminUser",
                    "posted": "",
                    "comment": "Agreed!",
                    "parent": ["firstComment"],
                    "upVotes": [],
                    "downVotes": []
                }

            ]
        },
        {
            "_id": "basicMathCourse",
            "name": "Basic Math Course",
            "upVotes": [],
            "downVotes": [],
            "lessons": [],
            "public": true,
            "admins": ["adminUser"],
            "tags": ["math", "multiplication"]
        },
        {
            "_id": "capitalsCourse",
            "name": "World Capitals",
            "upVotes": [],
            "downVotes": [],
            "lessons": [],
            "public": false,
            "admins": ["adminUser"],
            "tags": ["geography"]
        },
        {
            "_id": "datesCourse",
            "name": "Event Dates",
            "upVotes": [],
            "downVotes": [],
            "lessons": [],
            "public": true,
            "admins": ["normalUser2"],
            "tags": ["history"]
        }
    ],
    "flashcards": [
        {
            "_id": "flashcard5times5",
            "user": "normalUser",
            "public": true,
            "front": "5 * 5",
            "back": "25",
            "previousVersions": [],
            "suggestedVersions": [],
            "courses": ["multiplicationCourse", "basicMathCourse"],
            "upVotes": [],
            "downVotes": [],
            "source": {
                "youtube": null,
                "wikipedia": null,
                "link": null,
                "khan": null,
                "other": null
            }

        },
        {
            "_id": "flashcard3times3",
            "user": "normalUser",
            "public": true,
            "front": "3 * 3",
            "back": "9",
            "previousVersions": [],
            "suggestedVersions": [],
            "courses": ["multiplicationCourse", "basicMathCourse"],
            "upVotes": [],
            "downVotes": [],
            "source": {
                "youtube": null,
                "wikipedia": null,
                "link": null,
                "khan": null,
                "other": null
            }

        },
        {
            "_id": "flashcard2times2",
            "user": "normalUser",
            "public": true,
            "front": "2 * 2",
            "back": "4",
            "previousVersions": [],
            "suggestedVersions": [],
            "courses": ["multiplicationCourse", "basicMathCourse"],
            "reversible": false,
            "upVotes": [],
            "downVotes": [],
            "source": {
                "youtube": null,
                "wikipedia": null,
                "link": null,
                "khan": null,
                "other": null
            },
            "explanation": null
        },
        {
            "_id": "flashcard5plus7",
            "user": "normalUser",
            "public": true,
            "front": "5 + 7",
            "back": "12",
            "previousVersions": [],
            "suggestedVersions": [],
            "courses": ["multiplicationCourse", "basicMathCourse"],
            "reversible": false,
            "upVotes": [],
            "downVotes": [],
            "source": {
                "youtube": null,
                "wikipedia": null,
                "link": null,
                "khan": null,
                "other": null
            },
            "explanation": null
        },
        {
            "_id": "flashcardCapitalOfPoland",
            "user": "adminUser",
            "public": true,
            "front": "Capital of Poland",
            "back": "Warsaw",
            "previousVersions": [
                {
                    "front": "Capital of Poland",
                    "back": "Lublin"
                },
                {
                    "front": "Capital of Polandia",
                    "back": "Lublin"
                }
            ],
            "suggestedVersions": [
                {
                    "user": "normalUser",
                    "front": "Capital of Polska",
                    "back": "Warsaw",
                    "reason": "It's actually Warsaw!"
                },
                {
                    "user": "normalUser2",
                    "front": "Capital of Switzerland",
                    "back": "Warsaw",
                    "reason": "Aren't we talking about Switzerland here?"
                }
            ],
            "courses": ["capitalCourse"],
            "reversible": true,
            "upVotes": [],
            "downVotes": [],
            "comments": [
                {   "_id": "firstFCComment",
                    "user": "normalUser",
                    "posted": "",
                    "comment": "It's Warsaw, not Lublin!",
                    "parent": [],
                    "upVotes": [],
                    "downVotes": []
                },
                {
                    "user": "adminUser",
                    "posted": "",
                    "comment": "Right!",
                    "parent": ["firstFCComment"],
                    "upVotes": [],
                    "downVotes": []
                }
            ],
            "source": {
                "youtube": null,
                "wikipedia": null,
                "link": null,
                "khan": null,
                "other": null
            },
            "explanation": null
        }
    ],
    "items": [
        {
            "_id": "itemflashcard5times5AdminUser",
            "user": "adminUser",
            "flashcard": "flashcard5times5",
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
            "personalBack": null,
            "collection": "adminUserMainCollection"
        },
        {
            "_id": "itemflashcard5plus7AdminUser",
            "user": "adminUser",
            "flashcard": "flashcard5plus7",
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
            "personalBack": null,
            "collection": "adminUserNotImportantCollection"
        },
        {
            "_id": "itemflashcard3times3AdminUser",
            "user": "adminUser",
            "flashcard": "flashcard3times3",
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
            "personalBack": null,
            "collection": "adminUserNotImportantCollection"
        },
        {
            "_id": "itemflashcard2times2AdminUser",
            "user": "adminUser",
            "flashcard": "flashcard2times2",
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
            "personalBack": null,
            "collection": "adminUserNotImportantCollection"
        },
        {
            "_id": "itemCapitalOfPolandAdminUser",
            "user": "adminUser",
            "flashcard": "flashcardCapitalOfPoland",
            "easinessFactor": 2.5,
            "nextRepetition": "",
            "timesRepeated": 0,
            "actualTimesRepeated": 0,
            "previousDayChange": "",
            "extraRepeatToday": false,
            "frontNote": "question note",
            "backNote": "answer note",
            "previousAnswers": [
//                {
//                    "date": "",
//                    "answer": "Krakow",
//                    "grade": 0,
//                    "time": 20,
//                    "daysToNextRepetition": 10
//                },
//                {
//                    "date": "",
//                    "answer": "Warszawa",
//                    "grade": 4,
//                    "time": 10,
//                    "daysToNextRepetition": 15
//                }
            ],
            "personalFront": null,
            "personalBack": null,
            "collection": "adminUserMainCollection"
        }
    ],
    "flashcardVotes": [
        {
            "user": "adminUser",
            "item": "flashcard5times5",
            "vote": 1
        },
        {
            "user": "normalUser2",
            "item": "flashcardCapitalOfPoland",
            "vote": -1
        }
    ],
    "flashcardCommentVotes": [
    ],
    "courseVotes": [
        {
            "user": "adminUser",
            "item": "multiplicationCourse",
            "vote": 1
        }
    ],
    "courseCommentVotes": [
        {
            "user": "normalUser2",
            "item": "firstComment",
            "vote": 1
        }
    ],
    "collections": [
        {
            "_id": "adminUserMainCollection",
            "user": "adminUser",
            "name": "Main collection"
        },
        {
            "_id": "adminUserNotImportantCollection",
            "user": "adminUser",
            "name": "Not important"
        }
    ],
    "courseEvents": [
    ],
    "courseEventsComments": [
    ],

    "courseEventsCommentsVotes": [
    ],

    "theBrain" : [
        {
        "_id": "global",
        "connections": 5
        }
    ]
};