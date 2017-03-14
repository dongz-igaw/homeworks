'use strict';

define(['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('checkbox', {
            init: function init(element) {
                var context = this;

                var $checkbox = $(context.$helper.parseTemplate('checkbox'));
                var $label = element.closest('label');
                if ($label.length < 1) {
                    element.wrap('<label class="works-checkbox-wrapper"></label>');
                } else {
                    $label.addClass('works-checkbox-wrapper');
                }

                $checkbox.insertAfter(element).ripple({
                    theme: 'dark',
                    over: true,
                    passive: true
                });

                context.$helper.bind(element.closest('label'), 'click', function (event) {
                    event.stopPropagation();
                });

                context.$helper.bind(element, 'change', function (event, extra) {
                    var $this = $(this);
                    $checkbox.ripple('start');
                    context.$helper.triggerHandler(element, 'update');
                });

                context.$helper.bind(element, 'update', function (event) {
                    var $this = $(this);
                    if ($this.prop('checked') === true) {
                        $checkbox.addClass('works-checkbox-checked');
                    } else {
                        $checkbox.removeClass('works-checkbox-checked');
                    }
                }, true);

                if (typeof element.attr('class') !== 'undefined' && element.attr('class').match(/input-(\w+)/gi)) {
                    var class_names = element.attr('class').match(/input-(\w+)/gi);
                    for (var idx in class_names) {
                        var class_name = class_names[idx];
                        $checkbox.addClass('works-checkbox-' + class_name);
                    }
                }

                element.hide();
            },
            template: {
                checkbox: '<span href="#" class="works-checkbox"></span>'
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
