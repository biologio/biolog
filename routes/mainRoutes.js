Iron.utils.debug = true;
Router.route('/', function () {
  this.render('home');
  SEO.set({ title: 'Home -' + Meteor.App.NAME });
});
/*
Router.route('/signin', function () {
  this.render('signin');
  SEO.set({ title: 'signin -' + Meteor.App.NAME });
});
*/