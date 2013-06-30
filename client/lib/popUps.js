_stack_bar_bottom = {"dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0};



_success = function(title, text) {
    var opts = {
        title: title,
        text: text,
        addclass: "stack-bar-bottom",
        cornerclass: "",
        width: "100%",
        stack: _stack_bar_bottom,
        type: "success",
        opacity: 1,
        nonblock: true,
        nonblock_opacity: .4,
        delay: 3000
    };
    $.pnotify(opts);
};

_error = function(title, text) {
    var opts = {
        title: title,
        text: text,
        addclass: "stack-bar-bottom",
        cornerclass: "",
        width: "100%",
        stack: _stack_bar_bottom,
        type: "error",
        opacity: 1,
        nonblock: true,
        nonblock_opacity: .4,
        delay: 3500

    };
    $.pnotify(opts);
};


if (!Meteor.popUp) Meteor.popUp = {};
_.extend(Meteor.popUp, {
    success: _success,
    error: _error,
    stack_bar_bottom: _stack_bar_bottom
});