'use strict';

define(function () {
    (function () {
        var $document = $(document);
        var $wrapper = $('.works-wrapper');
        var $sider = $('.works-sider');
        $sider.bind('click', function (event) {
            event.stopPropagation();
        });
        this.bind('click', function (event) {
            event.stopPropagation();
            var $this = $(this);
            if ($sider.hasClass('works-sider-active')) {
                $sider.removeClass('works-sider-active');
                $wrapper.removeClass('works-sider-active');
                $document.unbind('click.worksMenuHandler');
            } else {
                $sider.addClass('works-sider-active');
                $wrapper.addClass('works-sider-active');
                $document.unbind('click.worksMenuHandler').bind('click.worksMenuHandler', function (event) {
                    event.preventDefault();
                    $sider.removeClass('works-sider-active');
                    $wrapper.removeClass('works-sider-active');
                    $document.unbind('click.worksMenuHandler');
                });
            }
        });
    }).hook('menu');
});
//# sourceMappingURL=hook.js.map
