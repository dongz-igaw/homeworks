$(function () {
    var f = function () {
        setTimeout(function () {
            $('.layout').addClass('layout-active');
            setTimeout(function () {
                $('.layout').removeClass('layout-active');
                f();
            }, 5000);
        }, 3000);
    };
    f();
});