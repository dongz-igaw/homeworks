//==========================================================
//
//       ___           ___           ___           ___           ___           ___           ___           ___           ___     
//      /\__\         /\  \         /\__\         /\  \         /\__\         /\  \         /\  \         /\__\         /\  \    
//     /:/  /        /::\  \       /::|  |       /::\  \       /:/ _/_       /::\  \       /::\  \       /:/  /        /::\  \   
//    /:/__/        /:/\:\  \     /:|:|  |      /:/\:\  \     /:/ /\__\     /:/\:\  \     /:/\:\  \     /:/__/        /:/\ \  \  
//   /::\  \ ___   /:/  \:\  \   /:/|:|__|__   /::\~\:\  \   /:/ /:/ _/_   /:/  \:\  \   /::\~\:\  \   /::\__\____   _\:\~\ \  \ 
//  /:/\:\  /\__\ /:/__/ \:\__\ /:/ |::::\__\ /:/\:\ \:\__\ /:/_/:/ /\__\ /:/__/ \:\__\ /:/\:\ \:\__\ /:/\:::::\__\ /\ \:\ \ \__\
//  \/__\:\/:/  / \:\  \ /:/  / \/__/~~/:/  / \:\~\:\ \/__/ \:\/:/ /:/  / \:\  \ /:/  / \/_|::\/:/  / \/_|:|~~|~    \:\ \:\ \/__/
//       \::/  /   \:\  /:/  /        /:/  /   \:\ \:\__\    \::/_/:/  /   \:\  /:/  /     |:|::/  /     |:|  |      \:\ \:\__\  
//       /:/  /     \:\/:/  /        /:/  /     \:\ \/__/     \:\/:/  /     \:\/:/  /      |:|\/__/      |:|  |       \:\/:/  /  
//      /:/  /       \::/  /        /:/  /       \:\__\        \::/  /       \::/  /       |:|  |        |:|  |        \::/  /   
//      \/__/         \/__/         \/__/         \/__/         \/__/         \/__/         \|__|         \|__|         \/__/    
//
//
//
// @ HOMEWORKS FRAMEWORK
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE  2017-01-13                          
// @ AUTHOR  Kenneth                                      
//
//=========================================================

window.HOMEWORKS_VERSION = '2.0.9.3';
var VERSION = '@@VERSION';
if (VERSION.replace(/@/g, '') !== 'VERSION') {
    window.HOMEWORKS_VERSION = VERSION;
}

var _promiseVariables  = {}; // Promise standard global variables.
var _superVariables   = {}; // Plugin option standard global variables.

/*=================================================
 *= NOTE - String formatter.
 *= DATE - 2016-01-19
 *================================================*/
String.prototype.getFormat = function (options) {
    var string = this;
    for (var idx in options) {
        var value = options[idx];
        idx = idx.replace(/\\/gi, '\\\\')
                 .replace(/-/gi, '\\-');
        var regexp = new RegExp("{" + idx + "}", "gi");
        string = string.replace(regexp, value);
    }
    return string.toString();
};

/*=================================================
 *= NOTE - Component biding feature.
 *= DATE - 2016-01-19
 *================================================*/
Function.prototype.hook = function (name, args) {
    var context = this;

    try {
        jQuery(document).ready(function() {
            var format = '[data-{data-name}]';

            jQuery(format.getFormat({
                'data-name': name
            })).each(function () {
                var element = $(this);
                var target = element.data('pen');
                var plugin = element.data(name);

                if (plugin === false)
                    return true;

                if (typeof context === 'function') {
                    if (typeof target === 'undefined') {
                        context.call(element, null, plugin, args);
                    } else {
                        context.call(element, $(target), plugin, args);
                    }
                }
            });
        });
    } catch (e) {
        console.trace(e.stack);
    }
};

/*=================================================
 *= NOTE - HOMEWORKS Component define region.
 *= DATE - 2016-01-19
 *================================================*/

function ComponentData(context, id) {
    /*=================================================
     *= NOTE - HOMEWORKS Compoent storagy variables region.
     *= DATE - 2016-01-19
     *================================================*/
    if (typeof _superVariables[id] === 'undefined') {
        _superVariables[id] = {};
    }

    this.preference = {
        $self: this,
        $super: context,
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
        element: {
            $window: $(window),
            $document: $(document)
        },
        global: {}
    };

    this.preference.id = id;
    this.preference.global = _superVariables[id];
    this.preference.$helper = new ComponentHelper(context, this.preference);
}

