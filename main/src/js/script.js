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

    var clipboard = new Clipboard('[data-clipboard]', {
        text: function (trigger) {
            var value = null;
            if (typeof trigger.dataset !== 'undefined' && typeof trigger.dataset.clipboard !== 'undefined') {
                value = trigger.dataset.clipboard;
            } else {
                value = trigger.getAttribute('data-clipboard');
            }
            return value || null;
        }
    });

    clipboard.on('success', function (e) {
        toast(e.text + ' Copied.');
    });

    !(function() {
        if (typeof HOMEWORKS_VERSION !== 'undefined') {
            var VERSION = 'v' + HOMEWORKS_VERSION;
            $('strong.homeworks-version').text(VERSION);
        }
    }());
});