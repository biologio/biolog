    Router.route('/', {
        layoutTemplate: 'aboutusLayout',
        name: 'aboutus',
        template: 'aboutus',
        data: {

        }

    });
Template.aboutus.rendered = function () {
	$('body').removeClass("feed pushable")
	 new WOW().init();
	 $('.button-collapse').sideNav();


};
    