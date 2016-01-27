﻿/*-----------------------------------------------------------
 * [homeworks.js]
 *
 * @ AddDate 2016-01-19
 * @ UpDate  2016-01-19
 * 
 * @ Note    [HomeWorks Frameworks Helper]
 ----------------------------------------------------------*/

(function () {
    var _ws = {}; // Works standard global variables.
    var _ps = {}; // Promise standard global variables.
    var _os = {}; // Plugin option standard global variables.
    /*******************************
     * NOTE - 스트링 내부 포매터 지시자 교체
     * DATE - 2016-01-19
     *******************************/
    String.prototype.getFormat = function (o) {
        var s = this;
        for (var i in o) {
            var v = o[i];
            i = i.replace(/\\/gi, '\\\\')
                 .replace(/-/gi, '\\-');
            var reg = new RegExp("{" + i + "}", "gi");
            s = s.replace(reg, v);
        }
        return s.toString();
    };

    /*******************************
     * NOTE - data-{컴포넌트}에 안전한 바인딩을 위한 함수
     * DATE - 2016-01-19
     *******************************/
    Function.prototype.bind = function (n, args) {
        try {
            var format = '[data-{data-name}]';
            var _this = this;
            $(format.getFormat({
                'data-name': n
            })).each(function () {
                var $this = $(this);
                var t = $this.data('pen');
                var p = $this.data(n);
                if (p === false) return true;
                if (typeof _this === 'function') {
                    if (typeof t === 'undefined') {
                        _this.call($this, null,  p, args);
                    } else {
                        _this.call($this, $(t), p, args);
                    }
                }
            });
        } catch (e) {
            console.warn(e);
        }
    };


    /*******************************
     * NOTE - HomeWorks 플러그인 정의부
     * DATE - 2016-01-19
     *******************************/
    (function ($) {
        function ObjectData(t, id) {
            /*******************************
             * NOTE - OOP 플러그인 자료부
             *******************************/

            this.preference = {
                $self: this,
                $super: t,
                $helper: null,
                _anim: false,
                _bind: false,
                _debug: true,
                _init: false,
                anim: {
                    time: 300,
                    effect: 'swing'
                },
                framework: 'homeworks',
                prefix: 'works',
                id: '',
                o: {
                    $w: $(window),
                    $d: $(document)
                },
                p: {},
                i: {},
                g: {}
            };
            this.preference.id = id;
            this.preference.g = _os[id];
            this.preference.$helper = new ObjectHelper(t);
        }

        function ObjectHelper(t) {
            /*******************************
             * NOTE - OOP 플러그인 공통 메소드부
             *******************************/
            var _this = t;

            this.promise = function (n, c, t) {
                if (typeof n === 'function' && typeof c === 'number') {
                    t = c;
                    c = n;
                    n = _this.data.id;
                }
                _ps[_this.data.framework + '.' + n] = setTimeout(function () {
                    try {
                        delete _ps[_this.data.framework + '.' + n];
                    } catch (e) {
                        _this.data.$helper.log(e);
                    }
                    if (typeof c === 'function') {
                        c();
                    }
                }, t);
                return _ps;
            };

            this.invoke = function (n) {
                if (typeof _ps[_this.data.framework + '.' + n] !== 'undefined') {
                    try {
                        clearTimeout(_ps[_this.data.framework + '.' + n]);
                        delete _ps[_this.data.framework + '.' + n];
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            };

            this.log = function (m, c) {
                if (_this.data._debug === true) {
                    var t = m;
                    if (typeof c !== 'undefined' && c !== null) {
                        t = '[' + c + '] ' + t;
                    }
                    console.warn(t);
                }
            };

            this.parseTemplate = function (n, map) {
                var data = _this.template[n];
                console.log(map);
                return data.getFormat(map);
            };

            this.bind = function (e, t, c, i) {
                try {
                    e.bind(t + '.' + _this.data.framework + '.' + _this.data.id, c);
                    if (typeof i !== 'undefined' && i === true) {
                        this.triggerHandler(e, t);
                    }
                } catch (exception) {
                    _this.data.$helper.log(e);
                }
            };

            this.unbind = function (e, t) {
                e.unbind(t + '.' + _this.data.framework + '.' + _this.data.id);
            };

            this.trigger = function (e, t) {
                e.trigger(t + '.' + _this.data.framework + '.' + _this.data.id);
            };

            this.triggerHandler = function (e, t) {
                e.triggerHandler(t + '.' + _this.data.framework + '.' + _this.data.id);
            };
        }

        function ObjectMethod(p, s) {
            /*******************************
             * NOTE - OOP 플러그인 구조부
             *******************************/
            var _this = this;
            this.init = s.init;
            this.method = {
                init: this.init
            };
            this.template = {
            };
            $.extend(this.method, s.method);
            $.extend(this.template, s.template);

            this.route = function () {
                if (arguments.length === 0 || typeof arguments[0] === 'object') {
                    if (typeof arguments[0] === 'object') {
                        $.extend(_this.data.i, arguments[0]);
                    }
                    _this.data._init = true;
                    _this.init.apply(_this, [this].concat(Array.prototype.slice.call(arguments)));
                } else if (typeof arguments[0] === 'string') {
                    try {
                        if (_this.data._init === false) {
                            _this.data._init = true;
                            _this.method.init.apply(_this, [this].concat(Array.prototype.slice.call(arguments)));
                        }
                        _this.method[arguments[0]].apply(_this, [this].concat(Array.prototype.slice.call(arguments, 1)));
                    } catch (e) {
                        console.warn(e);
                    }
                } else {
                    _this.data.$helper.log('파라미터 유효성 경고');
                }
            };

            if (typeof s.options !== 'undefined' && s.options !== null) {
                if (typeof _os[p] === 'undefined') {
                    _os[p] = s.options;
                }
            }

            if (typeof this.data === 'undefined') {
                this.data = (new ObjectData(this, p)).preference;
            }

            if (this.data._bind === false) {
                this.data._bind = true;
                $.fn[this.data.id] = this.route;
            }
        }

        /*******************************
         * NOTE - OOP 플러그인 정의시작
         *******************************/

        // HomeWorks - Modal Component
        _ws.modal = new ObjectMethod('modal', {
            init: function (e, o) {
                var _this = this;
                var $c = e.find('.' + this.data.prefix + '-close');
                this.data._visible = false;
                this.data.$helper.bind(this.data.o.$w, 'resize', function () {
                    e.css({
                        left: (_this.data.o.$w.width() - e.width()) / 2,
                        top: (_this.data.o.$w.height() - e.height()) / 2
                    });
                }, true);

                this.data.$helper.bind($c, 'click', function (event) {
                    event.preventDefault();
                    var $this = $(this);
                    e[_this.data.id]('close');
                });

                $c.ripple();
            },
            method: {
                toggle: function (e) {
                    if (this.data._visible === true) {
                        e[this.data.id]('close');
                    } else {
                        e[this.data.id]('open');
                    }
                },
                open: function (e) {
                    e.show();
                    this.data._visible = true;
                },
                close: function (e) {
                    e.hide();
                    this.data._visible = false;
                }
            },
            template: {
                overlay: '<div class="{framework}-{id}"></div>'
            }
        });

        _ws.ripple = new ObjectMethod('ripple', {
            init: function (e, o) {
                var _this = this;
                e.addClass('btn-ripple');
                
                if ($.inArray(this.data.i.theme, this.data.g.supportThemes) != -1) {
                    e.addClass('btn-ripple-' + this.data.i.theme);
                }

                this.data.$helper.bind(e, 'click', function (event) {
                    var $this = $(this);
                    var $ripple = $(_this.data.$helper.parseTemplate('effect'));
                    var size = Math.min($this.width(), $this.height());
                    var scale = Math.max($this.width(), $this.height()) / size * 2;
                    var point = {
                        x: event.clientX - $this.offset().left - size / 2,
                        y: event.clientY - $this.offset().top - size / 2
                    };
                    $ripple.css({ width: size, height: size, left: point.x, top: point.y });
                    $ripple.appendTo($this);
                    _this.data.$helper.promise(function () {
                        _this.data.$helper.promise(function () {
                            _this.data.$helper.promise(function () {
                                $ripple.remove();
                            }, 500);
                            $ripple.addClass('anim-end').css({ opacity: 0 });
                        }, 150);
                        $ripple.css({ transform: 'scale(' + scale + ')', opacity: 1 });
                    }, 50);
                });
            },
            method: {
            },
            template: {
                effect: '<div class="btn-ripple-effect"></div>'
            },
            options: {
                supportThemes: ['light', 'dark']
            }
        });

        _ws.tooltip = new ObjectMethod('tooltip', {
            init: function (e, o) {
                var _this = this;
                var _opt = {
                    type: 'toggle',
                    margin: 20,
                    direction: 'left'
                };
                $.extend(_opt, o);
                console.log(_opt);
                e.each(function () {
                    var $this = $(this);
                    $this.data('title', $this.attr('title') || '');
                    if (_opt.type === null || _opt.type === '' || $.inArray(_opt.type, _this.data.g.supportThemes) === -1) {
                        //_this.data.i.type = _this.data.g.supportTypes[0];
                        _opt.type = 'show';
                    }

                    if (_opt.type == 'show') {
                        var $tooltip = $(_this.data.$helper.parseTemplate('tooltip', {
                            content: $this.data('title')
                        }));
                        var pos = {
                            top: $this.offset().top,
                            left: $this.offset().left
                        };

                        if (_opt.direction == 'left') {
                            post.left -= $tooltip.width() - _opt.margin;
                        } else if (_opt.direction == 'top') {
                        } else if (_opt.direction == 'right') {
                            post.left += $tooltip.width() - _opt.margin;
                        } else if (_opt.direction == 'bottom') {
                        }

                        $tooltip.appendTo('body');
                    }
                });
            },
            method: {
            },
            template: {
                tooltip: '<div class="works-tooltip"><div class="works-tooltip-header">{title}</div><div class="works-tooltip-body">{content}</div><span class="works-tooltip-arrow"></span></div>'
            },
            options: {
                supportTypes: ['toogle', 'show', 'hide']
            }
        });
    }(jQuery));


    /*******************************
     * NOTE - HomeWorks 플러그인 호출부
     * DATE - 2016-01-19
     *******************************/
    $(function () {
        // 버튼 Material Ripple 설정
        (function ($e, f) {
            this.ripple({
                theme: f
            });
        }).bind('ripple');

        // 프로필 관련 설정
        (function ($e) {
            this.bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                if ($e.hasClass('toggle-active')) {
                    $(document).unbind('click.profileHandler');
                    $e.stop(true, true).fadeOut(300, function () {
                        $(this).removeClass('toggle-active');
                    });
                } else {
                    $e.stop(true, true).fadeIn(300, function () {
                        $(document).unbind('click.profileHandler').bind('click.profileHandler', function () {
                            $(document).unbind('click.profileHandler');
                            $e.stop(true, true).fadeOut(300, function () {
                                $(this).removeClass('toggle-active');
                            });
                        });
                        $(this).addClass('toggle-active');
                    });
                }
            });
        }).bind('profile');

        // 모달 관련 설정
        (function ($e) {
            this.bind('click', function (event) {
                event.preventDefault();
                $e.modal('toggle');
            });
        }).bind('modal');

        // 툴팁 관련 설정
        (function ($e, f) {
            this.tooltip({
                type: f
            });
        }).bind('tooltip');
    });
}());