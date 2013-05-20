(function($){

    $("#register-form").on('submit', function(e) {
        e.preventDefault();
        submitEmail();
    });

    function submitEmail() {
        $.ajax({
            url: 'app/register',
            method: 'post',
            data: $('#register-form').serialize(),
            context: this
        }).done(function(response){
            alert('Thanks for registering!');
        }).fail(function(response){
            alert('Sorry, there was an error. Please try again soon.');
        });
    }

})(jQuery);