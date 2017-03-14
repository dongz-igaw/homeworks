'use strict';

define(['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('toggle', {
            init: function init(element) {
                var context = this;
                var options = context.local._options;
                var idx = 0;
                var name = element.attr('name') || '';
                var type = element.attr('type') || 'chekcbox';

                var $toggle = $(context.$helper.parseTemplate('toggle'));
                if (element.closest('label').length < 1) {
                    element.wrap('<label></label>');
                }

                var regex = /input-(\w+)/gi;
                if (typeof element.attr('class') !== 'undefined' && element.attr('class').match(regex)) {
                    var matches = [];
                    var match = null;
                    var className = element.attr('class');

                    /* jshint ignore:start */
                    /* @DATE 2016. 12. 16 */
                    /* @USER Kenneth */
                    /* @NOTE Condition expression escaping. */
                    while (match = regex.exec(className)) {
                        matches.push(match[1]);
                    }
                    /* jshint ignore:end */

                    for (idx in matches) {
                        var word = matches[idx];
                        $toggle.addClass('works-' + word);
                    }
                }

                $toggle.find('.switch .switch-ball').ripple({
                    theme: 'dark',
                    over: true,
                    passive: true
                });
                $toggle.insertAfter(element);

                element.prependTo($toggle.find('.toggle'));

                context.$helper.bind($toggle.find('.toggle'), 'click', function (event) {
                    if (typeof event.namespace === 'undefined' && element.prop('checked') === true && element.attr('type') === 'radio') {
                        event.preventDefault();
                        element.prop('checked', false).triggerHandler('change');
                    }
                });

                context.$helper.bind(element, 'change', function (event, extra) {
                    context.$helper.triggerHandler(element, 'update');

                    if (typeof extra !== 'undefined' && typeof extra.init !== 'undefined' && extra.init === true) {
                        $toggle.find('.switch .switch-ball').ripple('start');
                    }
                }, true);

                context.$helper.bind(element, 'update', function (event, extra) {
                    if (element.prop('checked') === false) {
                        $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-left').addClass('toggle-label-active');
                    } else {
                        $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-right').addClass('toggle-label-active');
                    }

                    if (typeof extra !== 'undefined') {
                        $.extend(options, extra);
                    }

                    var placeholder_class = ['toggle-label-left', 'toggle-label-right'];
                    var placeholder_default = ['Off', 'On'];
                    for (idx in placeholder_class) {
                        if (typeof options.placeholder !== 'undefined' && options.placeholder !== null && typeof options.placeholder[idx] !== 'undefined' && options.placeholder[idx] !== '') {
                            $toggle.find('.' + placeholder_class[idx]).text(options.placeholder[idx]);
                        } else {
                            $toggle.find('.' + placeholder_class[idx]).text(placeholder_default[idx]);
                        }
                    }
                }, true);

                if (element.prop('checked') === false) {
                    $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-left').addClass('toggle-label-active');
                } else {
                    $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-right').addClass('toggle-label-active');
                }

                context.$helper.bind($toggle.find('input'), 'click', function (event) {
                    event.stopPropagation();
                });

                element.hide();
            },
            template: {
                toggle: '<span class="toggle-wrapper"><span class="toggle-label toggle-label-left">Off</span><label class="toggle"><span class="switch"><span class="switch-ball"></span><span class="switch-bg"></span></span></label><span class="toggle-label toggle-label-right">On</span></span>'
            },
            options: {
                placeholder: null
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
