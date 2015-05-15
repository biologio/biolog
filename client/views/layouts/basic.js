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
        {text:"Home", icon:"home", url:"/"},
        {text:"Medicines", icon:"lab", url:"/meds"},
        {text:"Admin", icon:"settings", url:"/admin"},
        {text:"Conditions", icon:"heart", url:"#"},
        {text:"Medications", icon:"wifi", url:"#"},
        {text:"Events", icon:"calendar", url:"#"},
        {text:"Timeline", icon:"tasks", url:"#"},
        
    ]
});