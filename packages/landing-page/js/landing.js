Template.landing.rendered = function() {
    $("#section2 .cloumn").addClass('hide');
    var animations = ["animated slideInLeft", "animated slideInDown", "animated slideInDown", "animated slideInRight", "animated slideInLeft", "animated slideInUp", "animated slideInUp", "animated slideInRight"];
    $('#fullpage').fullpage({
        verticalCentered: true,
        scrollOverflow: false,
        menu: "#menu",
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage'],
        sectionsColor: function() {
            return ['#DAC500', '#3fC555', '#1BBC9B', '#7E8F7C']
        },
        //navigation: true,
        navigationPosition: 'right',
        // responsiveWidth: 900,
        css3: true,
        scrollingSpeed: 1000,
        autoScrolling: true,
        fitToSection: false,
        scrollBar: false,
        easing: 'easeInOutBounce',
        easingcss3: 'ease',
        loopBottom: false,
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
        paddingBottom: '0px',
        fixedElements: '#header, .footer',
        responsiveWidth: 0,
        responsiveHeight: 0,

        //Custom selectors
        sectionSelector: '.section',
        slideSelector: '.slide',
        slidesNavigation: true,
        afterRender: function() {
            //on page load, start the slideshow
            console.log(this);
            slideTimeout = setInterval(function() {
                $.fn.fullpage.moveSlideRight();
            }, 3000);
        },
        onLeave: function(index, nextIndex, direction) {

            setTimeout(function() {
                switch (nextIndex) {
                    case 1:
                        $("#section2 .column").addClass('hide');
                        break;
                    case 2:
                        $("#section2 .column").addClass('hide');
                        break;
                    case 3:

                        console.log(nextIndex);
                        var cols = $("#section2 .column");
                        $.each(cols, function(index, col) {
                            $(col).removeClass('hide').addClass(animations[index]);
                        });

                        break;
                    case 4:

                        $("#section2 .column").addClass('hide');
                        break;
                }
            }, 1000)
            if (index == '2') {
                console.log('on leaving the slideshow/section1');
                clearInterval(slideTimeout);
            } else {
                slideTimeout = setInterval(function() {
                    $.fn.fullpage.moveSlideRight();
                }, 6000);
            }
        }
    });
}
Template.landingLayout.events({
    "click  a.item": function(evt, tpl) {
        evt.preventDefault();
        var sNum = $(evt.currentTarget).data().menuanchor;
        console.log('section number is: ' + sNum);
        evt.preventDefault();
        $.fn.fullpage.moveTo(sNum, 0);
        $(".close-button").trigger("click");
    }
});
