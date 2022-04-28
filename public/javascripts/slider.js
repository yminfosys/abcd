$( document ).ready(function() {

    var owl = $('#owl-slider .owl-carousel');
    owl.owlCarousel({
        loop:true,
        autoplay:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    });


    var owla = $('#bestproperty .owl-carousel');
    owla.owlCarousel({
        loop:true,
        autoplay:true,
        dots:false,
        margin:4,
        lazyLoad:true.valueOf,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:3
            },
            1000:{
                items:4
            }
        }
    });


    
   

    

})


var $abc=$('.abcd');

$abc.waypoint(function(){
    //alert("ol")
    //$abc.css({"display":"none"})

})






//<script src="/javascripts/owl.carousel.min.js"></script>
 //   <script src="/javascripts/test.js"></script>
 //<!-- OWL CSS -->
 //<link rel='stylesheet' href='stylesheets/owl.carousel.css' />
 ///<link rel='stylesheet' href='stylesheets/owl.theme.green.css' />