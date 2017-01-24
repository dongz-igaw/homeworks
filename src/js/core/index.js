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
// @ UPDATE  2017-01-25                          
// @ AUTHOR  Kenneth                                      
//
//=========================================================

window.HOMEWORKS_VERSION = '2.0.9.8';
var VERSION = '@@VERSION';
if (VERSION.replace(/@/g, '') !== 'VERSION') {
    window.HOMEWORKS_VERSION = VERSION;
}

var HOMEWORKS_PARAMS = {
    framework: 'homeworks',
    prefix: 'works',
};
var _promiseVariables = {}; // Promise standard global variables.
var _superVariables = {}; // Plugin option standard global variables.

/*=================================================
 *= NOTE - String mapper.
 *= DATE - 2016-01-19
 *================================================*/
String.prototype.mapping = function (data) {
    var string = this;
    for (var idx in data) {
        var value = data[idx];
        idx = idx.replace(/\\/gi, '\\\\')
                 .replace(/-/gi, '\\-');
        var regexp = new RegExp("\\{" + idx + "\\}", "gi");
        string = string.replace(regexp, value);
    }
    return string.toString();
};

/*=================================================
 *= NOTE - String formatter.
 *= DATE - 2017-01-23
 *================================================*/
String.prototype.format = function (data) {
    var string = this;

    if(typeof data !== 'undefined' && typeof data !== null && typeof data !== 'object') {
        data = [data];
    }

    for (var idx in data) {
        var value = data[idx];
        var regexp = new RegExp("\\{" + idx + "\\}", "g");
        string = string.replace(regexp, value);
    }
    return string.toString();
};

/*=================================================
 *= NOTE - Component biding feature.
 *= DATE - 2016-01-19
 *================================================*/
