define([
    '../../core/utils/data',
    '../../core/utils/helper',
    '../../core/utils/method',
    '../../core/models/index'
], (data, helper, method, model) => {
    (function ($) {
        new method('ripple', {
            init: function (element) {
                var context = this;
                var options = context.local._options;

                return element.each(function () {
                    var $child = $(this);

                    $child.addClass('btn-ripple');
                    if ($.inArray(options.theme, options.supportThemes) !== -1) {
                        $child.addClass('btn-ripple-' + options.theme);
                    }

                    context.$helper.bind($child, 'click', function (event) {
                        if (typeof event.originalEvent !== 'undefined' && options.passive === true) {
                            return false;
                        }

                        var $this = $(this);
                        if (!$this.hasClass('btn-ripple')) {
                            $child.addClass('btn-ripple');
                            if ($.inArray(options.theme, options.supportThemes) !== -1) {
                                $child.addClass('btn-ripple-' + options.theme);
                            }
                        }
                        var offset = this.getClientRects()[0] || {left: 0, top: 0};
                        var $ripple = $(context.$helper.parseTemplate('effect'));
                        var size = Math.min($this.width(), $this.height());
                        var scale = Math.max($this.width(), $this.height()) / size * 2;
                        var point = {
                            x: 0,
                            y: 0
                        };

                        if (
                            typeof event.x !== 'undefined' &&
                            typeof event.y !== 'undefined'
                        ) {
                            point = {
                                x: event.x - size / 2,
                                y: event.y - size / 2
                            };
                        } else {
                            point = {
                                x: (event.clientX - offset.left) - size / 2,
                                y: (event.clientY - offset.top) - size / 2
                            };
                        }

                        if (options.over === true) {
                            $child.css({
                                overflow: 'visible'
                            });
                        }

                        $ripple.css({ width: size, height: size, left: point.x, top: point.y });
                        $ripple.appendTo($this);
                        $this.addClass('btn-ripple-start');
                        context.$helper.promise(function () {
                            $ripple.css({
                                transform: 'scale(' + scale + ')',
                                opacity: 1
                            });

                            context.$helper.promise(function () {                            
                                $ripple.addClass('anim-end').css({
                                    opacity: 0 
                                });

                                context.$helper.promise(function () {
                                    $ripple.remove();
                                    $this.removeClass('btn-ripple-start');
                                }, 500);
                            }, 150);
                        }, 50);
                    });
                });
            },
            method: {
                start: function (element, value) {
                    var context = this;

                    if (typeof value === 'undefined') {
                        value = {
                            x: element.width() / 2,
                            y: element.height() / 2
                        };
                    }

                    context.$helper.triggerHandler(element, 'click', value);
                }
            },
            template: {
                effect: '<div class="btn-ripple-effect"></div>'
            },
            options: {
                supportThemes: [
                    'light',
                    'dark'
                ],
                over: false,
                passive: false
            }
        });
    }(jQuery));
});