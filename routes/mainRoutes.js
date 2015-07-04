Iron.utils.debug = true;
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
Router.route('/', function () {
  this.render('home');
  SEO.set({ title: 'Home -' + Meteor.App.NAME });
});

Router.route('/profile/:name', {name: 'user.profile'}, function () {
  this.render('profile');
  SEO.set({ title: 'Profile -' + Meteor.App.NAME });
});


