Iron.utils.debug = true;
/*
Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('home');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});
*/
Router.route('/', function () {
  this.render('feed');
    SEO.set({ title: Meteor.App.NAME });
});


Router.route('/profile/:name',
    {
        name: 'user.profile',
        template:"profile"
    },
    function () {
        /*
        if (this.params.name == 'undefined') {
            this.redirect('/profile/' + Meteor.user().username);
        }*/
        var sex = Meteor.user().profile.sex;
            
        // this.render('profile');
        SEO.set({ title: 'Profile -' + Meteor.App.NAME });
    }
);


Router.route('/privacy', function () {
});

