var classwired = (function(cw) {

    cw.reg_form = $("#register-form");

    cw.points = $("#info .point-container");
    cw.points_nav = $("#info .point-nav");
    cw.curr_point_index = 0;

    cw.init = function() {
        this.setupRegForm();
        this.setupPoints();
    }

    cw.setupRegForm = function() {
        var self = this;

        this.reg_form.on('submit', function(e) {
            e.preventDefault();
            self.submitEmail();
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
            context: this
        }).done(function(response){
            this.onRegSuccess(response);
        }).fail(function(response){
            this.onRegFail(response);
        });
    }

    cw.onRegSuccess = function(response) {
        alert('Thanks for registering!');
    }

    cw.onRegFail = function(response) {
        alert('Sorry, there was an error. Please try again soon.');
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