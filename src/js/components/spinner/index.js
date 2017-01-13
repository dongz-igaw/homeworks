//==========================================================
//
// @ HOMEWORKS COMPONENT SPINNER
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-01-13                          
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/spinner.html
//
//=========================================================

(function($) {
    new ComponentMethod('spinner', {
        init: function (element) {
            var context = this;
            var $selected = element.find(':selected');
            var $spinner = $(context.$helper.parseTemplate('spinner', {
                option: $selected.length > 0 ? $selected.text() : this.global.empty
            }));

            var attrs = element.prop("attributes");
            for (var idx in attrs) {
                var attr = attrs[idx];
                if (attr.name !== 'class' && attr.name !== 'style') {
                    $spinner.attr(attr.name, attr.value);
                }
            }
            element.after($spinner);
            $spinner.ripple({
                theme: 'dark'
            }).css({
                minWidth: element.outerWidth()
            });
            element.hide();

            context.$helper.bind(element, 'focus', function (event) {
                $spinner.focus();
            });

            context.$helper.bind(element, 'change', function (event) {
                context.$helper.triggerHandler(element, 'update');
            });

            context.$helper.bind(element, 'update', function (event) {
                var $this = $(this);
                var $target = $this.find('option:selected');

                if ($target.length < 1) {
                    $target = $this.find('option:first');
                }

                var text = $target.text();

                if (text !== '') {
                    $spinner.find('.spinner-txt').text(text);
                }

                if (element.prop('disabled')) {
                    $spinner.addClass('spinner-disabled');
                }

                if (element.prop('readonly')) {
                    $spinner.addClass('spinner-readonly');
                }

                $spinner.css({
                    minWidth: element.outerWidth()
                });
            });

            context.$helper.bind($spinner, 'click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                context.$helper.triggerHandler(context.element.$document, 'click');
                var $this = $(this);
                if ($this.hasClass('spinner-disabled') || $this.hasClass('spinner-readonly')) {
                    return false;
                }
                var $spinnerWrapper = $(context.$helper.parseTemplate('spinnerWrapper'));
                element.find('option').each(function () {
                    var $this = $(this);
                    var $option = $(context.$helper.parseTemplate('spinnerOptions', {
                        value: $this.val(),
                        option: $this.text(),
                        type: ($this.prop('selected') === true && $this.text() !== '')? 'selected':'default'
                    }));
                    if ($this.prop('selected') === true) {
                        $spinner.find('.spinner-txt').text($this.text());
                    }
                    $option.ripple({
                        theme: 'dark'
                    }).appendTo($spinnerWrapper);
                });
                $spinnerWrapper.appendTo('body').css('position', 'absolute');
                $spinnerWrapper.addClass('anim-start');

                context.$helper.bind(context.element.$window, 'resize', function () {
                    $spinnerWrapper.css({
                        top: $spinner.offset().top,
                        left: $spinner.offset().left + (($spinner.outerWidth() - $spinnerWrapper.outerWidth()) / 2)
                    });
                    if ($spinnerWrapper.offset().top + $spinnerWrapper.outerHeight() > context.element.$window.scrollTop() + context.element.$window.height()) {
                        $spinnerWrapper.children('.spinner-option').each(function () {
                            var $this = $(this);
                            $this.prependTo($spinnerWrapper);
                        });
                        $spinnerWrapper.css({
                            top: $spinner.offset().top + $spinner.outerHeight() - $spinnerWrapper.outerHeight()
                        });
                    }
                }, true);

                context.$helper.bind(context.element.$document, 'click', function () {
                    $spinnerWrapper.removeClass('anim-start');
                    context.$helper.promise(function () {
                        $spinnerWrapper.remove();
                    }, 300);
                    context.$helper.unbind(context.element.$window, 'resize');
                    context.$helper.unbind(context.element.$document, 'click');
                });

                context.$helper.bind($spinnerWrapper.find('.spinner-option'), 'click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $this = $(this);
                    $spinnerWrapper.removeClass('anim-start');
                    context.$helper.promise(function () {
                        $spinnerWrapper.remove();
                    }, 300);
                    element.val($this.data('value'));
                    context.$helper.triggerHandler(element, 'change', true);
                    context.$helper.unbind(context.element.$window, 'resize');
                    context.$helper.unbind(context.element.$document, 'click');
                });
            });
        },
        template: {
            spinner: '<a href="#" class="spinner"><span class="spinner-txt">{option}</span><i class="spinner-arrow pe-7s-angle-down"></i></a>',
            spinnerWrapper: '<div class="spinner-wrapper"></div>',
            spinnerOptions: '<a href="#" class="spinner-option spinner-{type}" data-value="{value}">{option}</a>'
        },
        options: {
            empty: '선택'
        }
    });
}(jQuery));