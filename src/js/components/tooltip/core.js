define([
    '../../core/utils/data',
    '../../core/utils/helper',
    '../../core/utils/method',
    '../../core/models/index'
], (data, helper, method, model) => {
    (function($) {
        new method('tooltip', {
            init: function (element) {
                var context = this;
                var promise = null;
                var options = context.local._options;

                if (options.value === '') {
                    options.value = element.attr('title') || '';
                }

                element.addClass('works-tooltip-wrapper');

                var $tooltip = $(context.$helper.parseTemplate('tooltip', options));
                $tooltip.appendTo(element);

                context.$helper.bind(element, 'mouseover focus', function(event) {
                    $tooltip.addClass('anim-ready');

                    if(
                        options.direction === 'left' ||
                        options.direction === 'right'
                    ) {
                        $tooltip.css({
                            top: (element.outerHeight() - $tooltip.outerHeight()) / 2,
                            bottom: 'auto'
                        });
                    } else {
                        $tooltip.css({
                            left: (element.outerWidth() - $tooltip.outerWidth()) / 2,
                            right: 'auto'
                        });
                    }

                    context.$helper.invoke(promise);
                    promise = context.$helper.promise(function() {
                        $tooltip.addClass('anim-start');
                    }, 25);
                });

                context.$helper.bind(element, 'mouseout blur', function(event) {
                    $tooltip.removeClass('anim-start');
                    context.$helper.invoke(promise);
                    promise = context.$helper.promise(function() {
                        $tooltip.removeClass('anim-ready');
                    }, 25);
                });
            },
            template: {
                tooltip: '<div class="works-tooltip works-tooltip-{direction}">{value}<span class="works-tooltip-arrow"></span></div>'
            },
            options: {
                value: '',
                margin: 20,
                direction: 'left'
            }
        });
    }(jQuery));
});