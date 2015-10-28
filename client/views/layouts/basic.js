Meteor.startup(function(){
     FeedMedications = new Mongo.Collection(null);
});

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
    'click a.toc': function(e) {
        $('.ui.sidebar').sidebar('setting', 'transition', 'scale down').sidebar('toggle');
    },
    'click .show-feedback-form': function(e, tpl) {
            console.log(e);
            $('.feedback.modal').modal({
                 closable: true,
            onApprove: function() {
               var obj = Feed.createFeedOjbect($('.feed-item'));
                 if ($('#feedbackText').val() != '') {
            Meteor.call('addFeedback', obj, function(err, data) {
                if (!err) {
                    console.log(data);

                }

            })
        }
        else {
            $(".feeback-label").addClass("error");
            return false;
        }
                return true;
            },
            onDeny: function() {
               $(".feeback-label").removeClass("error");
                
                return true;
            },
            onHide: function() {
                $('.form.feedback').form('clear')
                $(".feeback-label").removeClass("error");
                return true;
            }
            })

            .modal('setting', 'transition', 'vertical flip')
                .modal('show');
                e.preventDefault();
        }

});

Template.basicLayout.rendered = function() {

    $("#at-nav-button").removeClass("ui button");
    if (!getPatient()) {
        Session.set("biolog.patient.modal.open", "true");
    }
// show dropdown on hover
      $('.user.dropdown').dropdown({
        on: 'hover'
      });

};

Template.basicLayout.helpers({
    getUserId: function() {
        return Meteor.user()._id;
    }
});


Template.sidebar.helpers({
    // array of side bar menus
    sidebarmenus: [{
            text: "Home",
            icon: "ion-ios-home",
            url: "/feed"
        },
        {
            text: "Conditions",
            icon: "heartbeat",
            url: "/conditions"
        },
        {
            text: "Meds",
            icon: "ion-medkit",
            url: "/meds"
        },
        //{
        //    text: "Events",
        //    icon: "calendar",
        //    url: "/#"
        //},
        {
            text: "Alerts",
            icon: "ion-ios-bell",
            url: "/alerts",
            badge: countAlerts()
        }
        //{
        //    text: "Timeline",
        //    icon: "ion-ios-pulse-strong",
        //    url: "/#"
        //},
        //{
        //    text: "About",
        //    icon: "ion-ios-people",
        //    url: "/about"
        //},
        //{
        //    text: "Admin",
        //    icon: "settings",
        //    url: "/admin"
        //}

    ]


});
Template.sidebar.events({
    'click .sidebar.menu a': function(evt) {
        // console.log(this);
        evt.preventDefault();
        Router.go(this.url);
        $(".ui.sidebar").sidebar("hide");
    }
});

Avatar.options = {
    fallbackType: 'initials',
    gravatarDefault: 'identicon'
        //defaultImageUrl: 'img/avatar.jpg'
};
// Template.avatar.replaces("avatarSemanticUI");