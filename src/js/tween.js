require('gsap/TweenMax');

TweenMax.set($(".project-list .project"), {
    rotationY: 0,
    rotationX: 0,
    rotationZ: 0,
    transformPerspective: 1e3
});

$("#card").mouseover(function () {
    $("#card").mousemove(function (e) {
        var a = e.pageX - $(this).offset().left,
            t = e.pageY - $(this).offset().top,
            i = a / $(this).width(),
            o = t / $(this).height(),
            s = -17 + 30 * i,
            n = 17 - 30 * o;

        TweenMax.to($(this), .5, {
            rotationY: s,
            rotationX: n,
            rotationZ: 0,
            transformPerspective: 1e3,
            ease: Quad.easeOut
        })
    });
}).mouseout(function () {
    $(this).unbind("mousemove"), TweenMax.to($(this), .5, {
        rotationY: 0,
        rotationX: 0,
        rotationZ: 0,
        transformPerspective: 1e3,
        ease: Quad.easeOut
    });
});