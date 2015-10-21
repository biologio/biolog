    Router.route('/', {
        layoutTemplate: 'aboutusLayout',
        name: 'aboutus',
        template: 'aboutus',
        data: {

        }

    });
    Template.aboutus.rendered = function() {
        $('body').removeClass("feed pushable")
        new WOW().init();
        $('.button-collapse').sideNav();


    };
    
    Template.aboutusLayout.events({
        'click .show-feedback-form': function(e, tpl) {
            console.log(e);
            $('.feedback.modal').modal('setting', 'transition', 'vertical flip')
                .modal('show');
                e.preventDefault();
        }
    });