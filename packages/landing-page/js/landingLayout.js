Template.landingLayout.events({
    'click .button.main-menu': function(evt, tpl) {
        console.log(evt);
        evt.preventDefault();
        $('.sidebar.left')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('toggle');
    },
    'click  a.landing-menu': function(evt, tpl) {
        evt.preventDefault();
        var sec = $(evt.currentTarget).data().menuanchor;
        console.log('section number is: ' + sec);
        $.fn.fullpage.moveTo(sec, 0);
        $(".close-button").trigger("click");
    }

});