function ComponentHelper(context, data) {
    /*=================================================
     *= NOTE - HOMEWORKS Component shared feature.
     *= DATE - 2016-01-19
     *================================================*/
    var _this = context;

    this.promise = function (name, callback, time, invoke) {
        var self = this;
        if (typeof name === 'function' && typeof callback === 'number') {
            time = callback;
            callback = name;
            name = _this.id;
        }

        if (typeof invoke !== 'undefined' && invoke === true) {
            this.invoke(name);
        }

        _promiseVariables[_this.framework + '.' + name] = setTimeout(function () {
            try {
                delete _promiseVariables[_this.framework + '.' + name];
            } catch (e) {
                self.log(e.stack);
            }

            if (typeof callback === 'function') {
                callback();
            }
        }, time);
        return _promiseVariables;
    };

    this.invoke = function (name) {
        if (typeof name === 'undefined') {
            name = _this.id;
        }
        if (typeof _promiseVariables[_this.framework + '.' + name] !== 'undefined') {
            try {
                clearTimeout(_promiseVariables[_this.framework + '.' + name]);
                delete _promiseVariables[_this.framework + '.' + name];
            } catch (e) {
                self.log(e.stack);
            }
        }
        return true;
    };

    this.log = function (message, code) {
        if (_this._debug === true) {
            var template = message;

            if (typeof message !== 'undefined' && typeof message.stack !== 'undefined') {
                console.error(message.stack);
            } else {
                if (typeof code !== 'undefined' && code !== null) {
                    template = '[' + code + '] ' + template;
                }

                console.error(template);
            }
        }
    };

    this.parseTemplate = function (name, map) {
        var data = _this.template[name];
        if (typeof data === 'undefined') {
            this.log("'" + name + "' 이름의 템플릿이 확인되지 않습니다.");
            return false;
        }
        return data.getFormat(map);
    };

    this.getIdentifier = function () {
        var id = data.id.replace(/,?\s/g, '-');
        var id_arr = id.split('');
        id = [id_arr[0].toUpperCase()].concat(id_arr.splice(1, id.length)).join('');
        return data.framework + id;
    };

    this.bind = function (element, type, callback, initialize) {
        try {
            var forms = type.toString().split(' ');
            for (var name in forms) {
                forms[name] = forms[name] + '.' + this.getIdentifier();
            }

            forms = forms.join(' ');

            element.bind(forms, function (event, value) {
                if (typeof value === 'object') {
                    $.extend(event, value);
                }

                if (typeof callback === 'function') {
                    callback.apply(this, Array.prototype.slice.call(arguments));
                }
            });

            if (typeof initialize !== 'undefined' && initialize === true) {
                this.triggerHandler(element, type);
            }
        } catch (exception) {
            this.log(exception);
        }
    };

    this.unbind = function (element, type) {
        element.unbind(type + '.' + this.getIdentifier());
    };

    this.trigger = function (element, type, value) {
        var forms = (type.toString().split(' '))[0];
        element.trigger(value === true ? forms : (forms + '.' + this.getIdentifier()), value);
    };

    this.triggerHandler = function (element, type, value) {
        var forms = (type.toString().split(' '))[0];
        element.triggerHandler(value === true? forms : (forms + '.' + this.getIdentifier()), value);
    };
}

