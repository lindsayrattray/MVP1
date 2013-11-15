var classwired = (function(cw) {

    cw = _.extend(cw, {
        reg_form: $("#register-form"),
        points: $("#info .point-container"),
        points_nav: $("#info .point-nav"),
        curr_point_index: 0,
        MESSAGE_SUCCESS_FORM: 'Thank you for registering!',
        MESSAGE_ERROR_UNKNOWN: 'Oops! An error occured, please try again soon.',
        MESSAGE_ERROR_INVALID_EMAIL: 'Please enter a vaild email address.',
        MESSAGE_ERROR_EMPTY_EMAIL: 'Please enter your email address.',
        FORM_MESSAGE_TYPES: ['success', 'error'],
        CLASSWIRED_LIST_NAMES: {
            mvp_signup: 'ClassWired signups'
        },

        init: function() {
            this.setupRegForm();
            this.setupPoints();
        },

        ////

        showFormMessage: function(messages, type) {
            var response_el = $('#response-message');
            var messages_html =
                _.str.sprintf('<p>%s</p>', _.flatten([messages]).join('</p><p>'));

            _.each(this.FORM_MESSAGE_TYPES, function(message_type) {
                if(message_type !== type) response_el.removeClass(message_type);
            }, this);

            response_el
                .html(messages_html)
                .addClass(type);
        },

        showFormErrorMessage: function(messages) {
            this.showFormMessage(messages, 'error');
        },

        showFormSuccessMessage: function(messages) {
            this.showFormMessage(messages, 'success');
        },

        resetFormState: function() {
            var response_el = $('#response-message');

            _.each(this.FORM_MESSAGE_TYPES, function(message_type) {
                response_el.removeClass(message_type);
            }, this);

            response_el.html('');

            $('#submit').html('Yes!');
        },

        ////

        setupRegForm: function() {
            var self = this;

            this.reg_form.on('submit', function(e) {
                e.preventDefault();

                var email = _.str.clean($(this).find('#email').val());
                var validation = self.validateEmail(email);

                if(!validation.valid) {
                    self.showFormErrorMessage(validation.errors);
                    return;
                }

                $(this).addClass('waiting');
                self.submitEmail(email);
            });

            this.reg_form.find('input').each(function() {
                $(this).on('focus', function() {
                    self.resetFormState();
                });
            });

            $('#submit').on('click', function(e) {
                e.preventDefault();
                self.resetFormState();
                self.reg_form.submit();
            });
        },

        validateEmail: function(email) {
            var errors = [];
            var not_empty = (/\S/).test(email);
            var valid = (/\S+@\S+\.\S+/).test(email);
            if(valid) return {valid: true};

            else if(not_empty) errors.push(this.MESSAGE_ERROR_INVALID_EMAIL);
            else errors.push(this.MESSAGE_ERROR_EMPTY_EMAIL);
            return {valid: false, errors: errors};
        },

        showEmailInvalidError: function(errors) {
            $('#response-message').html(this.form_error_msg);
            $('#response-message').addClass('error');
        },

        submitEmail: function(email) {
            var api_key = classwired.config.mailchimp_api_key,
                api_url = classwired.config.mailchimp_api_url;
            
            this.getMailchimpList(api_url, api_key)
                .done(function(response){
                    var lists = response.data;
                    var list = _.find(
                        lists,
                        function(list) {
                            return list.name === this.CLASSWIRED_LIST_NAMES.mvp_signup;
                        },
                        this
                    );
                    console.log(list.name, list.id);
                    
                    // this.onMailChimpListRetrieved(
                    //     email,
                    //     list_id,
                    //     api_url,
                    //     api_key
                    // );
                })
                .fail(function(response) {
                    this.onRegFail(response);
                    this.onRegAlways(response);
                });
        },

        subscribeViaApi: function() {
            return $.ajax({
                url: 'app/register',
                method: 'post',
                data: this.reg_form.serialize(),
                dataType: 'json',
                context: this
            });
        },

        getMailchimpList: function(api_url, api_key) {
            return $.ajax({
                url: _.str.sprintf('%slists/list', api_url),
                data: {apikey: api_key},
                dataType: 'json',
                context: this
            });
        },

        onMailChimpListRetrieved: function(email, list_id, api_url, api_key) {
            this.subscribeToMailchimpList(email, list_id, api_url, api_key)
                .done(function(response) { this.onRegSuccess(response); })
                .fail(function(response) { this.onRegFail(response); })
                .always(function(response) { this.onRegAlways(response); });
        },

        subscribeToMailchimpList: function(email, list_id, api_url, api_key) {
            var subscription_data = {
                email: {email: email},
                apikey: api_key,
                id: list_id
            };
            return $.ajax({
                url: _.str.sprintf('%slists/subscribe', api_url),
                method: 'post',
                data: JSON.stringify(subscription_data),
                contentType: 'application/json',
                dataType: 'json',
                context: this
            });
        },

        onRegSuccess: function(response) {
            this.showFormSuccessMessage(this.MESSAGE_SUCCESS_FORM);
            $('#submit').html('&#10004;');
        },

        onRegFail: function(response) {
            this.showFormErrorMessage(this.MESSAGE_ERROR_UNKNOWN);
        },

        onRegAlways: function(response){
            this.reg_form.removeClass('waiting');
        },

        ////

        setupPoints: function() {
            var _go_next = _.bind(this.goNextPoint, this);
            var _go_previous = _.bind(this.goPreviousPoint, this);
            var _go_point = _.bind(this.gotoPoint, this);

            this.point_pages = this.points.find('.point');
            this.point_nav_buttons = this.points_nav.find('.point-nav-indicator');
            
            $('#info .next').on('click', _go_next);
            $('#info .previous').on('click', _go_previous);

            _.each(
                this.point_nav_buttons,
                function(button, index) {
                    $(button).on('click', _.partial(_go_point, index));
                },
                this
            );

            this.gotoPoint(0);

        },

        gotoPoint: function(atindex) {
            $(this.point_nav_buttons[this.curr_point_index]).removeClass('current');

            $(this.point_pages[this.curr_point_index]).removeClass('current');

            this.curr_point_index = atindex;
            var num_indices = this.point_pages.length - 1;

            $(this.point_pages[this.curr_point_index]).addClass('current');
            
            _.map(this.point_pages, function(item, index) {
                var newleft = (index - atindex) * 100;
                $(item).css('left', newleft+'%');
            });

            $(this.point_nav_buttons[this.curr_point_index]).addClass('current');
        },

        goNextPoint: function() {
            var next = this.curr_point_index + 1 >= this.point_pages.length ? 0 : this.curr_point_index + 1;

            this.gotoPoint(next);
        },

        goPreviousPoint: function() {
            var next = this.curr_point_index - 1 < 0 ? this.point_pages.length - 1 : this.curr_point_index - 1;

            this.gotoPoint(next);
        }
    });
    

    return cw;

})(classwired || {});


(function($){

    classwired.init();

})(jQuery);