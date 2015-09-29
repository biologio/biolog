    Router.route('/', {
        layoutTemplate: 'aboutusLayout',
        name: 'aboutus',
        template: 'aboutus',
        data: {

        }

    });
Template.aboutus.rendered = function () {
	$('body').removeClass("feed")
};
    