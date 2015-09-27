    Router.route('/aboutus', {
        layoutTemplate: 'aboutusLayout',
        name: 'aboutus',
        template: 'aboutus',
        data: {

        }

    });

    Template.body.destroyed = function () {
    	alert(Session.get("postFacts"))
    };