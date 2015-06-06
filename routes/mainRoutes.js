Iron.utils.debug = true;
Router.route('/', function () {
  this.render('home');
  SEO.set({ title: 'Home -' + Meteor.App.NAME });
});

Router.route('/profile', {name: 'user.profile'}, function () {
  this.render('profile');
  SEO.set({ title: 'Profile -' + Meteor.App.NAME });
});