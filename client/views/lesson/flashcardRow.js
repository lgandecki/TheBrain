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
//    var _currentItem = Items.findOne({_id: Session.get("currentItemId")});
    var front = stripHtml(this.front);


    var _frontPicture

    if (this.frontPicture) {
        _frontPicture = this.frontPicture;
    }


    if (_frontPicture) {
        front = '<a href="' + _frontPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + front + '"> \
        <img src="' + _frontPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="front" class="flashcardFront">' + front + '</div>';
//        console.log("front after", front);
    }



    return front;

}

Template.flashcardRow.flashcardBack = function() {
    var back =  stripHtml(this.back);
    var _backPicture;

    if (this.backPicture) {
        _backPicture = this.backPicture;
    }

    if (_backPicture) {
        back = '<a href="' + _backPicture + '" class="flashcardPicture pull-right slimboxPicture" title="' + back + '"> \
        <img src="' + _backPicture + '/convert?h=80&w=80" class="editableImage"/></a> \
        <div name="back" class="flashcardBack">' + back + '</div>';
    }

    return back;


}

stripHtml = function(str) {
    return jQuery('<div />', { html: str }).text();
}