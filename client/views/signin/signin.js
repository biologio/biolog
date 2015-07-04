// At the bottom of the client code
/*Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});


Accounts.onLogin(function() {
    console.log("onLogin called");
    if(Meteor.user() && Meteor.user().profile.newUser) {
        console.log("New user registered");
        Router.go("user.profile");
    }
});
*/

Tracker.autorun(function () {
    /*
    console.log("deps runned");
    if (Meteor.user() && Meteor.user().profile.newUser) {
      Router.go("user.profile", {name: Meteor.user().username});
    }
    */

});
