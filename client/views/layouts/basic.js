Template.basicLayout.events({
    /*
    'click #btnSignIn': function(e) {
        e.preventDefault();
        Router.go('signin');
    },
    'click #btnSignOut': function(e) {
        e.preventDefault();
        Meteor.logout();
        Router.go('home');
    },
    */
    'click .main-menu': function(e) {
        $('.sidebar').sidebar('toggle');
    }
    
});

Template.basicLayout.rendered = function(){
    if (! getPatient()) {
        Session.set("biolog.patient.modal.open", "true");
    }
}

Template.sidebar.helpers({
    // array of side bar menus
    sidebarmenus:[
        {text:"Home", icon:"home", url:"/"},
        {text:"Conditions", icon:"heart", url:"/conditions"},
        {text:"Meds", icon:"first aid", url:"/meds"},
        {text:"Events", icon:"calendar", url:"/#"},
        {text:"Alerts", icon:"warning", url:"/alerts", badge: countAlerts()},
        {text:"Timeline", icon:"tasks", url:"/#"},
        {text:"About", icon:"info", url:"/about"},
        {text:"Admin", icon:"settings", url:"/admin"}
        
    ]
});
Template.sidebar.events({
   'click .sidebar.menu a': function(evt) {
        // console.log(this);
        evt.preventDefault();
        Router.go(this.url);
        $(".sidebar").sidebar("hide");
    }
});
Avatar.options = {
  fallbackType: 'initials',
  gravatarDefault: 'identicon'
  //defaultImageUrl: 'img/avatar.jpg'
};
// Template.avatar.replaces("avatarSemanticUI");