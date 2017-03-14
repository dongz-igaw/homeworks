'use strict';

define(['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('tab, step', {
            init: function init(element) {
                var context = this;
                var _index = 0;
                var _length = 0;
                var $container = element.next();
                var id = context.local._id;

                _length = element.find('.' + id + '-item').length;
                if (element.hasClass(id) && $container.length > 0 && $container.hasClass(id + '-container')) {
                    element.unbind(id + '.next').bind(id + '.next', function () {
                        if (_index + 1 <= _length) {
                            context.$helper.triggerHandler(element.find('.' + id + '-item').eq(_index + 1), 'click');
                        } else {
                            return false;
                        }
                    });

                    element.unbind(id + '.prev').bind(id + '.prev', function () {
                        if (_index - 1 >= 0) {
                            context.$helper.triggerHandler(element.find('.' + id + '-item').eq(_index - 1), 'click');
                        } else {
                            return false;
                        }
                    });

                    element.unbind(id + '.move').bind(id + '.move', function (event, index) {
                        context.$helper.triggerHandler(element.find('.' + id + '-item').eq(index), 'click');
                    });

                    context.$helper.bind(element.find('.' + id + '-item'), 'click', function (event) {
                        event.preventDefault();
                        var $this = $(this);
                        var index = $this.index();
                        _index = index;
                        $this.addClass('active').siblings('.active').removeClass('active');
                        $container.find('.' + id + '-container-item').eq(index).addClass('active').siblings('.active').removeClass('active');

                        element.triggerHandler(id + '.move', {
                            index: _index,
                            length: _length,
                            header: element.find('.' + id + '-item')
                        });
                    });
                    context.$helper.triggerHandler(element.find('.' + id + '-item').eq(_index), 'click');
                } else {
                    context.$helper.log('Set <div class="' + id + '-container"></div> elements after <' + id + '> element for enable ' + id + ' component.');
                }
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
