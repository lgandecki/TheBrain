Template.flashcardDetails.flashcardVersion = function () {
    var _updatedVersions = [];
    var _flashcard = Flashcards.findOne({_id: Session.get("flashcardId")});
    if (_flashcard) {
        _updatedVersions = _flashcard.previousVersions;
        if (_flashcard.previousVersions) {
            _updatedVersions = _flashcard.previousVersions;
        } else {
            _updatedVersions = [];
        }
        var _newestVersion = {
            updatedBy: _flashcard.updatedBy,
            front: _flashcard.front,
            frontPicture: _flashcard.frontPicture,
            back: _flashcard.back,
            backPicture: _flashcard.backPicture,
            version: _flashcard.version,
            reason: _flashcard.reason,
            upVotes: _flashcard.upVotes,
            downVotes: _flashcard.downVotes
        }
        _updatedVersions.push(_newestVersion);

        _updatedVersions.sort(function (a, b) {
            if (a.version < b.version) {
                return 1;
            } else if (a.version > b.version) {
                return -1;
            }
            return 0;
        })

    }
    return _updatedVersions;
}
Template.flashcardDetails.flashcardFront = function () {

    var _optsFront = {
        side: this.front,
        picture: this.frontPicture
    }
    return Meteor.flashcard.showSide(_optsFront);


}


Template.flashcardDetails.flashcardBack = function () {
    var _optsBack = {
        side: this.back,
        picture: this.backPicture
    }
    return Meteor.flashcard.showSide(_optsBack);


}

Template.flashcardDetails.userName = function () {
    var _userId = this.updatedBy;
    console.log("_userId in userName", _userId);
    var _user = Meteor.users.findOne(_userId);
    if (_user) {
        return Meteor.userDetails.getName(_user._id);
    }
    return _userId;

}

Template.flashcardDetails.isUpdatedVersion = function () {
    return this.version > 1;
}
//
//Template.flashcard.upVotes = function() {
//    if (this.upVotes && this.upVotes > 0) {
//        return this.upVotes.length;
//    }
//}

Template.flashcardDetails.availableInCourse = function () {
    var _flashcardId = Session.get("flashcardId");
    var _courses = Courses.find().fetch();
    var _coursesContainingFlashcard = [];
    _courses.forEach(function (course) {
        if (course.lessons) {
            course.lessons.forEach(function (lesson) {
                if (_.contains(lesson.studentsFlashcards, _flashcardId) || _.contains(lesson.teacherFlashcards, _flashcardId)) {
                    _coursesContainingFlashcard.push(course);
                }
            })
        }
    })

    if (_coursesContainingFlashcard.length === 0) {
        setTimeout(function () {
            $(".inCourses").hide();
        }, 500);
    } else {
        setTimeout(function () {
            $(".inCourses").show();
        }, 500);
    }

    return _coursesContainingFlashcard;
}


Template.flashcardDetails.availableInKhan = function () {
    var _flashcardId = Session.get("flashcardId");
    var _flashcard = Flashcards.findOne({_id: _flashcardId});
    var _khanContainingFlashcard = [];

    if (_flashcard && _flashcard.khanAcademy && _flashcard.khanAcademy.playlistSlug) {
        Meteor.subscribe("khanPlaylist", _flashcard.khanAcademy.playlistSlug, function() {

        })
        var _khanPlaylist = KhanPlaylists.findOne({slug: _flashcard.khanAcademy.playlistSlug});
        if (_khanPlaylist) {
            var _video = _.find(_khanPlaylist.videos, function(video) {
                return video.youtube_id === _flashcard.youtube_id;
            })
            _khanContainingFlashcard.push(
                {
                    playlistSlug: _khanPlaylist.slug,
                    videoSlug: _flashcard.khanAcademy.videoSlug,
                    youtube_id: _flashcard.youtube_id,
                    playlistTitle: _khanPlaylist.title,
                    videoTitle: _video.title
                }
            );
        }
    }

    if (_khanContainingFlashcard.length === 0) {
        setTimeout(function () {
            $(".inKhan").hide();
        }, 500);
    } else {
        setTimeout(function () {
            $(".inKhan").show();
        }, 500);
    }

    return _khanContainingFlashcard;
}


Template.inCourseRow.events({
    'click .inCourseRow': function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var _courseId = $(e.target).attr("data-id");
        $("#flashcardDetailsModal").modal("hide");
        Router.go('/course/' + _courseId);
    }
})

Template.inKhanRow.events({
    'click .inKhanRow': function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var _videoId = $(e.target).attr("data-id");
        $("#flashcardDetailsModal").modal("hide");
        Router.go('/khanVideo/' + _videoId);
    }
});