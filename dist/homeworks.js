/*-----------------------------------------------------------
 * [homeworks.js]
 *
 * @ AddDate 2016-01-19
 * @ UpDate  2016-01-19
 * 
 * @ Note    [HomeWorks Frameworks Helper]
 ----------------------------------------------------------*/

!(function () {
    var _ws = {};
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
        return s;
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
                if (!!$this.data(n) == false) return true;
                if (typeof t === 'undefined') return true;
                var $t = $(t);
                if ($t.length <= 0) return false;
                if (typeof _this == 'function') {
                    _this.call($this, $t, args);
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
        function ObjectData(id) {
            /*******************************
             * NOTE - OOP 플러그인 자료부
             *******************************/

            this.preference = {
                $super: this,
                $helper: null,
                _bind: true,
                _debug: false,
                _init: false,
                framework: 'homeworks',
                id: '',
                o: {
                    w: $(window),
                    d: $(document)
                }
            };
            this.preference.id = id;
            this.preference.$helper = new ObjectHelper(this);
        }

        function ObjectHelper(t) {
            /*******************************
             * NOTE - OOP 플러그인 공통 메소드부
             *******************************/
            var _this = t;

            this.log = function (m, c) {
                if (_this.data._debug == true) {
                    var t = m;
                    if (typeof c !== 'undefined' && c !== null) {
                        t = '[' + c + '] ' + t;
                    }
                    console.warn(t);
                }
            }

            this.parseTemplate = function (data, map) {
                return data.getFormat(map);
            }

            this.bind = function (e, t, c, i) {
                try {
                    e.bind(t + '.' + _this.data.framework + '.' + _this.data.id, c);
                    if (typeof i !== 'undefined' && i == true) {
                        this.triggerHandler(e, t);
                    }
                } catch (e) {
                    console.warn(e);
                }
            }

            this.unbind = function (e, t) {
                e.unbind(t + '.' + _this.data.framework + '.' + _this.data.id);
            }

            this.trigger = function (e, t) {
                e.trigger(t + '.' + _this.data.framework + '.' + _this.data.id);
            }

            this.triggerHandler = function (e, t) {
                e.triggerHandler(t + '.' + _this.data.framework + '.' + _this.data.id);
            }
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
            $.extend(this.method, s.method);

            this.route = function () {
                if (arguments.length == 0 || typeof arguments[0] === 'object') {
                    _this.data._init = true;
                    _this.init.call(_this, this, arguments);
                } else if (typeof arguments[0] === 'string') {
                    try {
                        if (_this.data._init == false) {
                            _this.data._init = true;
                            _this.method.init.call(_this, this, Array.prototype.slice.call(arguments, 1));
                        }
                        _this.method[arguments[0]].call(_this, this, Array.prototype.slice.call(arguments, 1));
                    } catch (e) {
                        console.warn(e);
                    }
                } else {
                    console.warn('파라미터 유효성 경고');
                }
            }

            this.regist = function () {
                $.fn[p] = this.route;
            }

            if(typeof this.data === 'undefined') {
                this.data = (new ObjectData(p)).preference;
            }

            if (this.data._bind == false) {
                $.fn[this.data.id] = this.route;
            }
        }

        /*******************************
         * NOTE - OOP 플러그인 정의시작
         *******************************/

        // HomeWorks - Modal Component
        _ws.modal = new ObjectMethod('modal', {
            init: function (e) {
                this.data._visible = false;
                this.data.$helper.bind(this.data.o.w, 'resize', function () {
                    e.css({
                        left: (this.data.o.w.width() - e.width()) / 2,
                        top: (this.data.o.w.height() - e.height()) / 2
                    });
                });
            },
            method: {
                toggle: function (e) {
                    if (this.data._visible == true) {
                        e.hide();
                    } else {
                        e.show();
                    }
                    this.data._visible = !this.data._visible;
                }
            },
            template: {
                overlay: '<div class="{framework}-{id}"></div>'
            }
        });
    }(jQuery));


    /*******************************
     * NOTE - HomeWorks 플러그인 호출부
     * DATE - 2016-01-19
     *******************************/
    $(function () {
        // 프로필 관련 설정
        (function ($e) {
            this.bind('click', function (event) {
                event.preventDefault();
                $e.stop(true, true).fadeToggle(300, function () {
                    $(this).toggleClass('toggle-active');
                });
            });
        }).bind('profile');

        // 모달 관련 설정
        (function ($e) {
            this.bind('click', function (event) {
                event.preventDefault();
                $e.modal('toggle');
            });
        }).bind('modal');
    });
}());