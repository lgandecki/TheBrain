//Template.flashcardRow.events({
//
//})

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
        console.log("front after", front);
    }



    return front;

}

Template.flashcardRow.flashcardBack = function() {
    var back =  stripHtml($(this.back).text());
    back = this.back;
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

function stripHtml(str) {
    return jQuery('<div />', { html: str }).text();
}