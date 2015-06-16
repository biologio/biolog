
Template.landing.rendered = function() {
    $('#fullpage').fullpage({
        verticalCentered: false,
        scrollOverflow: false,
        menu:"#menu",
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage'],
        sectionsColor: function(){
        	return ['#DAC500','#3fC555', '#1BBC9B', '#7E8F7C']
        },
        //navigation: true,
        navigationPosition: 'right',
        // responsiveWidth: 900,
        css3: true,
        scrollingSpeed: 1000,
        autoScrolling: true,
        fitToSection: true,
        scrollBar: false,
        easing: 'easeInOutBounce',
        easingcss3: 'ease',
        loopBottom: true,
        loopTop: true,
        loopHorizontal: true,
        continuousVertical: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        touchSensitivity: 15,
        normalScrollElementTouchThreshold: 5,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        resize: true,
        paddingBottom: '10px',
        fixedElements: '#header, .footer',
        responsiveWidth: 0,
        responsiveHeight: 0,

        //Custom selectors
        sectionSelector: '.section',
        slideSelector: '.slide',
        slidesNavigation: true
    });
}
Template.landingLayout.events({
    "click  a.item": function(evt, tpl){
    	evt.preventDefault();
      var sNum = $(evt.currentTarget).data().menuanchor;
      console.log('section number is: '+ sNum);
        evt.preventDefault();
        $.fn.fullpage.moveTo(sNum, 0);
    }
});
