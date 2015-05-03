Template.basicLayout.events({
    'click #btnSignIn': function(e) {
        e.preventDefault();
        Router.go('signin');
    }
});