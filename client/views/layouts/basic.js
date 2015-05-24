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
    },
    'click .sidebar.menu a': function(e) {
        // console.log(this);
        Router.go(this.url);
        $(".sidebar").sidebar("hide");
    }
});

Template.basicLayout.rendered = function(){
    if (! getPatient()) {
        Session.set("biolog.patient.modal.open", "true");
    }
}

Template.basicLayout.helpers({
    // array of side bar menus
    sidebarmenus:[
        {text:"Home", icon:"home", url:"/"},
        {text:"Medicines", icon:"first aid", url:"/meds"},
        {text:"Admin", icon:"settings", url:"/admin"},
        {text:"Conditions", icon:"heart", url:"/#"},
        {text:"Medications", icon:"treatment", url:"/#"},
        {text:"Events", icon:"calendar", url:"/#"},
        {text:"Timeline", icon:"tasks", url:"/#"},
        
    ]
});
Avatar.options = {
  fallbackType: 'initials',
  gravatarDefault: 'identicon'
  //defaultImageUrl: 'img/avatar.jpg'
};
// Template.avatar.replaces("avatarSemanticUI");