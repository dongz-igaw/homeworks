$(function () {
    $('.view-source').bind('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        $this.toggleClass('active');
        var $next = $this.next();
        if ($next.is('pre')) {
            $next.stop();
            if ($this.hasClass('active')) {
                $next.addClass('view-source-no-padding').slideDown(300);
            } else {
                $next.slideUp(300, function () {
                    $next.removeClass('view-source-no-padding')
                });
            }
        }
    });

    !(function() {
        if (typeof HOMEWORKS_VERSION !== 'undefined') {
            var VERSION = 'v' + HOMEWORKS_VERSION;
            $('strong.homeworks-version').text(VERSION);
        }
    }());
});