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
    Function.prototype.hook = function (n, args) {
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
                i: {
                    _init: false
                },
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
                if (typeof data === 'undefined') {
                    _this.data.$helper.log("'" + n + "' 이름의 템플릿이 확인되지 않습니다.");
                    return false;
                }
                return data.getFormat(map);
            };

            this.bind = function (e, t, c, i) {
                try {
                    var f = t.toString().split(' ');
                    for (var n in f) f[n] = f[n] + '.' + _this.data.framework + '.' + _this.data.id;
                    f = f.join(' ');
                    e.bind(f, c);
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
                var f = (t.toString().split(' '))[0];
                e.triggerHandler(f + '.' + _this.data.framework + '.' + _this.data.id);
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
                var self = this;
                var arg = [];
                if (arguments.length > 0) {
                    $.map(arguments, function (d, i) {
                        arg.push(d);
                    });
                }

                var f = function () {
                    if (typeof this === 'object') {
                        if (typeof this.data === 'undefined') {
                            this.data = {};
                        }

                        if (typeof this.data[_this.data.id] === 'undefined') {
                            this.data[_this.data.id] = {};
                            $.extend(this.data[_this.data.id], _this.method);
                            _this.data.i = this.data[_this.data.id];
                        }
                    }

                    if (arg.length === 0 || typeof arg[0] === 'object') {
                        if (typeof arg[0] === 'object') {
                            _this.data.i = this.data[_this.data.id];
                            $.extend(_this.data.i, arg[0]);
                            this.data[_this.data.id] = _this.data.i;
                        }

                        if (typeof this.data[_this.data.id]._init === 'undefined' || this.data[_this.data.id]._init === false) {
                            this.data[_this.data.id]._init = true;
                            _this.data.i = this.data[_this.data.id];
                            return _this.init.apply(_this, [$(this)].concat(Array.prototype.slice.call(arg)));
                        } else {
                            return _this;
                        }
                    } else if (typeof arg[0] === 'string') {
                        try {
                            if (typeof this.data[_this.data.id]._init === 'undefined' || this.data[_this.data.id]._init === false) {
                                this.data[_this.data.id]._init = true;
                                _this.data.i = this.data[_this.data.id];
                                if (typeof _this.method.init !== 'undefined') {
                                    _this.method.init.apply(_this, [$(this)].concat(Array.prototype.slice.call(arg)));
                                } else {
                                    _this.init.apply(_this, [$(this)].concat(Array.prototype.slice.call(arg)));
                                }
                            }
                            return _this.method[arg[0]].apply(_this, [$(this)].concat(Array.prototype.slice.call(arg, 1)));
                        } catch (e) {
                            console.warn(e);
                        }
                    } else {
                        _this.data.$helper.log('파라미터 유효성 경고');
                    }
                };

                if (arg.length > 0 && self == _this.data.o.$w[0]) {
                    _this.method.init.apply(_this, Array.prototype.slice.call(arg));
                } else {
                    self.each(f);
                }
            };

            if (typeof s.options !== 'undefined' && s.options !== null) {
                if (typeof _os[p] === 'undefined') {
                    _os[p] = s.options;
                }
            }

            if (typeof this.data === 'undefined') {
                this.data = (new ObjectData(this, p.replace(/[^\w]/gi, ''))).preference;
            }

            if (this.data._bind === false) {
                this.data._bind = true;
                p = p.split(',');
                for (var idx in p) {
                    var id = $.trim(p[idx]);
                    $.fn[id] = this.route;
                    window[id] = this.route;
                }
            }
        }

        /*******************************
         * NOTE - OOP 플러그인 정의시작
         *******************************/

        // HomeWorks - Modal Component
        _ws.modal = new ObjectMethod('modal, popup', {
            init: function (e, o) {
                var _this = this;
                var $c = e.find('.btn-close');
                this.data._visible = false;

                if (!e.hasClass('modal-full')) {
                    this.data.$helper.bind(this.data.o.$w, 'resize', function () {
                        e.css({
                            left: (_this.data.o.$w.width() - e.width()) / 2,
                            top: (_this.data.o.$w.height() - e.height()) / 2
                        });
                    }, true);
                }

                this.data.$helper.bind($c, 'click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $this = $(this);
                    e[0].data[_this.data.id].close.call(_this, e);
                });

                $c.ripple();
            },
            method: {
                toggle: function (e) {
                    console.log(e[0].data[this.data.id]);
                    if (this.data._visible === true) {
                        e[0].data[this.data.id].close.call(this, e);
                    } else {
                        e[0].data[this.data.id].open.call(this, e);
                    }
                },
                open: function (e) {
                    if (e.hasClass('modal-full')) {
                        e.css({display : 'table'});
                    } else {
                        e.show();
                    }
                    e.triggerHandler('modal.open');
                    this.data._visible = true;
                },
                close: function (e) {
                    e.hide();
                    e.triggerHandler('modal.close');
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
                return e.each(function () {
                    var e = $(this);
                    e.addClass('btn-ripple');

                    if ($.inArray(_this.data.i.theme, _this.data.g.supportThemes) != -1) {
                        e.addClass('btn-ripple-' + _this.data.i.theme);
                    }

                    _this.data.$helper.bind(e, 'click', function (event) {
                        var $this = $(this);
                        if (!$this.hasClass('.btn-ripple')) {
                            e.addClass('btn-ripple');
                            if ($.inArray(e[0].data[_this.data.id].theme, _this.data.g.supportThemes) != -1) {
                                e.addClass('btn-ripple-' + e[0].data[_this.data.id].theme);
                            }
                        }
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
                e.each(function () {
                    var $this = $(this);
                    if ($this.data('title') === '') {
                        $this.data('title', $this.attr('title') || '');
                    }
                    if (_opt.type === null || _opt.type === '' || $.inArray(_opt.type, _this.data.g.supportThemes) === -1) {
                        //_this.data.i.type = _this.data.g.supportTypes[0];
                        _opt.type = 'show';
                    }
                    var $tooltip = $(_this.data.$helper.parseTemplate('tooltip', {
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

                    if (_opt.direction == 'left') {
                        pos.left -= ($tooltip.outerWidth() + _opt.margin);
                    } else if (_opt.direction == 'top') {
                        pos.top -= ($tooltip.outerHeight() + _opt.margin);
                    } else if (_opt.direction == 'right') {
                        pos.left += ($this.width() + _opt.margin);
                    } else if (_opt.direction == 'bottom') {
                        pos.top += ($this.height() + _opt.margin);
                    }

                    $tooltip.css({
                        left: pos.left,
                        top: pos.top
                    });

                    if (_opt.type == 'show' || _opt.type == 'queue') {

                        
                    }
                });
            },
            method: {
                show: function() {
                    $tooltip.addClass('active');
                    _this.data.$helper.promise(function () {
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

        _ws.input = new ObjectMethod('input', {
            init: function (e, o) {
                var _this = this;
                var preventKeyCode = [37, 38, 39, 40, 9, 13, 17, 46];
                var ctrlLock = false;
                var ctrlTimer = null;
                e.each(function () {
                    var e = $(this);
                    if (e.hasClass('input-number')) {
                        _this.data.$helper.bind(e, 'keydown keyup', function (event) {
                            setTimeout(function () {
                                if (event.type == 'keyup' && event.keyCode == 17) {
                                    ctrlLock = true;
                                    try {
                                        clearTimeout(ctrlTimer);
                                    } catch (e) {}
                                    setTimeout(function () {
                                        ctrlLock = false;
                                    }, 150);
                                }

                                if ($.inArray(event.keyCode, preventKeyCode) == -1 && (typeof event.ctrlKey === 'undefined' || event.ctrlKey === false) && ctrlLock === false) {
                                    var selectPosition = 0;
                                    var oldLength = e[0].value.length;
                                    if (e[0].selectionStart || e[0].selectionStart == '0') {
                                        selectPosition = e[0].selectionStart;
                                    } else {
                                        var ran = document.selection.createRange();
                                        ran.moveStart('character', -e[0].value.length);
                                        selectPosition = ran.text.length;
                                    }

                                    var val = e.val();
                                    if (typeof val !== 'undefined' && val !== null) {
                                        val = (val.toString().split('.'))[0];
                                    }
                                    val = val.toString().replace(/[^\d]*/gi, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                                    e.val(val);

                                    var diffLength = Math.max(0, val.length - oldLength);
                                    selectPosition += diffLength;
                                    if (e[0].selectionStart || e[0].selectionStart == '0') {
                                        e[0].setSelectionRange(selectPosition, selectPosition);
                                    } else if (e[0].createTextRange != 'undefined') {
                                        var cursor = e[0].createTextRange();
                                        cursor.move('character', selectPosition);
                                        cursor.select();
                                    }

                                    if (!event.isTrigger) {
                                        e.triggerHandler('change');
                                    }
                                }
                            }, 25);
                        }, true);
                    } else if (e.hasClass('input-datetime')) {
                    } else if (e.hasClass('input-decimal')) {
                    }
                });
            }
        });

        _ws.toast = new ObjectMethod('toast', {
            init: function (e, o) {
            },
            method: {
                init: function (msg) {
                    var _this = this;

                    if (typeof msg === 'undefined') {
                        return false;
                    } else if (typeof msg === 'object') {
                        msg = JSON.stringify(msg);
                    }

                    var $toastBox = $('.toast-box');
                    if ($toastBox.length <= 0) {
                        $toastBox = $(_this.data.$helper.parseTemplate('toastBox'));
                        $toastBox.appendTo('body');
                        $toastBox.css({
                            marginLeft: -$toastBox.width() / 2
                        });
                    }

                    var $toast = $(_this.data.$helper.parseTemplate('toast', {
                        msg: msg
                    }));
                    var $real = $($toast.clone()).add('<br />');
                    $toast.addClass('toast-empty');
                    $toast.appendTo('.toast-box');
                    $real.addClass('toast-real');
                    var height = $toast.height();
                    $toast.addClass('toast-anim');
                    setTimeout(function () {
                        $toast.addClass('toast-anim-start').stop().animate({
                            paddingTop: '1em',
                            paddingBottom: '1em',
                            marginBottom: '1em',
                        }, 300, 'easeInOutQuad');
                        $toast.height(height);
                        setTimeout(function () {
                            $toast.remove();
                            $real.appendTo('.toast-box');
                            setTimeout(function () {
                                $real.addClass('toast-anim-start');
                                var t = Math.min(Math.max(1000 / 20 * msg.length, 1500), 5000);
                                setTimeout(function () {
                                    $real.removeClass('toast-anim-start');
                                    setTimeout(function () {
                                        $real.remove();
                                    }, 300);
                                }, t);
                            }, 25);
                        }, 300);
                    }, 25);
                }
            },
            template: {
                toast: '<div class="toast">{msg}</div>',
                toastBox: '<div class="toast-box"></div>'
            }
        });

        _ws.fileupload = new ObjectMethod('fileupload', {
            init: function (e, o) {
                var _this = this;
                $(e).bind('change', function() {
                    var $this = $(this);
                    if ($this.val() !== '') {
                        _this.method.upload.apply(_this, [].concat($this, o, Array.prototype.slice.call(arguments, 2)));
                    }
                });
            },
            method: {
                upload: function (e, o) {
                    var _this = this;
                    var file = e[0].files[0];
                    var info = {
                        name: file.name,
                        size: file.size,
                        type: (file.type.split('/'))[(file.type.split('/')).length - 1],
                        exts: (file.name.split('.'))[(file.name.split('.')).length - 1],
                    };
                    var exts = {
                        txt: ['TXT', 'LOG'],
                        img: ['JPEG', 'JPG', 'JPE', 'PJPEG', 'PNG', 'GIF', 'BMP', 'RAW'],
                        doc: ['DOC', 'DOCX', 'PPT', 'PPTX', 'HWP', 'XLS', 'XLSX', 'PDF', 'CSV'],
                        flag: {
                            txt: 'T',
                            img: 'I',
                            doc: 'D',
                            spread: 'S'
                        }
                    };
                    if (typeof o !== 'undefined' && typeof o.type !== 'undefined' && o.type !== null) {
                        if ($.inArray(o.type, Object.keys(exts)) != -1) {
                            if ($.inArray(info.type.toUpperCase(), exts[o.type]) != -1) {
                                if($.inArray(info.exts.toUpperCase(), exts[o.type]) != -1) {
                                    var form = new FormData();
                                    form.append('file', file, file.name);
                                    if (typeof o.type !== 'undefined' && o.type !== null) {
                                        form.append('type', exts.flag[o.type]);
                                    }
                                    if (typeof o.data !== 'undefined') {
                                        for (var idx in o.data) {
                                            form.append(idx, o.data[idx]);
                                        }
                                    }
                                    e.siblings('.btn').text('업로드 중').addClass('btn-default').removeClass('btn-success btn-danger');
                                    $.ajax({
                                        url: o.url,
                                        data: form,
                                        type: 'POST',
                                        contentType: false,
                                        processData: false,
                                        mimeType: 'multipart/form-data',
                                        dataType: 'json',
                                        timeout: 30000,
                                        complete: o.complete,
                                        success: function (d, s, x) {
                                            if (d.code == 200) {
                                                var data = d.data;
                                                e.val('');
                                                if (o.type == 'img') {
                                                    e.siblings('.btn, img').remove();
                                                    e.before('<img src="' + data.data + '" />');
                                                } else {
                                                    e.siblings('.btn').text('완료').removeClass('btn-default btn-danger').addClass('btn-success');
                                                }
                                                e.data('value', d.data);
                                                if (typeof o.success === 'function') {
                                                    o.success.apply(this, Array.prototype.slice.call(arguments));
                                                }
                                            } else {
                                                if (typeof d.data.msg !== 'undefined') {
                                                    alert(d.data.msg);
                                                }
                                            }
                                        },
                                        error: function (x, s, e) {
                                            alert('업로드 요청 도중 에러가 발생했습니다.\r\n잠시 후 다시 시도해주세요.');
                                            e.siblings('.btn').text('에러').removeClass('btn-default btn-success').addClass('btn-danger');
                                            if (typeof o.error === 'function') {
                                                o.error.apply(this, Array.prototype.slice.call(arguments));
                                            }
                                        }
                                    });
                                } else {
                                    alert('.' + info.exts + '은 업로드를 지원하는 확장자가 아닙니다.');
                                }
                            } else {
                                alert('.' + info.exts + '은 업로드를 지원하는 확장자가 아닙니다.');
                            }
                        } else {
                            alert(o.type + '은 허용하는 확장자 옵션 정의가 아닙니다.');
                        }
                    } else {
                    }
                }
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
        }).hook('ripple');

        (function ($e, a) {
            var $document = $(document);
            var $wrapper = $('.works-wrapper');
            var $sider = $('.works-sider');
            $sider.bind('click', function (event) {
                event.stopPropagation();
            });
            this.bind('click', function (event) {
                event.stopPropagation();
                var $this = $(this);
                if ($sider.hasClass('works-sider-active')) {
                    $sider.removeClass('works-sider-active');
                    $wrapper.removeClass('works-sider-active');
                    $document.unbind('click.worksMenuHandler');
                } else {
                    $sider.addClass('works-sider-active');
                    $wrapper.addClass('works-sider-active');
                    $document.unbind('click.worksMenuHandler').bind('click.worksMenuHandler', function (event) {
                        event.preventDefault();
                        $sider.removeClass('works-sider-active');
                        $wrapper.removeClass('works-sider-active');
                        $document.unbind('click.worksMenuHandler');
                    });
                }
            });
        }).hook('menu');

        // 모달 관련 설정
        (function ($e) {
            this.bind('click', function (event) {
                event.preventDefault();
                $e.modal('toggle');
            });
        }).hook('modal');

        // 툴팁 관련 설정
        (function ($e, f) {
            this.tooltip({
                type: f
            });
        }).hook('tooltip');
    });
}());