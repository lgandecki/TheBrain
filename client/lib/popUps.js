_stack_bar_bottom = {"dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0};
_stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
_stack_bottomleft = {"dir1": "right", "dir2": "up", "push": "top"};



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

_notification = function(title, message, userAvatar) {
    text = '<img class="notificationImage pull-right" src="' + userAvatar + '"/>' + "<h5>" + title + "</h5>" + message;
    var opts = {
        text: text,
        addclass: "stack-bottomright",
        opacity: 1,
        nonblock: true,
        nonblock_opacity: .4,
        delay: 4000,
        animate_speed: 900,
        animation: {
            effect_in: "drop",
            options_in: {
                easing: "easeOutBounce"
            },
            effect_out: "drop",
            options_out: {
                easing: "easeOutCubic"
            }
        },
        shadow: false,
        cornerclass: 'ui-pnotify-sharp',
        type: 'info',
        stack: _stack_bottomright,
        min_height: '40px',
        icon: false
    };
    $.pnotify(opts);
};

if (!Meteor.popUp) Meteor.popUp = {};
_.extend(Meteor.popUp, {
    success: _success,
    error: _error,
    notification: _notification,
    stack_bar_bottom: _stack_bar_bottom,
    stack_bottomright: _stack_bottomright
});