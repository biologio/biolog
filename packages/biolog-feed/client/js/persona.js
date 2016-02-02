Template.persona.rendered = function() {
    var rotator = $('#owl-rotator').owlCarousel({
        items: 1,
        margin: 30,
        stagePadding: 30,
        smartSpeed: 650,
        loop: true,
        autoplay: true,
        autoplayTimeout: 8000,
        autoplayHoverPause: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: false

            }
        },
        callbacks: true,
        beforeMove: function(a, b) {
            console.log(a, b)
        }



        //next.owl.carousel
    });
    rotator.on('translated.owl.carousel', function(e, d) {
        console.log(e,d, "translate")
       // $(e.currentTarget).find('.owl-item.active').find(".ns-box").removeClass("hide")

    })
    rotator.on('translated.owl.carousel', function(e, d) {
        console.log(e,d, "translated")
        $(e.currentTarget).find('.owl-item.active').find(".ns-box").toggleClass("hide ns-show ")

    })
  
      rotator.on('changed.owl.carousel', function(e, d) {
        console.log(e,d, "changed")
        $(e.currentTarget).find('.owl-item.active').next().find(".ns-box").toggleClass("hide ns-show ")

    })



    // setInterval(function() {
    //     //rotator.trigger('next.owl.carousel');
    //     //rotator.trigger('next.owl.carousel');
    // }, 10000)
$('#owl-rotator1').unslider({
    autoPlay:true,
    delay:8000,
    animation: 'vertical',
     autoplay: true,
      infinite: true
});


};
Template.persona.helpers({

});