function ComponentMethod(name, settings) {
    /*=================================================
     *= NOTE - HOMEWORKS Component settings region.
     *= DATE - 2016-01-19
     *================================================*/
    var _this = this;
    var _componentVariables = (new ComponentData(this, name)).preference;
    var _globalVariables = _componentVariables.global;

    if (typeof settings.options !== 'undefined' && settings.options !== null) {
        $.extend(_superVariables[name], settings.options);
    }

    this.init = settings.init;
    this.method = {
        init: this.init
    };
    this.template = {
    };
    this.options = {
    };

    $.extend(this.method, settings.method);
    $.extend(this.template, settings.template);
    $.extend(this.options, settings.options);

    /*=================================================
     *= NOTE - HOMEWORKS ROUTE START
     *= DATE - 2017-01-10
     *================================================*/
    this.route = function (id) {
        var self = this;
        var args = [];
        if (arguments.length > 1) {
            $.map(Array.prototype.slice.call(arguments, 1), function (e, i) {
                args.push(e);
            });
        }

        var ElementBinder = function () {
            var _localVariables = this.data;
            if (typeof this === 'object') {
                if (typeof _localVariables === 'undefined') {
                    _localVariables = {
                        '_id': id,
                        '_init': false,
                        '_prototype': {},
                        '_options': $.extend({}, _this.options)
                    };
                    this.data = _localVariables;
                    $.extend(_localVariables._prototype, _this.method);
                }
            }

            var context = $.extend(this, {
                local: _localVariables,
            }, _componentVariables);

            if (args.length === 0 || typeof args[0] === 'object') {
                // Function(obj) or Function() pattern.
                if (typeof args[0] === 'object') {
                    // Function(obj) pattern.
                    $.extend(_localVariables._options, args[0]);
                }

                if (_localVariables._init === false) {
                    _localVariables._init = true;
                    _this.init.apply(context, [$(this)].concat(Array.prototype.slice.call(args)));
                }
            } else if (typeof args[0] === 'string') {
                // Function(Method Name) pattern.
                try {
                    if (_localVariables._init === false) {
                        _localVariables._init = true;
                        if (typeof _this.method.init !== 'undefined') {
                            _this.method.init.apply(context, [$(this)].concat(Array.prototype.slice.call(args, 1)));
                        } else {
                            _this.init.apply(context, [$(this)].concat(Array.prototype.slice.call(args, 1)));
                        }
                    }
                    return _this.method[args[0]].apply(context, [$(this)].concat(Array.prototype.slice.call(args, 1)));
                } catch (e) {
                    _componentVariables.$helper.log(e.stack);
                }
            } else {
                _componentVariables.$helper.log('Compnent has been got invalid parameters.');
            }
        };

        if (args.length > 0 && self === window) {
            // Global basic function type - Function()
            var _localVariables = this.data;
            if (typeof this === 'object') {
                if (typeof _localVariables === 'undefined') {
                    _localVariables = {
                        '_id': id,
                        '_init': false,
                        '_prototype': {},
                        '_options': $.extend({}, _this.options)
                    };
                    this.data = _localVariables;
                    $.extend(_localVariables._prototype, _this.method);
                }
            }
            var context = $.extend(window, {
                local: _localVariables,
            }, _componentVariables);
            _this.method.init.apply(context, Array.prototype.slice.call(args));
        } else {
            // By element channing method type - Elem.method()
            if (typeof self !== 'undefined') {
                return self.each(ElementBinder);
            }
        }
    };
    /*=================================================
     *= NOTE - HOMEWORKS ROUTE END
     *= DATE - 2017-01-10
     *================================================*/

    //============================================================================

    if (_componentVariables._bind === false) {
        _componentVariables._bind = true;
        name = name.split(',');
        for (var idx in name) {
            var id = $.trim(name[idx]);

            /* jshint ignore:start */
            /* @DATE 2017. 01. 09 */
            /* @USER Kenneth */
            /* @NOTE 런타임 매개변수 독립 사용을 위한 IIFE 설정. */
            !(function () {
                var _id = id;
                var bindFunc = function () {
                    return _this.route.apply(this, [_id].concat(Array.prototype.slice.call(arguments)));
                };
                $.fn[_id] = bindFunc;
                window[_id] = bindFunc;
            } ());
            /* jshint ignore:end */

            /* jshint ignore:start */
            /* @DATE 2016. 02. 22 */
            /* @USER Kenneth */
            /* @NOTE 함수 동적반영을 위한 jshint Escape 처리. */
            for (var key in this.method) {
                if (typeof $.fn[key] === 'undefined') {
                    !(function () {
                        var method = key;
                        $.fn[method] = function () {
                            var _localVariables;
                            var element = this[0];
                             if (typeof element === 'object') {
                                _localVariables = element.data;
                                if (typeof _localVariables === 'undefined') {
                                    _localVariables = {
                                        '_id': key,
                                        '_init': false,
                                        '_prototype': {},
                                        '_options': {}
                                    };
                                    element.data = _localVariables;
                                    $.extend(_localVariables._prototype, _this.method);
                                }

                                var context = $.extend(_this, {
                                    local: _localVariables,
                                }, _componentVariables);
                            }

                            if (_localVariables._init === false) {
                                _localVariables._init = true;
                                if (typeof _this.method.init !== 'undefined') {
                                    _this.method.init.apply(context, [$(this)].concat(Array.prototype.slice.call(arg, 1)));
                                } else {
                                    _this.init.apply(context, [$(this)].concat(Array.prototype.slice.call(arg, 1)));
                                }
                            }

                            return _this.method[method].apply(context, [this].concat(Array.prototype.slice.call(arguments)));
                        };
                    }());
                }
            }
            /* jshint ignore:end */
        }
    }
}

(function($) {
    /*******************************
     * NOTE - Additional jquery functions
     * DATE - 2017-01-09
     *******************************/
    if(typeof $.fn.scrollParent === 'undefined') {
        $.fn.scrollParent = function() {
            var overflowRegex = /(auto|scroll)/;
            var position = this.css('position');
            var excludeStaticParent = (position === 'absolute');
            var scrollParent = this.parents().filter(function() {
                var $parent = $(this);
                if (excludeStaticParent === true && $parent.css('position') === 'static') {
                    return false;
                }
                var overflowState = $parent.css(['overflow', 'overflowX', 'overflowY']);
                return (overflowRegex).test(overflowState.overflow + overflowState.overflowX + overflowState.overflowY);
            }).eq(0);

            return position === 'fixed' || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
        };
    }
}(jQuery));