'use strict';

(function ($) {
    $(function () {
        $('.works-footer .floating-top').bind('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('.works-body .works-content').stop().animate({ scrollTop: 0 }, 1200);
        });

        $('.works-sider a.works-sider-group-menu').bind('click', function () {
            var $this = $(this);
            var $next = $this.next();
            if ($next.is('.works-sider-group')) {
                $this.toggleClass('active');
                $next.stop();
                if ($this.hasClass('active')) {
                    $this.siblings('.active').removeClass('active');
                    $next.slideDown(300);
                } else {
                    $next.slideUp(300);
                }
            }
        }).filter('.active').each(function () {
            var $this = $(this);
            var $next = $this.next();
            if ($next.is('.works-sider-group')) {
                $next.show();
            }
        });

        $('.works-sider a.works-sider-sub-group-menu').bind('click', function () {
            var $this = $(this);
            var $next = $this.next();
            if ($next.is('.works-sider-sub-group')) {
                $this.toggleClass('active');
                $next.stop();
                if ($this.hasClass('active')) {
                    $this.siblings('.active').removeClass('active');
                    $next.slideDown(300);
                } else {
                    $next.slideUp(300);
                }
            }
        }).filter('.active').each(function () {
            var $this = $(this);
            var $next = $this.next();
            if ($next.is('.works-sider-sub-group')) {
                $next.show();
            }
        });
    });
})(jQuery);
//# sourceMappingURL=bind.js.map
