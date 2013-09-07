Template.flashcardsOptionsNew.created = function() {
    console.log("created fon");
}

Template.flashcardsOptionsNew.events({
    "click .btn-addAll": function(e) {
        e.preventDefault();

        console.log("button");
    }
})

