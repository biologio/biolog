Template.landing.rendered = function() {
    //$("#section2 .cloumn").addClass('hide');
    var animations = ["animated slideInLeft", "animated slideInDown", "animated slideInUp", "animated slideInRight"];
    var animations2 =[ "animated bounceInLeft", "animated bounceInDown", "animated bounceInUp", "animated bounceInRight"];
    $('#fullpage').fullpage({
        verticalCentered: true,
        scrollOverflow: false,
        menu: "#menu",
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage', '6thPage', '7thPage', '8thPage'],
        sectionsColor: function() {
            return ['#DAC500', '#3fC555', '#1BBC9B', '#7E8F7C']
        },
        //navigation: true,
        navigationPosition: 'right',
        // responsiveWidth: 900,
        css3: true,
        //scrollingSpeed: 1000,
        autoScrolling: true,
        fitToSection: false,
        scrollBar: false,
        easing: 'linear',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: true,
        loopHorizontal: true,
        continuousVertical: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: true,
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
                         $("#section2 .top-1rem").addClass('hide');
                           $("#section3 .top-1rem").addClass('hide');
                         $("#section3 .column").addClass('hide');
                        break;
                    case 2:
                        $("#section2 .column").addClass('hide');
                         $("#section2 .top-1rem").addClass('hide');
                           $("#section3 .top-1rem").addClass('hide');
                         $("#section3 .column").addClass('hide');
                        break;
                    case 3:

                        console.log(nextIndex);
                        var cols = $("#section2 .column");
                        $.each(cols, function(index, col) {
                            $(col).removeClass('hide').addClass(animations[index]);
                        });
                         $("#section2 .top-1rem").removeClass('hide').addClass('animated bounceInDown');
                          $("#section3 .top-1rem").addClass('hide');
                         $("#section3 .column").addClass('hide');

                        break;
                         case 4:

                        console.log("nextIndex");
                        var cols = $("#section3 .column");
                        $.each(cols, function(index, col) {
                            $(col).removeClass('hide').addClass(animations[index]);
                        });
                         $("#section3 .top-1rem").removeClass('hide').addClass('animated bounceInDown');
                          $("#section2 .top-1rem").addClass('hide');
                         $("#section2 .column").addClass('hide');

                        break;
                    case 5:
                          var cols = $("#section4 .column");
                        $.each(cols, function(index, col) {
                            $(col).removeClass('hide').addClass(animations2[index]);
                        });
                         $("#section4 .top-1rem").removeClass('hide').addClass('animated fadeInUp');
                         $("#section3 .top-1rem").addClass('hide');
                         $("#section3 .column").addClass('hide');
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

