//==========================================================
//
// @ HOMEWORKS COMPONENT TOOLTIP
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-01-13                          
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/tooltip.html
//
//=========================================================

(function($) {
	new ComponentMethod('tooltip', {
        init: function (e, o) {
            var _this = this;
            var _opt = {
                type: 'toggle',
                margin: 20,
                direction: 'left'
            };
            $.extend(_opt, o);
            e.each(function () {
                var $this = $(this);
                if ($this.data('title') === '') {
                    $this.data('title', $this.attr('title') || '');
                }
                if (_opt.type === null || _opt.type === '' || $.inArray(_opt.type, _this.data.global.supportThemes) === -1) {
                    //_this.data.i.type = _this.data.g.supportTypes[0];
                    _opt.type = 'show';
                }
                var $tooltip = $(_this.$helper.parseTemplate('tooltip', {
                    content: $this.data('title')
                }));
                if ($this.data('header') !== '') {
                    $tooltip.find('.works-tooltip-header').remove();
                }
                var pos = {
                    top: $this.offset().top,
                    left: $this.offset().left
                };

                $tooltip.appendTo('body');

                if (_opt.direction === 'left') {
                    pos.left -= ($tooltip.outerWidth() + _opt.margin);
                } else if (_opt.direction === 'top') {
                    pos.top -= ($tooltip.outerHeight() + _opt.margin);
                } else if (_opt.direction === 'right') {
                    pos.left += ($this.width() + _opt.margin);
                } else if (_opt.direction === 'bottom') {
                    pos.top += ($this.height() + _opt.margin);
                }

                $tooltip.css({
                    left: pos.left,
                    top: pos.top
                });

                if (_opt.type === 'show' || _opt.type === 'queue') {
                    // Write some codes here.
                }
            });
        },
        method: {
            show: function() {
                $tooltip.addClass('active');
                _this.$helper.promise(function () {
                    $tooltip.addClass('animate-in');
                }, 25);
            },
            queue: function () {

            }
        },
        template: {
            tooltip: '<div class="works-tooltip"><div class="works-tooltip-header">{title}</div><div class="works-tooltip-body">{content}</div><span class="works-tooltip-arrow"></span></div>'
        },
        options: {
            supportTypes: ['toogle', 'show', 'hide']
        }
    });
}(jQuery));