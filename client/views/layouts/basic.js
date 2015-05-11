Template.basicLayout.events({
    'click #btnSignIn': function(e) {
        e.preventDefault();
        Router.go('signin');
    },
    'click #btnSignOut': function(e) {
        e.preventDefault();
        Meteor.logout();
        Router.go('home');
    },
    'click .main-menu': function(e) {
        $('.sidebar').sidebar('toggle');
    }
});

Template.basicLayout.rendered = function(){
    
}

Template.basicLayout.helpers({
    // array of side bar menus
    sidebarmenus:[
        {text:"Home", icon:"home"},
        {text:"Topic", icon:"block layout"},
        {text:"Friends", icon:"smile"},
        {text:"History", icon:"calendar"},
        {text:"Messages", icon:"mail"},
    ]
});