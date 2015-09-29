Router.configure({
    layoutTemplate: 'basicLayout'
});

Router.onBeforeAction(beforeLoginhHook, {
	except: ['aboutus', 'routeTwo']
});

function beforeLoginhHook() {
	console.log("login")
    if (!Meteor.userId()) {
        //if the user is not logged in , render the Login template
        Router.go('/sign-in');

    }
    this.next();
}
