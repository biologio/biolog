Iron.utils.debug = true;
Router.route('/avatar', function () {
  this.render('avtarHtml');
  this.layout('');
  SEO.set({ title: 'Avatar Test -' + Meteor.App.NAME });
});