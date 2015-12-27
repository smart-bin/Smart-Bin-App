function initSnackbar(callBack) {
    'use strict';
    var MaterialSnackbar = function MaterialSnackbar(element) {
        this.element_ = element;
        this.active = false;
        this.init();
        if (typeof callBack == "function") setTimeout(callBack, 10);
    };
    window['MaterialSnackbar'] = MaterialSnackbar;

    MaterialSnackbar.prototype.cssClasses_ = {
        SNACKBAR: 'mdl-snackbar',
        MESSAGE: 'mdl-snackbar__text',
        ACTION: 'mdl-snackbar__action',
        ACTIVE: 'is-active'
    };

    MaterialSnackbar.prototype.createSnackbar_ = function () {
        this.snackbarElement_ = document.createElement('div');
        this.textElement_ = document.createElement('div');
        this.snackbarElement_.classList.add(this.cssClasses_.SNACKBAR);
        this.textElement_.classList.add(this.cssClasses_.MESSAGE);
        this.snackbarElement_.appendChild(this.textElement_);
        this.snackbarElement_.setAttribute('aria-hidden', true);

        if (this.actionHandler_) {
            this.actionElement_ = document.createElement('button');
            this.actionElement_.type = 'button';
            this.actionElement_.classList.add(this.cssClasses_.ACTION);
            this.actionElement_.textContent = this.actionText_;
            this.snackbarElement_.appendChild(this.actionElement_);
            this.actionElement_.addEventListener('click', this.actionHandler_);
        }

        this.element_.appendChild(this.snackbarElement_);
        this.textElement_.innerHTML = this.message_;
        if (this.message_.indexOf("<i") > -1) this.textElement_.classList.add("has-icon");
        this.snackbarElement_.setAttribute('aria-hidden', false);
        var el = this;
        setTimeout(function () {
            $(".mdl-snackbar").addClass(el.cssClasses_.ACTIVE);
        }, 10);
            //this.snackbarElement_.classList.add(this.cssClasses_.ACTIVE);
        if ($(".mdl-button--fab").length > 0) {
            $("body").addClass("snackbar-visible");
            setTimeout(function () {
                $("body").removeClass("snackbar-visible");
            }, this.timeout_);
        }
        setTimeout(this.cleanup_.bind(this), this.timeout_);
    };

    MaterialSnackbar.prototype.removeSnackbar_ = function () {
        //if (this.actionElement_ && this.actionElement_.parentNode) {
        //    this.actionElement_.parentNode.removeChild(this.actionElement_);
        //}
        //this.textElement_.parentNode.removeChild(this.textElement_);
        //this.snackbarElement_.parentNode.removeChild(this.snackbarElement_);
    };

    MaterialSnackbar.prototype.showSnackbar = function (data) {
        if (data === undefined) {
            throw new Error(
                'Please provide a data object with at least a message to display.');
        }
        if (data['message'] === undefined) {
            throw new Error('Please provide a message to be displayed.');
        }
        if (data['actionHandler'] && !data['actionText']) {
            throw new Error('Please provide action text with the handler.');
        }
        if (this.active) {
            this.queuedNotifications_.push(data);
        } else {
            this.active = true;
            this.message_ = data['message'];
            if (data['timeout']) {
                this.timeout_ = data['timeout'];
            } else {
                this.timeout_ = 8000;
            }
            if (data['actionHandler']) {
                this.actionHandler_ = data['actionHandler'];
            }
            if (data['actionText']) {
                this.actionText_ = data['actionText'];
            }
            this.createSnackbar_();
        }
    };
    MaterialSnackbar.prototype['showSnackbar'] = MaterialSnackbar.prototype.showSnackbar;

    MaterialSnackbar.prototype.checkQueue_ = function () {
        if (this.queuedNotifications_.length > 0) {
            this.showSnackbar(this.queuedNotifications_.shift());
        }
    };

    MaterialSnackbar.prototype.cleanup_ = function () {
        this.snackbarElement_.classList.remove(this.cssClasses_.ACTIVE);
        this.snackbarElement_.setAttribute('aria-hidden', true);
        if (this.actionElement_) {
            this.actionElement_.removeEventListener('click', this.actionHandler_);
        }
        this.setDefaults_();
        this.active = false;
        this.removeSnackbar_();
        this.checkQueue_();
    };

    MaterialSnackbar.prototype.setDefaults_ = function () {
        this.actionHandler_ = undefined;
        this.message_ = undefined;
        this.actionText_ = undefined;
        return true;
    };

    MaterialSnackbar.prototype.init = function () {
        this.queuedNotifications_ = [];
        return this.setDefaults_();
    };
    MaterialSnackbar.prototype['init'] = MaterialSnackbar.prototype.init;

    componentHandler.register({
        constructor: MaterialSnackbar,
        classAsString: 'MaterialSnackbar',
        cssClass: 'mdl-js-snackbar',
        widget: true
    });
}
