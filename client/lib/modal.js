function DefaultCancelButton(opts) {
        this.class = 'btn btn-primary btn-primary-main';
        if (opts && opts.cancelLabel) {
            this.label = opts.cancelLabel;
        } else {
            this.label = "Nevermind..";
        }
}

function DefaultOkButton(opts){
        this.closeModalOnClick = opts.closeOnOk; // if this is false, dialog doesnt close automatically on click
        this.class = 'btn btn-primary btn-primary-main';
        if (opts && opts.okLabel) {
            this.label = opts.okLabel;
        } else {
            this.label = 'Do it!';
        }

}

function DefaultButtons(opts) {
        if (opts && opts.withCancel) {
            this.cancel = new DefaultCancelButton(opts);
        }
        this.ok = new DefaultOkButton(opts);
}

function ModalConstructor(template, title, opts) {

    this.template = template;
    this.title = title;
    this.buttons = new DefaultButtons(opts);
    this.removeOnHide = true;
    console.log("constructed buttons", this.buttons);
}

var _initAndShow = function(template, title, opts) {
    var _modalConstructor = new ModalConstructor(template, title, opts)
    var _modal = ReactiveModal.initDialog(_modalConstructor);
    _modal.show();
    _modal.modalTarget.on('hidden.bs.modal', function() {
        console.log("and here", this);
    });
    return _modal;
};

var _signUpWithEmail = function () {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false
    };
    var _modal = _initAndShow(Template.signUpWithEmailForm, _title = "Join with Email", _opts);

    _modal.buttons.ok.on('click', function (button) {
        var _email = $(_modal.modalTarget).find('.newEmail').val();
        var _password = $(_modal.modalTarget).find(".newPassword").val();

        var _user = {
            "email": _email,
            "password": _password
        };

        var _id = Accounts.createUser(_user);

        Meteor.loginWithPassword(_email, _password, function (err) {
            if (err) {
                Meteor.modal.error("TheBrain is confused<br/>Please make sure you are not trying to register account with the same email address again!")
            } else {
                _modal.hide();
                Router.go("/");
            }
        });
    });

};

var _login = function() {
    var _title;
    var _opts = {
        withCancel: true,
        closeOnOk: false,
        okLabel: "Let me in!"
    };
    var _modal = _initAndShow(Template.logInForm, _title = "Welcome Again!", _opts);

    _modal.buttons.ok.on('click', function (button) {

        var _email = $(_modal.modalTarget).find('#login-email').val();
        var _password = $(_modal.modalTarget).find("#login-password").val();

        Meteor.loginWithPassword(_email, _password, function (err) {
            if (err) {
                Meteor.modal.error("TheBrain is confused<br/>Please make sure you provided the correct username and password!")
            } else {
                _modal.hide();
                Router.go("/");
            }
        });
    });


}

var _error = function(message) {
    var _title;
    var _opts = {
        withCancel: false,
        closeOnOk: true,
        okLabel: "Alrighty!"
    };
    Session.set("modalErrorMessage", message);
    var _modal = _initAndShow(Template.modalError, _title = "Oops..", _opts);
};


var _newCollection = function () {

}

var _hideClosestTo = function(element) {
    $(element).closest(".modal.in").modal("hide");
}



if (!Meteor.modal) Meteor.modal = {};
_.extend(Meteor.modal, {
    initAndShow: _initAndShow,
    signUpWithEmail: _signUpWithEmail,
    login: _login,
    error: _error,
    newCollection: _newCollection,
    hideClosestTo: _hideClosestTo
});