$(function () {
    var animateToggle; 
    (animateToggle = function () {
        setTimeout(function () {
            $('.layout').addClass('layout-active');
            setTimeout(function () {
                $('.layout').removeClass('layout-active');
                animateToggle();
            }, 5000);
        }, 3000);
    })();
});