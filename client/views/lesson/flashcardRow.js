//Template.flashcardRow.events({
//
//})


Template.flashcardRow.userName = function () {
    var _userId = this.user;
//    console.log("_userId in userName", _userId);
    var _user = Meteor.users.findOne(_userId);
//    console.log("_user", _user);
    if (_user && _user.identity) {
        return _user.identity.nick;
    }

}

Template.flashcardRow.flashcardFront = function() {
    var _optsFront = {
        side: this.front,
        picture: this.frontPicture
    }
    return Meteor.flashcard.showSide(_optsFront);

}

Template.flashcardRow.flashcardBack = function() {
    var _optsBack = {
        side: this.back,
        picture: this.backPicture
    }
    return Meteor.flashcard.showSide(_optsBack);


}

