Meteor.methods({
    sayHello: function(opts) {
        if (this.userId) {
            var _test = ItemsToRepeatCount.findOne();
            console.log("_test", _test);
            return "Hello " + _test;
        }
        return "hello";
    },
    setNextRepetition: function(jsonString) {
//        opts.forEach(function(opt) {
//            console.log("opt", opt);
//        })
        var _json = JSON.parse( jsonString );
        console.log("snr opts", _json[0]);
        console.log("evaluation", _json[0].evaluation);
//        console.log("snr opts2", opts2);
        if (this.userId && _json) {
            Meteor.flashcard.setNextRepetition(_json[0].evaluation, _json[0].itemId, "");
        }
    }
});