Function.prototype.hook = function (component, args) {
    var context = this;

    try {
        jQuery(document).ready(function() {
            var format = '{prefix}-{component}, [{component}], [data-{component}]';

            jQuery(format.mapping({
                prefix: HOMEWORKS_PARAMS.prefix,
                component: component
            })).each(function () {
                var element = $(this);
                var target = element.data('pen');
                var plugin = element.data(component);

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

/**
 * @constructor
 * @description HOMEWORKS COMPONENT Store constructor, It is separated by each COMPOENTS.
 * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentData.html|here}.
 * @author Kenneth <kenneth@igaworks.com>
 * @param {ComponentMethod} context - HOMEWORKS ComponentMethod Context.
 * @param {string} id -  HOMEWORKS Component Unique ID
 * @returns {ComponentData}
 */
function ComponentData(context, id) {
    /*=================================================
     *= NOTE - HOMEWORKS Compoent storagy variables region.
     *= DATE - 2016-01-19
     *================================================*/
    if (typeof _superVariables[id] === 'undefined') {
        _superVariables[id] = {};
    }

    /**
     * @member
     * @description ComponentData's store variable, This is the heart of ComponentData.
     * @property {ComponentData} $self - Reference of ComponentData (self).
     * @property {ComponentMethod} $super - Reference of ComponentMethod.
     * @property {ComponentHelper} $helper - Reference of ComponentHelper.
     * @property {Boolean} _init - If component already done initialize process, It will be true (This is prevent a duplication of initializing).
     * @property {Boolean} _anim - The logical variable of Component animating.
     * @property {Boolean} _bind - The logical variable of Component binding.
     * @property {Object} anim - Animation configuration object.
     * @property {String} framework - Framework full name.
     * @property {String} prefix - Framework short name for using set class name prefix of Component.
     * @property {String} id - An unique id of Component, It will be automatically setted in the process of ComponentMethod.
     * @property {Array<jQuery>} element - Quick reference of jQuery objects that refered frequently.
     * @property {Object} global - Global properties each of Components.
     */
    this.store = jQuery.extend(HOMEWORKS_PARAMS, {
        $self: this,
        $super: context,
        $helper: null,
        _init: false,
        _anim: false,
        _bind: false,
        _debug: true,
        anim: {
            time: 300,
            effect: 'swing'
        },
        id: id,
        element: {
            $window: $(window),
            $document: $(document)
        },
        global: _superVariables[id] || {}
    });
    this.store.$helper = new ComponentHelper(context, this.store);
}

/**
 * @constructor
 * @description HOMEWORKS Helper constructor, This is helping to treat DOM Elements or JS operators.
 * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentHelper.html|here}.
 * @author Kenneth <kenneth@igaworks.com>
 * @param {ComponentMethod} context - HOMEWORKS ComponentMethod Context.
 * @param {ComponentData.store} data - HOMEWORKS ComponentData store for get unique id.
 * @returns {ComponentHelper}
 */
function ComponentHelper(context, data) {
    /*=================================================
     *= NOTE - HOMEWORKS Component shared feature.
     *= DATE - 2016-01-19
     *================================================*/

     /**
     * @function
     * @description Get random string that made 0-9 numbers, lower/upper case alphabets.
     * @param {Number} length - Random string length.
     * @returns {String} Random string.
     */
    this.randomString = function(length) {
        length = length || 10;
        var seed = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        var randomString = [];
        for(var idx=0; idx<length; idx++) {
            randomString.push(seed[Math.floor(Math.random() * seed.length)]);
        }
        return randomString.join('');
    };

    /**
     * @function
     * @description Promiss is helping to make a schedule, It is similar like setTimeout.
     * @param {String} name - Promiss name for control.
     * @param {Function} callback - The callback when promiss is done.
     * @param {Number} time - A millisecond time for promiss.
     * @param {Function} invoke - The callback when invoke request be received.
     * @returns {Number} setTimeout number.
     */
    this.promise = function (name, callback, time, invoke) {
        var self = this;
        if (typeof name === 'function' && typeof callback === 'number') {
            time = callback;
            callback = name;
            name = '{0}_{1}'.format([context.id, this.randomString(8)]);
        }

        if (typeof invoke !== 'undefined' && invoke === true) {
            this.invoke(name);
        }

        _promiseVariables[context.framework + '.' + name] = setTimeout(function () {
            try {
                delete _promiseVariables[context.framework + '.' + name];
            } catch (e) {
                self.log(e.stack);
            }

            if (typeof callback === 'function') {
                callback();
            }
        }, time);

        return name;
    };

    /**
     * @function
     * @description This function will invoke promiss request that you created before.
     * @param {String} name - Promiss name for invoke a request.
     * @param {Function} callback - The callback when promiss is done.
     * @param {Number} time - A millisecond time for promiss.
     * @param {Function} invoke - The callback when invoke request be received.
     * @returns {Boolean}
     */
    this.invoke = function (name) {
        if (typeof name === 'undefined' || name === null) {
            name = context.id;
        }

        if (typeof _promiseVariables[context.framework + '.' + name] !== 'undefined') {
            try {
                clearTimeout(_promiseVariables[context.framework + '.' + name]);
                delete _promiseVariables[context.framework + '.' + name];
            } catch (e) {
                self.log(e.stack);
            }
        }
        return true;
    };

    /**
     * @function
     * @description The logger of HOMEWORKS Frameworks, Use this instead console.log.
     * @param {String} message - String error message or Exception object.
     * @param {String} code - Error code or number.
     * @returns {undefined}
     */
    this.log = function (message, code) {
        if (context._debug === true) {
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

    /**
     * @function
     * @description This function find template that you declared on ComponentMethod's templates array, and than replace it using a key what you gave.
     * @param {String} key - The template key.
     * @param {Object} map - The template object.
     * @returns {String}
     */
    this.parseTemplate = function (key, map) {
        var data = context.template[key];
        if (typeof data === 'undefined') {
            this.log("'" + key + "' 이름의 템플릿이 확인되지 않습니다.");
            return false;
        }
        return data.mapping(map);
    };

    /**
     * @function
     * @description You can get unique id for set each of component by using this function.
     * @returns {String}
     */
    this.getIdentifier = function () {
        var id = data.id.replace(/,?\s/g, '-');
        var id_arr = id.split('');
        id = [id_arr[0].toUpperCase()].concat(id_arr.splice(1, id.length)).join('');
        return data.framework + id;
    };

    /**
     * @function
     * @description It will attach an event to your element, Use this function instead jQuery.bind.
     * @param {jQuery} element - jQuery object for attach event.
     * @param {String} type - Event type name.
     * @param {Function} callback - The callback function which fired when event triggered.
     * @param {Boolean} initialize - If this parameter is true, The event is triggered once automatically.
     * @returns {undefined}
     */
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

    /**
     * @function
     * @description Deattach event from the jQuery object, Use this function instead jQuery.unbind.
     * @param {jQuery} element - jQuery object for deattach event.
     * @param {String} type - Event type name.
     * @returns {undefined}
     */
    this.unbind = function (element, type) {
        element.unbind(type + '.' + this.getIdentifier());
    };

    /**
     * @function
     * @description This function will trigger an event, Use this function instead jQuery.trigger.
     * @param {jQuery} element - jQuery object for trigger event.
     * @param {String} type - Event type name.
     * @param {Any} value - Extra values for sending the binder function.
     * @returns {undefined}
     */
    this.trigger = function (element, type, value) {
        var forms = (type.toString().split(' '))[0];
        element.trigger(value === true ? forms : (forms + '.' + this.getIdentifier()), value);
    };

    /**
     * @function
     * @description This function will trigger an event "only logically", Use this function instead jQuery.triggerHandler.
     * @param {jQuery} element - jQuery object for trigger event logically.
     * @param {String} type - Event type name.
     * @param {Any} value - Extra values for sending the binder function.
     * @returns {undefined}
     */
    this.triggerHandler = function (element, type, value) {
        var forms = (type.toString().split(' '))[0];
        element.triggerHandler(value === true? forms : (forms + '.' + this.getIdentifier()), value);
    };
}

/**
 * @constructor
 * @description HOMEWORKS COMPONENT Create manager, This is core constructor for making HOMEWORKS COMPONENT.
 * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentMethod.html|here}.
 * @author Kenneth <kenneth@igaworks.com>
 * @param {string} name - COMPONENT Name.
 * @params {Object} settings - COMPONENT Settings.
 * @returns {ComponentMethod}
 */
function ComponentMethod(name, settings) {
    /*=================================================
     *= NOTE - HOMEWORKS Component settings region.
     *= DATE - 2016-01-19
     *================================================*/
    var context = this;

    jQuery.extend(context, (new ComponentData(this, name)).store);

    if (typeof settings.options !== 'undefined' && settings.options !== null) {
        jQuery.extend(_superVariables[name], settings.options);
    }

    /**
     * @member {Function}
     * @description The constructor of Component, This function will be called when Component mapping be started.
     */
    this.init = settings.init;

    /**
     * @member {Object<Function>}
     * @description An object wrapped functions, This object is declared Component methods.
     */
    this.method = {
        init: this.init
    };

    /**
     * @member {Object<String>}
     * @description An object wrapped templates, This object is declared templates which use in Component.
     */
    this.template = {
    };

    /**
     * @member {Object<Any>}
     * @description Options decleared by caller, You can default option in ComponentMethod.
     */
    this.options = {
    };

    jQuery.extend(this.method, settings.method);
    jQuery.extend(this.template, settings.template);
    jQuery.extend(this.options, settings.options);

    /*=================================================
     *= NOTE - HOMEWORKS ROUTE START
     *= DATE - 2017-01-10
     *================================================*/

    /**
     * @function
     * @description This function is core of ComponentMethod, This is provider to collecting Component by call patterns.
     * @param {string} id - Component unique id for give to internel of Component.
     * @returns {jQuery}
     */
    this.route = function (id) {
        var self = this;
        var args = [];
        if (arguments.length > 1) {
            jQuery.map(Array.prototype.slice.call(arguments, 1), function (e, i) {
                args.push(e);
            });
        }

        var ElementBinder = function () {
            if(typeof this.data === 'undefined') {
                this.data = {};
            }

            var _localVariables = this.data[id]; 

            if (typeof _localVariables === 'undefined') {
                _localVariables = {
                    '_id': id,
                    '_init': false,
                    '_prototype': {},
                    '_options': jQuery.extend({}, context.options)
                };
                this.data[id] = _localVariables;
                jQuery.extend(_localVariables._prototype, context.method);
            }

            var componentContext = jQuery.extend(this[context.$helper.getIdentifier()], {
                local: _localVariables,
            }, context);

            if (args.length === 0 || typeof args[0] === 'object') {
                // Function(obj) or Function() pattern.
                if (typeof args[0] === 'object') {
                    // Function(obj) pattern.
                    jQuery.extend(_localVariables._options, args[0]);
                }

                if (_localVariables._init === false) {
                    _localVariables._init = true;
                    context.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(args)));
                }
            } else if (typeof args[0] === 'string') {
                // Function(Method Name) pattern.
                try {
                    if (_localVariables._init === false) {
                        _localVariables._init = true;
                        if (typeof context.method.init !== 'undefined') {
                            context.method.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(args, 1)));
                        } else {
                            context.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(args, 1)));
                        }
                    }
                    return context.method[args[0]].apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(args, 1)));
                } catch (e) {
                    context.$helper.log(e.stack);
                }
            } else {
                context.$helper.log('Component has been got invalid parameters.');
            }
        };

        if (args.length > 0 && self === window) {
            // Global basic function type - Function()
            if(typeof this.data === 'undefined') {
                this.data = {};
            }

            var _localVariables = this.data[id];
            if (typeof _localVariables === 'undefined') {
                _localVariables = {
                    '_id': id,
                    '_init': false,
                    '_prototype': {},
                    '_options': jQuery.extend({}, context.options)
                };
                this.data[id] = _localVariables;
                jQuery.extend(_localVariables._prototype, context.method);
            }
            var componentContext = jQuery.extend(window[context.$helper.getIdentifier()], {
                local: _localVariables,
            }, context);
            context.method.init.apply(componentContext, Array.prototype.slice.call(args));
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

    if (context._bind === false) {
        context._bind = true;
        name = name.split(',');
        for (var idx in name) {
            var id = jQuery.trim(name[idx]);

            /* jshint ignore:start */
            /* @DATE 2017. 01. 09 */
            /* @USER Kenneth */
            /* @NOTE 런타임 매개변수 독립 사용을 위한 IIFE 설정. */
            (function () {
                var _id = id;
                var bindFunc = function () {
                    return context.route.apply(this, [_id].concat(Array.prototype.slice.call(arguments)));
                };
                
                jQuery.fn[_id] = bindFunc;
                window[_id] = bindFunc;
            } ());
            /* jshint ignore:end */

            /* jshint ignore:start */
            /* @DATE 2016. 02. 22 */
            /* @USER Kenneth */
            /* @NOTE 함수 동적반영을 위한 jshint Escape 처리. */
            for (var key in this.method) {
                if (typeof jQuery.fn[key] === 'undefined') {
                    (function () {
                        var method = key;
                        jQuery.fn[method] = function () {
                            var _localVariables;
                            var element = this[0];

                            if(typeof element.data === 'undefined') {
                                element.data = {};
                            }

                            _localVariables = element.data[key];
                            if (typeof _localVariables === 'undefined') {
                                _localVariables = {
                                    '_id': key,
                                    '_init': false,
                                    '_prototype': {},
                                    '_options': {}
                                };
                                element.data[key] = _localVariables;
                                jQuery.extend(_localVariables._prototype, context.method);
                            }

                            var componentContext = jQuery.extend(element[context.$helper.getIdentifier()], {
                                local: _localVariables,
                            }, context);

                            if (_localVariables._init === false) {
                                _localVariables._init = true;
                                if (typeof context.method.init !== 'undefined') {
                                    context.method.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(arguments, 1)));
                                } else {
                                    context.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(arguments, 1)));
                                }
                            }

                            return context.method[method].apply(componentContext, [this].concat(Array.prototype.slice.call(arguments)));
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

/* TEST CODE START */
exports.ComponentData = ComponentData;
exports.ComponentHelper = ComponentHelper;
exports.ComponentMethod = ComponentMethod;
/* TEST CODE END */