'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * A module representing a Method.
 * @module core/utils/method
 */
define(['../models/index', './data'], function (model, data) {
    /**
     * @constructor
     * @alias module:core/utils/method
     * @description HOMEWORKS COMPONENT Create manager, This is core constructor for making HOMEWORKS COMPONENT.
     * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentMethod.html|here}.
     * @author Kenneth <kenneth@igaworks.com>
     * @param {string} name - COMPONENT Name.
     * @params {Object} settings - COMPONENT Settings.
     * @returns {Method}
     */
    var Method = function Method(name, settings) {
        /*=================================================
         *= NOTE - HOMEWORKS Component settings region.
         *= DATE - 2016-01-19
         *================================================*/
        var context = this;

        jQuery.extend(context, new data(this, name).store);

        if (typeof settings.options !== 'undefined' && settings.options !== null) {
            jQuery.extend(model.GLOBAL[name], settings.options);
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
        this.template = {};

        /**
         * @member {Object<Any>}
         * @description Options decleared by caller, You can default option in Method.
         */
        this.options = {};

        jQuery.extend(this.method, settings.method);
        jQuery.extend(this.template, settings.template);
        jQuery.extend(this.options, settings.options);

        /*=================================================
         *= NOTE - HOMEWORKS ROUTE START
         *= DATE - 2017-01-10
         *================================================*/

        /**
         * @function
         * @description This function is core of Method, This is provider to collecting Component by call patterns.
         * @param {string} id - Component unique id for give to internel of Component.
         * @returns {jQuery}
         */
        this.route = function (name, id) {
            var self = this;
            var args = [];
            if (arguments.length > 2) {
                Array.prototype.slice.call(arguments, 2).map(function (e, i) {
                    args.push(e);
                });
            }

            var ElementBinder = function ElementBinder(index, element) {
                var self = element;
                var $this = jQuery(self);

                if (typeof self.data === 'undefined') {
                    self.data = {};
                }
                var _localVariables = self.data[name];

                if (typeof _localVariables === 'undefined') {
                    _localVariables = {
                        '_id': id,
                        '_init': false,
                        '_prototype': {},
                        '_options': jQuery.extend({}, context.options)
                    };
                    jQuery.extend(_localVariables._prototype, context.method);
                }

                var componentContext = jQuery.extend(self[context.$helper.getIdentifier()], {
                    local: _localVariables
                }, context);

                if (args.length === 0 || _typeof(args[0]) === 'object') {
                    // Function(obj) or Function() pattern.
                    if (_typeof(args[0]) === 'object') {
                        // Function(obj) pattern.
                        jQuery.extend(_localVariables._options, args[0]);
                    }

                    if (_localVariables._init === false) {
                        _localVariables._init = true;
                        context.init.apply(componentContext, [$this].concat(Array.prototype.slice.call(args)));
                    }
                } else if (typeof args[0] === 'string') {
                    // Function(Method Name) pattern.
                    try {
                        if (_localVariables._init === false) {
                            _localVariables._init = true;
                            if (typeof context.method.init !== 'undefined') {
                                context.method.init.apply(componentContext, [$this].concat(Array.prototype.slice.call(args, 1)));
                            } else {
                                context.init.apply(componentContext, [$this].concat(Array.prototype.slice.call(args, 1)));
                            }
                        }
                        return context.method[args[0]].apply(componentContext, [$this].concat(Array.prototype.slice.call(args, 1)));
                    } catch (e) {
                        context.$helper.log(e.stack);
                    }
                } else {
                    context.$helper.log('Component has been got invalid parameters.');
                }
                self.data[name] = _localVariables;
            };

            if (args.length > 0 && self === window) {
                // Global basic function type - Function()
                if (typeof this.data === 'undefined') {
                    this.data = {};
                }

                var _localVariables = this.data[name];
                if (typeof _localVariables === 'undefined') {
                    _localVariables = {
                        '_id': id,
                        '_init': false,
                        '_prototype': {},
                        '_options': jQuery.extend({}, context.options)
                    };
                    this.data[name] = _localVariables;
                    jQuery.extend(_localVariables._prototype, context.method);
                }
                var componentContext = jQuery.extend(window[context.$helper.getIdentifier()], {
                    local: _localVariables
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
            var names = name.split(',');

            for (var idx in names) {
                /* jshint ignore:start */
                /* @DATE 2017. 01. 09 */
                /* @USER Kenneth */
                /* @NOTE 런타임 매개변수 독립 사용을 위한 IIFE 설정. */
                (function () {
                    var id = jQuery.trim(names[idx]);
                    var bindFunc = function bindFunc() {
                        return context.route.apply(this, [name, id].concat(Array.prototype.slice.call(arguments)));
                    };

                    jQuery.fn[id] = bindFunc;
                    window[id] = bindFunc;
                })();
                /* jshint ignore:end */

                /* jshint ignore:start */
                /* @DATE 2016. 02. 22 */
                /* @USER Kenneth */
                /* @NOTE 함수 동적반영을 위한 jshint Escape 처리. */
                for (var key in this.method) {
                    if (typeof jQuery.fn[key] === 'undefined') {
                        (function () {
                            var id = jQuery.trim(names[idx]);
                            var method = key;
                            jQuery.fn[method] = function () {
                                var _localVariables;
                                var element = this[0];

                                if (typeof element.data === 'undefined') {
                                    element.data = {};
                                }

                                _localVariables = element.data[name];
                                if (typeof _localVariables === 'undefined') {
                                    _localVariables = {
                                        '_id': id,
                                        '_init': false,
                                        '_prototype': {},
                                        '_options': {}
                                    };
                                    element.data[name] = _localVariables;
                                    jQuery.extend(_localVariables._prototype, context.method);
                                }

                                var componentContext = jQuery.extend(element[context.$helper.getIdentifier()], {
                                    local: _localVariables
                                }, context);

                                if (_localVariables._init === false) {
                                    _localVariables._init = true;
                                    if (typeof context.method.init !== 'undefined') {
                                        context.method.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(arguments, 1)));
                                    } else {
                                        context.init.apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(arguments, 1)));
                                    }
                                }

                                return context.method[method].apply(componentContext, [jQuery(this)].concat(Array.prototype.slice.call(arguments)));
                            };
                        })();
                    }
                }
                /* jshint ignore:end */
            }
        }
    };
    return Method;
});
//# sourceMappingURL=method.js.map
