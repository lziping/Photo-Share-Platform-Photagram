$(document).ready(function () {
    $('#slides').superslides({
        animation: "fade",
        play: "5000" //图片替换时间 ms 1s=ms*1000
    })
    var t = new Typed(".slides-sub", {
        strings: ["Welcome to Photagram! " +
        "Feel free to share some of your own and comment on others!"],
        typeSpeed: 100,
        loop: false,
        startDelay: 1000,
        showCursor: false,

    });
    $('.owl-carousel').owlCarousel({
        // loop: true,
        // autoplay: true,
        // autoplayTimeout: 2500,
        // autoplayHoverPause: true,
        items: 4,
        animateOut: 'fadeOut',
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    })


    // $('#navigation li a').click(function (e) {
    //     e.preventDefault()
    //
    //     var targetElement = $(this).attr('href')
    //
    //     var targetPosition = $(targetElement).offset().top;
    //
    //     $("html,body").animate({ scrollTop: targetPosition - 50 }, "fast")
    //
    // })
    //
    // const nav = $("#navigation");
    // const navTop = nav.offset().top;
    //
    // $(window).on("scroll", stickyNavigation);
    //
    // function stickyNavigation() {
    //     const body = $("body");
    //     if ($(window).scrollTop() >= navTop) {
    //         body.css('padding-top', nav.outerHeight() + "px")
    //         body.addClass("fixedNav")
    //     }
    //     else {
    //         body.css('padding-top', 0)
    //         body.removeClass("fixedNav")
    //     }
    // }

});