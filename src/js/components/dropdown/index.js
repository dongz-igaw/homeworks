//==========================================================
//
// @ HOMEWORKS COMPONENT DROPDOWN
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-01-13
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/dropdown.html
//
//=========================================================

(function($) {
	new ComponentMethod('dropdown', {
        init: function (element) {
            var context = this;

            var options = context.local._options;

            var $target = null;

            if (typeof options.target !== 'undefined' && options.target !== null) {
                $target = options.target;
            }

            element.appendTo('body');
            element.hide();

            if($target === null || $target.length < 1) {
                return false;
            }

            element.addHandler($target);
        },
        method: {
            addHandler: function (element, target) {
                var context = this;
                var options = context.local._options;

                element.find('.dropdown-menu').ripple({
                    theme: 'dark'
                });

                context.$helper.bind(element.find('.dropdown-menu'), 'click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    context.local._prototype.removeDropdown.call(context, element, target);
                });

                context.$helper.bind(element.find('.dropdown-menu'), 'mousedown', function (event) {
                    event.stopPropagation();
                });

                context.$helper.bind(context.element.$document, 'mousedown', function (event) {
                    context.local._prototype.removeDropdown.call(context, element, target);
                });

                context.$helper.bind(
                    target.ripple({
                        theme: 'dark'
                    }),
                    'click',
                    function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var $this = $(this);
                        var $scrollParent = $this.scrollParent();

                        if ($this.hasClass('works-dropdown-active')) {
                            context.local._prototype.removeDropdown.call(context, element, $this);
                        } else {
                            $this.addClass('works-dropdown-active');

                            element.show();

                            var leftOffset = 0, topOffset = 0;
                            context.$helper.bind(context.element.$window, 'resize', function (event) {
                                if (options.direction === 'right') {
                                    leftOffset = ($this.outerWidth() - element.outerWidth()) / 2;
                                } else if (options.direction === 'center') {
                                    leftOffset = 0;
                                } else {
                                    leftOffset = -($this.outerWidth() - element.outerHeight()) / 2;
                                }

                                if (options.direction === 'top') {
                                    topOffset = -($this.outerHeight() + 20);
                                } else {
                                    topOffset = $this.outerHeight() + 20;
                                }

                                element.css({
                                    position: 'absolute',
                                    left: $this.offset().left + (($this.outerWidth() - element.outerWidth()) / 2) + leftOffset,
                                    top: $this.offset().top + topOffset
                                });
                            }, true);

                            context.$helper.bind($scrollParent, 'scroll', function (event) {
                                context.$helper.triggerHandler(context.element.$window, 'resize');
                            });

                            context.$helper.promise(function () {
                                element.css('opacity', 1);
                                context.$helper.triggerHandler(context.element.$window, 'resize');
                            }, 25, true);
                        }
                    });

                context.$helper.bind(target, 'mousedown', function (event) {
                    event.stopPropagation();
                });
            },
            removeDropdown: function(element, target) {
                var context = this;

                element.css('opacity', 0);
                target.removeClass('works-dropdown-active');
                context.$helper.promise(function () {
                    element.hide();
                }, 300, true);
                context.$helper.unbind(context.element.$window, 'resize');
            }
        },
        options: {
            direction: 'center',
            target: null
        }
    });
}(jQuery));
