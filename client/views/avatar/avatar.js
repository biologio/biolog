Avatar.options = {
  fallbackType: 'initials',
  gravatarDefault: 'identicon'
  //defaultImageUrl: 'img/avatar.jpg'
};

if (Meteor.isServer) {

  Meteor.startup(function () {
    console.log('startup...');
    console.log('options:', Avatar.options);
    console.log('url:', Avatar.getUrl());
  });
}

if (Meteor.isClient) {

  Accounts.ui.config({ passwordSignupFields: 'USERNAME_AND_EMAIL' });

  Template.avtarHtml.helpers({
    users: function () {
      return Meteor.users.find().fetch();
      console.log(Meteor.users.find().fetch());
    },
    service: function (user) {
      if      (user && user.services && user.services.twitter)   { return 'twitter'; }
      else if (user && user.services && user.services.facebook)  { return 'facebook'; }
      else if (user && user.services && user.services.google)    { return 'google'; }
      else if (user && user.services && user.services.github)    { return 'github'; }
      else if (user && user.services && user.services.instagram) { return 'instagram'; }
      else                                                       { return 'none'; }
    },
    name: function (user) {
      var name = '';
      if (user && user.profile && user.profile.name) {
        name = user.profile.name;
      }
      else if (user && user.username) {
        name = user.username;
      }
      return name;
    }
  });
}