var classwired = (function(cw) {

    cw.reg_form = $("#register-form");

    cw.points = $("#info .point-container");
    cw.points_nav = $("#info .point-nav");
    cw.curr_point_index = 0;

    cw.form_success_msg = '<p>Thank you for registering!</p>';
    cw.form_error_msg = '<p>Oops! An error occured, please try again soon.</p>';

    cw.init = function() {
        this.setupRegForm();
        this.setupPoints();
    }

    cw.setupRegForm = function() {
        var self = this;

        this.reg_form.on('submit', function(e) {
            $(this).addClass('waiting');
            e.preventDefault();
            self.submitEmail();
        });

        this.reg_form.find('input').each(function() {
            $(this).on('focus', function() {
                self.clearFormState();
            });
        });

        $('#submit').on('click', function(e) {
            e.preventDefault();
            self.reg_form.submit();
        });
    }

    cw.submitEmail = function() {
        $.ajax({
            url: 'app/register',
            method: 'post',
            data: this.reg_form.serialize(),
            timeout: 2000,
            context: this
        }).done(function(response){
            this.onRegSuccess(response);
        }).fail(function(response){
            this.onRegFail(response);
        }).always(function(){
            this.reg_form.removeClass('waiting');
        });
    }

    cw.onRegSuccess = function(response) {
        $('#response-message').html(this.form_success_msg);
        $('#response-message').addClass('success');
        $('#submit').html('&#10004;');
    }

    cw.onRegFail = function(response) {
        $('#response-message').html(this.form_error_msg);
        $('#response-message').addClass('error');
    }

    cw.clearFormState = function() {
        $('#response-message').removeClass('success');
        $('#response-message').removeClass('error');
        $('#submit').html('Yes!');   
    }

    cw.setupPoints = function() {
        this.point_pages = this.points.find('.point').get();
        this.point_nav_buttons = this.points_nav.find('.point-nav-indicator').get();
        var self = this;

        $('#info .next').on('click', function() {
            self.goNextPoint();
        });

        $('#info .previous').on('click', function() {
            self.goPreviousPoint();
        });

        var bindClick = function(item, index) {
            $(item).on('click', function() {
                self.gotoPoint(index);
            });
        }

        _.map(this.point_nav_buttons, bindClick);

        this.gotoPoint(0);

    }

    cw.gotoPoint = function(atindex) {
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
    }

    cw.goNextPoint = function() {
        var next = this.curr_point_index + 1 >= this.point_pages.length ? 0 : this.curr_point_index + 1;

        this.gotoPoint(next);
    }

    cw.goPreviousPoint = function() {
        var next = this.curr_point_index - 1 < 0 ? this.point_pages.length - 1 : this.curr_point_index - 1;

        this.gotoPoint(next);
    }

    return cw;

})(classwired || {});


(function($){

    classwired.init();

})(jQuery);