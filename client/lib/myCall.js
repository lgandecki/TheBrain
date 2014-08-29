var _myCall = function (opts, cb) {
    if (!opts.successMessage) {
        opts.successMessage = "TheBrain made neural connections you asked for.";
    }
    var _error = false;
    if (!opts.function) {
        console.error("You have to specify function name!")
        _error = true;
    }
    if (!opts.arguments) {
        console.error("You have to specify arguments");
        _error = true;
    }
    if (!opts.errorTitle) {
        console.error("You have to specify error title");
        _error = true;
    }
//    if (!opts.successTitle) {
//        console.error("You have to specify success title");
//        _error = true;
//    }
    if (!_error) {
        Meteor.call(opts.function, opts.arguments, function (error) {
            if (error) {
                Meteor.popUp.error(opts.errorTitle, error.reason);
                if (cb) {
                    cb(false);
                }
            } else if (opts.successTitle) {
                Meteor.popUp.success(opts.successTitle, opts.successMessage);
                if (cb) {
                    cb(true)
                }
            }
        })
    }
}

if (!Meteor.myCall) Meteor.myCall = _myCall;
