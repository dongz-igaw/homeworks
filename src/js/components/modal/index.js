//==========================================================
//
// @ HOMEWORKS COMPONENT MODAL
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-01-13
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/modal.html
//
//=========================================================

(function($) {
    new ComponentMethod('modal, popup', {
        init: function (element) {
            var context = this;
            var $btn = element.find('.modal-footer .btn');

            this.local._visible = false;

            if (element.hasClass('modal-full') === false) {
                this.$helper.bind(this.element.$window, 'resize update', function (event) {
                    element.css({
                        left: 0,
                        top: 0
                    });

                    element.css({
                        left: '50%',
                        top: '50%',
                        marginLeft: -element.outerWidth() / 2,
                        marginTop: -element.outerHeight() / 2
                    });
                }, true);
            } else {
                if (element.children('.modal-inner').children('.modal-scroller').length < 1) {
                    var $scoller = $('<div class="modal-scroller"></div>');
                    $scoller.append(element.children('.modal-inner').children());
                    $scoller.appendTo(element.children('.modal-inner'));
                }

                this.$helper.bind(this.element.$window, 'resize update', function (event) {
                    element.find('> .modal-inner > .modal-scroller').css({
                        maxWidth: context.element.$window.outerWidth(),
                        maxHeight: context.element.$window.outerHeight()
                    });
                }, true);
            }

            this.$helper.unbind($btn.add(element.find('.btn-close')), 'click');

            this.$helper.bind($btn.add(element.find('.btn-close')), 'click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var $this = $(this);
                context.local._prototype.close.call(context, element);
            });

            this.$helper.bind($btn.filter('.btn-submit'), 'click', function (event) {
                event.stopPropagation();
                element.triggerHandler('modal.submit');
            });

            this.$helper.bind(element.find('.btn-close'), 'click', function (event) {
                event.stopPropagation();
                element.triggerHandler('modal.cancel');
            });

            $btn.ripple();
        },
        method: {
            update: function () {
                var context = this;
                context.$helper.triggerHandler(_this.element.$window, 'update');
            },
            toggle: function (element) {
                var context = this;
                if (context.local._visible === true) {
                    context.local._prototype.close.call(context, element);
                } else {
                    context.local._prototype.open.call(context, element);
                }
            },
            show: function (element) {
                var context = this;
                context.local._prototype.open.call(context, element);
            },
            hide: function (element) {
                var context = this;
                context.local._prototype.close.call(context, element);
            },
            open: function (element) {
                var context = this;

                context.local._visible = true;

                /*
                var $body = $('body:first');
                var $parent = element.parent();
                
                if ($parent.is($body) === false) {
                    element.appendTo($body);
                }
                */

                element.siblings('.' + element.attr('class').split(' ').join('.')).remove();

                if (context.local._options.animation === true) {
                    element.siblings(':visible').not('.modal').addClass('modal-opener');
                }

                if (element.hasClass('modal-full')) {
                    element.css({ display: 'table' });
                } else {
                    element.show();
                }

                context.$helper.bind(element, 'click', function (event) {
                    event.stopPropagation();
                });

                var $overlay = $('.modal-overlay');
                if ($overlay.length < 1) {
                    $overlay = $(context.$helper.parseTemplate('overlay'));
                }

                $overlay.insertAfter(element);
                $overlay.show();

                context.$helper.triggerHandler(context.element.$window, 'update');
                element.triggerHandler('modal.open');

                context.$helper.promise(function () {
                    element.addClass('anim-start');
                    $overlay.css('opacity', 0.6);
                    context.$helper.triggerHandler(context.element.$window, 'update');
                }, 25);

                context.$helper.bind($overlay, 'click', function (event) {
                    context.local._prototype.close.call(context, element);
                });
            },
            close: function (element) {
                var context = this;

                context.local._visible = false;

                if (context.local._options.animation === true) {
                    $('.modal-opener').removeClass('modal-opener');
                }

                element.removeClass('anim-start');
                element.hide();
                element.triggerHandler('modal.close');

                var $overlay = $('.modal-overlay');
                $overlay.css('opacity', 0);

                context.$helper.promise(function () {
                    $overlay.hide();
                }, 300);

                context.$helper.unbind(element, 'click');
                context.$helper.unbind($overlay, 'click');
            }
        },
        template: {
            overlay: '<div class="modal-overlay"></div>'
        },
        options: {
            animation: false
        }
    });
}(jQuery));
