/*
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
// @ UPDATE  2017.03.15
// @ AUTHOR  Kenneth
//
//=========================================================
*/


(function(root, factory) {
    if(typeof define !== 'undefined' && define.amd) {
        define(function() {
            factory();
        });
    } else if(typeof module === 'object') {
        module.exports = factory();
    } else {
        root.pignoseCalendar = factory();
    }
} (this, function () {
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});



define('core/models/index',[],function () {
    window.HOMEWORKS_VERSION = '1.0.0.3';

    var HOMEWORKS_MODEL = {
        VERSION: '@@VERSION',
        PARAMS: {
            framework: 'homeworks',
            prefix: 'works'
        },
        PROMISE: {},
        GLOBAL: {}
    };

    if (HOMEWORKS_MODEL.VERSION.replace(/@/g, '') !== 'VERSION') {
        window.HOMEWORKS_VERSION = HOMEWORKS_MODEL.VERSION;
    }

    return HOMEWORKS_MODEL;
});
//# sourceMappingURL=index.js.map
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * A module representing a Helper.
 * @module core/utils/helper
 */
define('core/utils/helper',['../models/index'], function (model) {
    /**
     * @constructor
     * @alias module:core/utils/helper
     * @description HOMEWORKS Helper constructor, This is helping to treat DOM Elements or JS operators.
     * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentHelper.html|here}.
     * @author Kenneth <kenneth@igaworks.com>
     * @param {Method} context - HOMEWORKS Method Context.
     * @param {ComponentData.store} data - HOMEWORKS ComponentData store for get unique id.
     * @returns {Helper}
     */
    var Helper = function Helper(context, data) {
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
        this.randomString = function (length) {
            length = length || 10;
            var seed = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
            var randomString = [];
            for (var idx = 0; idx < length; idx++) {
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

            model.PROMISE[context.framework + '.' + name] = setTimeout(function () {
                try {
                    delete model.PROMISE[context.framework + '.' + name];
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

            if (typeof model.PROMISE[context.framework + '.' + name] !== 'undefined') {
                try {
                    clearTimeout(model.PROMISE[context.framework + '.' + name]);
                    delete model.PROMISE[context.framework + '.' + name];
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
         * @description This function find template that you declared on Method's templates array, and than replace it using a key what you gave.
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
                    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                        $.extend(event, value);
                    }

                    if (typeof callback === 'function') {
                        callback.apply(this, Array.prototype.slice.call(arguments));
                    }
                });

                if (typeof initialize !== 'undefined' && initialize === true) {
                    this.triggerHandler(element, type, {
                        _init: true
                    });
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
            var forms = type.toString().split(' ')[0];
            element.trigger(value === true ? forms : forms + '.' + this.getIdentifier(), value);
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
            var forms = type.toString().split(' ')[0];
            element.triggerHandler(value === true ? forms : forms + '.' + this.getIdentifier(), value);
        };
    };
    return Helper;
});
//# sourceMappingURL=helper.js.map
;


/**
 * A module representing a Data.
 * @module core/utils/data
 */
define('core/utils/data',['../models/index', './helper'], function (model, helper) {
    /**
     * @constructor
     * @alias module:core/utils/data
     * @description HOMEWORKS COMPONENT Store constructor, It is separated by each COMPOENTS.
     * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentData.html|here}.
     * @author Kenneth <kenneth@igaworks.com>
     * @param {Method} context - HOMEWORKS Method Context.
     * @param {string} id -  HOMEWORKS Component Unique ID
     * @returns {Data}
     */
    var Data = function Data(context, id) {
        /*=================================================
         *= NOTE - HOMEWORKS Compoent storagy variables region.
         *= DATE - 2016-01-19
         *================================================*/
        if (typeof model.GLOBAL[id] === 'undefined') {
            model.GLOBAL[id] = {};
        }

        /**
         * @member
         * @description Data's store variable, This is the heart of Data.
         * @property {Data} $self - Reference of Data (self).
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
        this.store = jQuery.extend(model.PARAMS, {
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
            global: model[id] || {}
        });
        this.store.$helper = new helper(context, this.store);
    };
    return Data;
});
//# sourceMappingURL=data.js.map
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * A module representing a Method.
 * @module core/utils/method
 */
define('core/utils/method',['../models/index', './data'], function (model, data) {
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
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('core/utils/prototype',['../models/index'], function (model) {
	/*=================================================
  *= NOTE - String mapper.
  *= DATE - 2016-01-19
  *================================================*/
	String.prototype.mapping = function (data) {
		var string = this;
		for (var idx in data) {
			var value = data[idx];
			idx = idx.replace(/\\/gi, '\\\\').replace(/-/gi, '\\-');
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

		if (typeof data !== 'undefined' && typeof data !== null && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
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
			jQuery(document).ready(function () {
				var format = '{prefix}-{component}, [{component}], [data-{component}]';

				jQuery(format.mapping({
					prefix: model.PARAMS.prefix,
					component: component
				})).each(function () {
					var element = $(this);
					var target = element.data('pen');
					var plugin = element.data(component);

					if (plugin === false) return true;

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
});
//# sourceMappingURL=prototype.js.map
;


define('core/exts/bind',[],function () {
    (function ($) {
        $(function () {
            $('.works-footer .floating-top').bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                $('.works-body .works-content').stop().animate({ scrollTop: 0 }, 1200);
            });

            $('.works-sider a.works-sider-group-menu').bind('click', function () {
                var $this = $(this);
                var $next = $this.next();
                if ($next.is('.works-sider-group')) {
                    $this.toggleClass('active');
                    $next.stop();
                    if ($this.hasClass('active')) {
                        $this.siblings('.active').removeClass('active');
                        $next.slideDown(300);
                    } else {
                        $next.slideUp(300);
                    }
                }
            }).filter('.active').each(function () {
                var $this = $(this);
                var $next = $this.next();
                if ($next.is('.works-sider-group')) {
                    $next.show();
                }
            });

            $('.works-sider a.works-sider-sub-group-menu').bind('click', function () {
                var $this = $(this);
                var $next = $this.next();
                if ($next.is('.works-sider-sub-group')) {
                    $this.toggleClass('active');
                    $next.stop();
                    if ($this.hasClass('active')) {
                        $this.siblings('.active').removeClass('active');
                        $next.slideDown(300);
                    } else {
                        $next.slideUp(300);
                    }
                }
            }).filter('.active').each(function () {
                var $this = $(this);
                var $next = $this.next();
                if ($next.is('.works-sider-sub-group')) {
                    $next.show();
                }
            });
        });
    })(jQuery);
});
//# sourceMappingURL=bind.js.map
;


define('core/exts/scroll',[],function () {
    if (typeof $.fn.scrollParent === 'undefined') {
        $.fn.scrollParent = function () {
            var overflowRegex = /(auto|scroll)/;
            var position = this.css('position');
            var excludeStaticParent = position === 'absolute';
            var scrollParent = this.parents().filter(function () {
                var $parent = $(this);
                if (excludeStaticParent === true && $parent.css('position') === 'static') {
                    return false;
                }
                var overflowState = $parent.css(['overflow', 'overflowX', 'overflowY']);
                return overflowRegex.test(overflowState.overflow + overflowState.overflowX + overflowState.overflowY);
            }).eq(0);

            return position === 'fixed' || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
        };
    }
});
//# sourceMappingURL=scroll.js.map
;


define('core/exts/index',['./bind', './scroll'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/checkbox/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('checkbox', {
            init: function init(element) {
                var context = this;

                var $checkbox = $(context.$helper.parseTemplate('checkbox'));
                var $label = element.closest('label');
                if ($label.length < 1) {
                    element.wrap('<label class="works-checkbox-wrapper"></label>');
                } else {
                    $label.addClass('works-checkbox-wrapper');
                }

                $checkbox.insertAfter(element).ripple({
                    theme: 'dark',
                    over: true,
                    passive: true
                });

                context.$helper.bind(element.closest('label'), 'click', function (event) {
                    event.stopPropagation();
                });

                context.$helper.bind(element, 'change', function (event, extra) {
                    var $this = $(this);
                    $checkbox.ripple('start');
                    context.$helper.triggerHandler(element, 'update');
                });

                context.$helper.bind(element, 'update', function (event) {
                    var $this = $(this);
                    if ($this.prop('checked') === true) {
                        $checkbox.addClass('works-checkbox-checked');
                    } else {
                        $checkbox.removeClass('works-checkbox-checked');
                    }
                }, true);

                if (typeof element.attr('class') !== 'undefined' && element.attr('class').match(/input-(\w+)/gi)) {
                    var class_names = element.attr('class').match(/input-(\w+)/gi);
                    for (var idx in class_names) {
                        var class_name = class_names[idx];
                        $checkbox.addClass('works-checkbox-' + class_name);
                    }
                }

                element.hide();
            },
            template: {
                checkbox: '<span href="#" class="works-checkbox"></span>'
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/checkbox/hook',[],function () {
    (function () {
        this.checkbox();
    }).hook('checkbox');
});
//# sourceMappingURL=hook.js.map
;


define('components/checkbox/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/converter/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('converter', {
            init: function init(element) {
                var context = this;

                var preventKeyCode = [37, 38, 39, 40, 9, 13, 17, 46];
                var ctrlLock = false;
                var ctrlTimer = null;

                element.each(function () {
                    var $this = $(this);
                    if ($this.hasClass('input-number')) {
                        context.$helper.bind($this, 'keydown keyup', function (event) {
                            setTimeout(function () {
                                if (event.type === 'keyup' && event.keyCode === 17) {
                                    ctrlLock = true;
                                    try {
                                        clearTimeout(ctrlTimer);
                                    } catch ($this) {
                                        console.trace($this.stack);
                                    }
                                    setTimeout(function () {
                                        ctrlLock = false;
                                    }, 150);
                                }

                                if ($.inArray(event.keyCode, preventKeyCode) === -1 && ctrlLock === false && (typeof event.ctrlKey === 'undefined' || event.ctrlKey === false)) {
                                    var selectPosition = 0;
                                    var oldLength = $this[0].value.length;
                                    if ($this[0].selectionStart || $this[0].selectionStart === 0) {
                                        selectPosition = $this[0].selectionStart;
                                    } else if (document.selection && document.selection.createRange) {
                                        var ran = document.selection.createRange();
                                        ran.moveStart('character', -$this[0].value.length);
                                        selectPosition = ran.text.length;
                                    }

                                    var value = $this.val();
                                    if (typeof value !== 'undefined' && value !== null) {
                                        value = value.toString().split('.')[0];
                                    }
                                    value = value.toString().replace(/[^\d]*/gi, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                                    $this.val(value);

                                    var diffLength = Math.max(0, value.length - oldLength);
                                    selectPosition += diffLength;

                                    if ($this[0].selectionStart || $this[0].selectionStart === 0) {
                                        $this[0].setSelectionRange(selectPosition, selectPosition);
                                    } else if ($this[0].createTextRange !== 'undefined') {
                                        var cursor = $this[0].createTextRange();
                                        cursor.move('character', selectPosition);
                                        cursor.select();
                                    }

                                    if (!event.isTrigger) {
                                        $this.triggerHandler('change');
                                    }
                                }
                            }, 25);
                        }, true);
                    } else if ($this.hasClass('input-datetime')) {
                        // Write some codes here.
                    } else if ($this.hasClass('input-decimal')) {
                        // Write some codes here.
                    }
                });
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/converter/index',['./core'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/dropdown/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('dropdown', {
            init: function init(element) {
                var context = this;

                var options = context.local._options;

                var $target = null;

                if (typeof options.target !== 'undefined' && options.target !== null) {
                    $target = options.target;
                }

                element.appendTo('body');
                element.hide();

                if ($target === null || $target.length < 1) {
                    return false;
                }

                element.addHandler($target);
            },
            method: {
                addHandler: function addHandler(element, target) {
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

                    context.$helper.bind(target.ripple({
                        theme: 'dark'
                    }), 'click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var $this = $(this);
                        var $scrollParent = $this.scrollParent();

                        if ($this.hasClass('works-dropdown-active')) {
                            context.local._prototype.removeDropdown.call(context, element, $this);
                        } else {
                            $this.addClass('works-dropdown-active');

                            element.show();

                            var leftOffset = 0,
                                topOffset = 0;
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
                                    left: $this.offset().left + ($this.outerWidth() - element.outerWidth()) / 2 + leftOffset,
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
                removeDropdown: function removeDropdown(element, target) {
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
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/dropdown/hook',[],function () {
    (function (target) {
        var direction = this.data('direction');

        this.dropdown({
            target: target,
            direction: direction
        });
    }).hook('dropdown');
});
//# sourceMappingURL=hook.js.map
;


define('components/dropdown/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/input/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('input', {
            init: function init(element) {
                var context = this;
                var options = context.local._options;
                var $label = $(context.$helper.parseTemplate('label')).insertAfter(element);
                var $placeholder = $(context.$helper.parseTemplate('placeholder')).text(element.attr('placeholder') || element.attr('title'));
                var type = element.data('type') || (typeof options !== 'undefined' ? options.type : '');
                var validation = false;
                var changeDetector = function changeDetector() {
                    var placeholder = element.attr('placeholder') || element.attr('title');
                    if (typeof placeholder !== 'undefined' && placeholder !== null && placeholder !== '') {
                        $label.addClass('works-input-label-placeholder');
                        $placeholder.text(placeholder);
                        element.attr('placeholder', '');
                    }
                };

                /* jshint ignore:start */
                /* @DATE 2016. 06. 28 */
                /* @USER Kenneth */
                /* @NOTE dataset에서 받아오는 boolean 타입 보정 !!구문 유효성문제로 인해 escape 처리. */
                if (!!options.validation.disable !== true) {
                    validation = true;
                }
                /* jshint ignore:end */

                rule = {
                    notnull: element.attr('notnull') || true,
                    minlen: element.attr('minlen') || 0,
                    maxlen: element.attr('maxlen') || 10,
                    numeric: element.attr('numeric') || false
                };

                context.local.type = type;
                context.local.rule = rule;

                if (element.is(':visible') === true && options.static === true && element.hasClass('input-block') === false) {
                    $label.width(element.outerWidth());
                }
                element.appendTo($label);
                $placeholder.insertBefore(element);

                context.$helper.bind(element, 'focus', function () {
                    $label.addClass('works-input-lock').addClass('works-input-focus');
                    if (validation === true) {
                        context.local._prototype.validation.call(context, element, 'clear');
                    }
                });

                context.$helper.bind(element, 'blur', function (event) {
                    if (type === 'number') {
                        element.val(element.val().replace(/[^\d.]+/gi, ''));
                    }

                    if (typeof event.originalEvent !== 'undefined') {
                        if (validation === true) {
                            context.local._prototype.validation.call(context, element);
                        }
                    }

                    if (element.val() === '') {
                        $label.removeClass('works-input-lock');
                    } else {
                        $label.addClass('works-input-lock');
                    }

                    element.parent().removeClass('works-input-focus');
                }, true);

                element.unbind('update').bind('update', function () {
                    changeDetector();
                });

                context.$helper.bind(element, 'update', function (event) {
                    if (element.val() === '') {
                        $label.removeClass('works-input-lock');
                    } else {
                        $label.addClass('works-input-lock');
                    }
                });

                var extracted_classes = element.attr('class').match(/input-(\w+)/gi);
                if (typeof element.attr('class') !== 'undefined' && extracted_classes !== null && extracted_classes.length > 0) {
                    var class_names = element.attr('class').match(/input-(\w+)/gi);
                    for (var idx in class_names) {
                        var class_name = class_names[idx];
                        $label.addClass('works-' + class_name);
                    }
                }

                if (element.prop('disabled') === true) {
                    $label.addClass('works-input-disabled');
                }

                if (validation === true) {
                    element.parent().addClass('works-input-label-validation');
                }

                context.$helper.promise(function () {
                    context.$helper.triggerHandler(element, 'blur');
                }, 25);

                changeDetector();
            },
            method: {
                validation: function validation(element, type) {
                    var context = this;
                    var allowedType = ['success', 'error', 'clear'];
                    element.parent().find('.works-input-validation').remove();

                    if (typeof type === 'undefined' || allowedType.indexOf(type) === -1) {
                        if (element.val() === '') {
                            if (typeof context.local.rule.notnull === 'undefined' || context.local.rule.notnull === false) {
                                type = 'success';
                            } else {
                                type = 'error';
                            }
                        } else {
                            if (context.local.rule.notnull) type = 'success';
                        }
                    }

                    var $validator = null;
                    if (type === 'success') {
                        element.parent().removeClass('works-input-label-validation-error').addClass('works-input-label-validation-success');
                        $validator = $(context.$helper.parseTemplate('validationSuccess'));
                        $validator.insertAfter(element);
                    } else if (type === 'error') {
                        element.parent().addClass('works-input-label-validation-error').removeClass('works-input-label-validation-success');
                        $validator = $(context.$helper.parseTemplate('validationError'));
                        $validator.insertAfter(element);
                    } else {
                        element.parent().removeClass('works-input-label-validation-error').removeClass('works-input-label-validation-success').removeClass('works-input-label-validation-active');
                    }

                    if (type === 'success' || type === 'error') {
                        context.$helper.promise(function () {
                            element.parent().addClass('works-input-label-validation-active');
                        }, 25);
                    }
                }
            },
            template: {
                label: '<label class="works-input-label"></label>',
                placeholder: '<span class="works-input-placeholder"></span>',
                validationSuccess: '<span class="works-input-validation works-input-validation-success"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="works-input-validation-first" d="M 10 15 l -4 -4" stroke-dasharray="5.6568" stroke-width="2" /><path class="works-input-validation-last" d="M 9 15 l 8 -7" stroke-dasharray="10.6301" stroke-width="2" /></svg></span>',
                validationError: '<span class="works-input-validation works-input-validation-error"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="works-input-validation-first" d="M 8 8 L 16 16" stroke-dasharray="11.3137" stroke-width="2" /><path class="works-input-validation-last" d="M 16 8 L 8 16" stroke-dasharray="11.3137" stroke-width="2" /></svg></span>'
            },
            options: {
                static: true,
                validation: {
                    disable: false
                }
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/input/hook',[],function () {
    (function () {
        this.input();
    }).hook('input');
});
//# sourceMappingURL=hook.js.map
;


define('components/input/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/menu/hook',[],function () {
    (function () {
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
});
//# sourceMappingURL=hook.js.map
;


define('components/menu/index',['./hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/modal/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('modal, popup', {
            init: function init(element) {
                var context = this;
                var $btn = element.find('.modal-footer .btn');

                this.local._visible = false;

                if (element.hasClass('modal-full') === false) {
                    this.$helper.bind(element, 'update', function (event) {
                        element.css({
                            left: 0,
                            top: 0
                        });

                        element.css({
                            left: '50%',
                            top: '50%',
                            marginLeft: -element[0].offsetWidth / 2,
                            marginTop: -element[0].offsetHeight / 2
                        });
                    });
                } else {
                    if (element.children('.modal-inner').children('.modal-scroller').length < 1) {
                        var $scoller = $('<div class="modal-scroller"></div>');
                        $scoller.append(element.children('.modal-inner').children());
                        $scoller.appendTo(element.children('.modal-inner'));
                    }

                    this.$helper.bind(element, 'update', function (event) {
                        element.find('> .modal-inner > .modal-scroller').css({
                            maxWidth: context.element.$window.outerWidth(),
                            maxHeight: context.element.$window.outerHeight()
                        });
                    }, true);
                }

                context.$helper.bind(this.element.$window, 'resize', function (event) {
                    context.$helper.triggerHandler(element, 'update');
                }, true);

                context.$helper.unbind($btn.add(element.find('.btn-close')), 'click');

                context.$helper.bind($btn.add(element.find('.btn-close')), 'click', function (event) {
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
                update: function update() {
                    var context = this;
                    context.$helper.triggerHandler(_this.element.$window, 'update');
                },
                toggle: function toggle(element) {
                    var context = this;
                    if (context.local._visible === true) {
                        context.local._prototype.close.call(context, element);
                    } else {
                        context.local._prototype.open.call(context, element);
                    }
                },
                show: function show(element) {
                    var context = this;
                    context.local._prototype.open.call(context, element);
                },
                hide: function hide(element) {
                    var context = this;
                    context.local._prototype.close.call(context, element);
                },
                open: function open(element) {
                    var context = this;

                    context.local._visible = true;

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

                    context.$helper.triggerHandler(element, 'update');

                    element.triggerHandler('modal.open');

                    context.$helper.promise(function () {
                        element.addClass('anim-start');
                        $overlay.css('opacity', 0.6);
                        context.$helper.triggerHandler(element, 'update');
                    }, 25);

                    context.$helper.bind($overlay, 'click', function (event) {
                        context.local._prototype.close.call(context, element);
                    });
                },
                close: function close(element) {
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
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/modal/hook',[],function () {
    (function (target) {
        this.bind('click', function (event) {
            event.preventDefault();
            target.modal('toggle');
        });
    }).hook('modal');
});
//# sourceMappingURL=hook.js.map
;


define('components/modal/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('components/notification/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('notification', {
            init: function init(title, content, url, status) {
                var context = this;

                if (typeof url === 'undefined' || url === null || $.trim(url) === '') {
                    url = null;
                }

                status = status || 'primary';

                if (typeof title === 'undefined' || typeof content === 'undefined') {
                    return false;
                } else if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object') {
                    content = JSON.stringify(content);
                }

                var $notificationBox = $('.notification-box');
                if ($notificationBox.length <= 0) {
                    $notificationBox = $(context.$helper.parseTemplate('notificationBox'));
                    $notificationBox.appendTo('body');
                }

                var $notification = $(context.$helper.parseTemplate('notificationTypeDefault', {
                    status: status,
                    title: title,
                    content: content.replace(/\r?\n/gi, '<br />')
                }));
                var $real = $notification.clone();
                $notification.addClass('notification-empty');
                $notification.appendTo('.notification-box');
                $real.addClass('notification-real');
                var height = $notification.height();
                $notification.height(0);
                $notification.addClass('notification-anim');

                var _t = null;
                var removeProc = function removeProc() {
                    try {
                        clearTimeout(_t);
                    } catch (e) {
                        console.trace(e.stack);
                    }

                    $real.removeClass('notification-anim-start');
                    setTimeout(function () {
                        $real.stop().animate({
                            height: 0,
                            paddingTop: 0,
                            paddingBottom: 0
                        }, 300, function () {
                            $real.remove();
                        });
                    }, 300);
                };
                setTimeout(function () {
                    $notification.addClass('notification-anim-start').stop().animate({
                        height: height,
                        padding: '30px'
                    }, 300);
                    setTimeout(function () {
                        $notification.remove();
                        $real.appendTo($notificationBox);
                        setTimeout(function () {
                            var t = Math.min(Math.max(1000 / 10 * (title.length + content.length), 3000), 15000);
                            $real.find('.notification-bar').css({
                                transitionDuration: t + 'ms'
                            });
                            $real.addClass('notification-anim-start');
                            _t = setTimeout(removeProc, t);
                        }, 25);
                    }, 300);
                }, 25);

                context.$helper.bind($real.add($real.find('.notification-btn-ok, .notification-btn-cancel')), 'click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $this = $(this);
                    removeProc.call();
                });

                context.$helper.bind($real.add($real.find('.notification-btn-ok')), 'click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $this = $(this);
                    if (url !== null) {
                        location.href = url;
                    }
                });
            },
            template: {
                /* jshint ignore:start */
                /* @DATE 2016. 10. 04 */
                /* @USER Kenneth */
                /* @NOTE Template escaping. */
                notificationTypeDefault: '<div class="notification notification-{status}">\
                                            <div class="notification-bar"></div>\
                                            <div class="notification-content">\
                                                <h4 class="notification-header">{title}</h4>\
                                                <div class="notification-body">\
                                                    {content}\
                                                </div>\
                                            </div>\
                                            <div class="notification-btn-group">\
                                                <a href="#" class="notification-btn notification-btn-ok">\
                                                    <span class="notification-btn-inner">\
                                                        <i class="pe-7s-check"></i>\
                                                    </span>\
                                                </a>\
                                                <a href="#" class="notification-btn notification-btn-close">\
                                                    <span class="notification-btn-inner">\
                                                        <i class="pe-7s-close"></i>\
                                                    </span>\
                                                </a>\
                                            </div>\
                                        </div>',
                notificationBox: '<div class="notification-box"></div>'
                /* jshint ignore:end */
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/notification/index',['./core'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/ripple/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('ripple', {
            init: function init(element) {
                var context = this;
                var options = context.local._options;

                return element.each(function () {
                    var $child = $(this);

                    $child.addClass('btn-ripple');
                    if ($.inArray(options.theme, options.supportThemes) !== -1) {
                        $child.addClass('btn-ripple-' + options.theme);
                    }

                    context.$helper.bind($child, 'click', function (event) {
                        if (typeof event.originalEvent !== 'undefined' && options.passive === true) {
                            return false;
                        }

                        var $this = $(this);
                        if (!$this.hasClass('btn-ripple')) {
                            $child.addClass('btn-ripple');
                            if ($.inArray(options.theme, options.supportThemes) !== -1) {
                                $child.addClass('btn-ripple-' + options.theme);
                            }
                        }
                        var offset = this.getClientRects()[0] || { left: 0, top: 0 };
                        var $ripple = $(context.$helper.parseTemplate('effect'));
                        var size = Math.min($this.width(), $this.height());
                        var scale = Math.max($this.width(), $this.height()) / size * 2;
                        var point = {
                            x: 0,
                            y: 0
                        };

                        if (typeof event.x !== 'undefined' && typeof event.y !== 'undefined') {
                            point = {
                                x: event.x - size / 2,
                                y: event.y - size / 2
                            };
                        } else {
                            point = {
                                x: event.clientX - offset.left - size / 2,
                                y: event.clientY - offset.top - size / 2
                            };
                        }

                        if (options.over === true) {
                            $child.css({
                                overflow: 'visible'
                            });
                        }

                        $ripple.css({ width: size, height: size, left: point.x, top: point.y });
                        $ripple.appendTo($this);
                        $this.addClass('btn-ripple-start');
                        context.$helper.promise(function () {
                            $ripple.css({
                                transform: 'scale(' + scale + ')',
                                opacity: 1
                            });

                            context.$helper.promise(function () {
                                $ripple.addClass('anim-end').css({
                                    opacity: 0
                                });

                                context.$helper.promise(function () {
                                    $ripple.remove();
                                    $this.removeClass('btn-ripple-start');
                                }, 500);
                            }, 150);
                        }, 50);
                    });
                });
            },
            method: {
                start: function start(element, value) {
                    var context = this;

                    if (typeof value === 'undefined') {
                        value = {
                            x: element.width() / 2,
                            y: element.height() / 2
                        };
                    }

                    context.$helper.triggerHandler(element, 'click', value);
                }
            },
            template: {
                effect: '<div class="btn-ripple-effect"></div>'
            },
            options: {
                supportThemes: ['light', 'dark'],
                over: false,
                passive: false
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/ripple/hook',[],function () {
    (function (target, value) {
        this.ripple({
            theme: value
        });
    }).hook('ripple');
});
//# sourceMappingURL=hook.js.map
;


define('components/ripple/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/spinner/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('spinner', {
            init: function init(element) {
                var context = this;

                if (element.is('select') === false) {
                    return false;
                }

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
                $spinner.insertAfter(element);
                $spinner.ripple({
                    theme: 'dark'
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
                });

                context.$helper.bind($spinner, 'click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var $this = $(this);
                    var $scrollParent = $this.scrollParent();

                    context.$helper.triggerHandler(context.element.$document, 'click');
                    if ($this.hasClass('spinner-disabled') || $this.hasClass('spinner-readonly')) {
                        return false;
                    }
                    var $spinnerWrapper = $(context.$helper.parseTemplate('spinnerWrapper'));

                    console.log('test', element, element.find('option'), $spinner, context);
                    element.find('option').each(function () {
                        var $this = $(this);
                        var $option = $(context.$helper.parseTemplate('spinnerOptions', {
                            value: $this.val(),
                            option: $this.text(),
                            type: $this.prop('selected') === true && $this.text() !== '' ? 'selected' : 'default'
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

                    context.$helper.bind($scrollParent, 'scroll', function (event) {
                        context.$helper.triggerHandler(context.element.$window, 'resize');
                    });

                    context.$helper.bind(context.element.$window, 'resize', function () {
                        $spinnerWrapper.css({
                            top: $spinner.offset().top,
                            left: $spinner.offset().left + ($spinner.outerWidth() - $spinnerWrapper.outerWidth()) / 2
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
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/spinner/hook',[],function () {
    (function () {
        this.spinner();
    }).hook('spinner');
});
//# sourceMappingURL=hook.js.map
;


define('components/spinner/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/tab/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('tab, step', {
            init: function init(element) {
                var context = this;
                var _index = 0;
                var _length = 0;
                var $container = element.next();
                var id = context.local._id;

                _length = element.find('.' + id + '-item').length;
                if (element.hasClass(id) && $container.length > 0 && $container.hasClass(id + '-container')) {
                    element.unbind(id + '.next').bind(id + '.next', function () {
                        if (_index + 1 <= _length) {
                            context.$helper.triggerHandler(element.find('.' + id + '-item').eq(_index + 1), 'click');
                        } else {
                            return false;
                        }
                    });

                    element.unbind(id + '.prev').bind(id + '.prev', function () {
                        if (_index - 1 >= 0) {
                            context.$helper.triggerHandler(element.find('.' + id + '-item').eq(_index - 1), 'click');
                        } else {
                            return false;
                        }
                    });

                    element.unbind(id + '.move').bind(id + '.move', function (event, index) {
                        context.$helper.triggerHandler(element.find('.' + id + '-item').eq(index), 'click');
                    });

                    context.$helper.bind(element.find('.' + id + '-item'), 'click', function (event) {
                        event.preventDefault();
                        var $this = $(this);
                        var index = $this.index();
                        _index = index;
                        $this.addClass('active').siblings('.active').removeClass('active');
                        $container.find('.' + id + '-container-item').eq(index).addClass('active').siblings('.active').removeClass('active');

                        element.triggerHandler(id + '.move', {
                            index: _index,
                            length: _length,
                            header: element.find('.' + id + '-item')
                        });
                    });
                    context.$helper.triggerHandler(element.find('.' + id + '-item').eq(_index), 'click');
                } else {
                    context.$helper.log('Set <div class="' + id + '-container"></div> elements after <' + id + '> element for enable ' + id + ' component.');
                }
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/tab/hook',[],function () {
    (function () {
        this.tab();
    }).hook('tab');

    (function () {
        this.step();
    }).hook('step');
});
//# sourceMappingURL=hook.js.map
;


define('components/tab/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('components/toast/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('toast', {
            init: function init(message) {
                var context = this;

                if (typeof message === 'undefined') {
                    return false;
                } else if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
                    message = JSON.stringify(message);
                }

                var $toastBox = $('.toast-box');
                if ($toastBox.length <= 0) {
                    $toastBox = $(context.$helper.parseTemplate('toastBox'));
                    $toastBox.appendTo('body');
                    $toastBox.css({
                        marginLeft: -$toastBox.width() / 2
                    });
                }

                var $toast = $(context.$helper.parseTemplate('toast', {
                    message: message.replace(/\r?\n/gi, '<br />')
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
                        marginBottom: '1em'
                    }, 300);
                    $toast.height(height);
                    setTimeout(function () {
                        $toast.remove();
                        $real.appendTo($toastBox);
                        setTimeout(function () {
                            $real.addClass('toast-anim-start');
                            var t = Math.min(Math.max(1000 / 20 * message.length, 1500), 5000);
                            setTimeout(function () {
                                $real.removeClass('toast-anim-start');
                                setTimeout(function () {
                                    $real.remove();
                                }, 300);
                            }, t);
                        }, 25);
                    }, 300);
                }, 25);
            },
            template: {
                toast: '<div class="toast">{message}</div>',
                toastBox: '<div class="toast-box"></div>'
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/toast/index',['./core'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/toggle/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('toggle', {
            init: function init(element) {
                var context = this;
                var options = context.local._options;
                var idx = 0;
                var name = element.attr('name') || '';
                var type = element.attr('type') || 'chekcbox';

                var $toggle = $(context.$helper.parseTemplate('toggle'));
                if (element.closest('label').length < 1) {
                    element.wrap('<label></label>');
                }

                var regex = /input-(\w+)/gi;
                if (typeof element.attr('class') !== 'undefined' && element.attr('class').match(regex)) {
                    var matches = [];
                    var match = null;
                    var className = element.attr('class');

                    /* jshint ignore:start */
                    /* @DATE 2016. 12. 16 */
                    /* @USER Kenneth */
                    /* @NOTE Condition expression escaping. */
                    while (match = regex.exec(className)) {
                        matches.push(match[1]);
                    }
                    /* jshint ignore:end */

                    for (idx in matches) {
                        var word = matches[idx];
                        $toggle.addClass('works-' + word);
                    }
                }

                $toggle.find('.switch .switch-ball').ripple({
                    theme: 'dark',
                    over: true,
                    passive: true
                });
                $toggle.insertAfter(element);

                element.prependTo($toggle.find('.toggle'));

                context.$helper.bind($toggle.find('.toggle'), 'click', function (event) {
                    if (typeof event.namespace === 'undefined' && element.prop('checked') === true && element.attr('type') === 'radio') {
                        event.preventDefault();
                        element.prop('checked', false).triggerHandler('change');
                    }
                });

                context.$helper.bind(element, 'change', function (event, extra) {
                    context.$helper.triggerHandler(element, 'update');

                    if (typeof extra !== 'undefined' && typeof extra.init !== 'undefined' && extra.init === true) {
                        $toggle.find('.switch .switch-ball').ripple('start');
                    }
                }, true);

                context.$helper.bind(element, 'update', function (event, extra) {
                    if (element.prop('checked') === false) {
                        $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-left').addClass('toggle-label-active');
                    } else {
                        $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-right').addClass('toggle-label-active');
                    }

                    if (typeof extra !== 'undefined') {
                        $.extend(options, extra);
                    }

                    var placeholder_class = ['toggle-label-left', 'toggle-label-right'];
                    var placeholder_default = ['Off', 'On'];
                    for (idx in placeholder_class) {
                        if (typeof options.placeholder !== 'undefined' && options.placeholder !== null && typeof options.placeholder[idx] !== 'undefined' && options.placeholder[idx] !== '') {
                            $toggle.find('.' + placeholder_class[idx]).text(options.placeholder[idx]);
                        } else {
                            $toggle.find('.' + placeholder_class[idx]).text(placeholder_default[idx]);
                        }
                    }
                }, true);

                if (element.prop('checked') === false) {
                    $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-left').addClass('toggle-label-active');
                } else {
                    $toggle.find('.toggle-label').removeClass('toggle-label-active').filter('.toggle-label-right').addClass('toggle-label-active');
                }

                context.$helper.bind($toggle.find('input'), 'click', function (event) {
                    event.stopPropagation();
                });

                element.hide();
            },
            template: {
                toggle: '<span class="toggle-wrapper"><span class="toggle-label toggle-label-left">Off</span><label class="toggle"><span class="switch"><span class="switch-ball"></span><span class="switch-bg"></span></span></label><span class="toggle-label toggle-label-right">On</span></span>'
            },
            options: {
                placeholder: null
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/toggle/hook',[],function () {
    (function () {
        var placeholder = this.data('toggleplaceholder');
        try {
            if (typeof placeholder !== 'undefined' && placeholder !== null && placeholder !== '') {
                placeholder = placeholder.replace(/\'/gi, "\"");
                placeholder = JSON.parse(placeholder);
            } else {
                placeholder = null;
            }
        } catch (e) {
            placeholder = null;
            console.trace(e.stack);
        }

        this.toggle({
            placeholder: placeholder
        });
    }).hook('toggle');
});
//# sourceMappingURL=hook.js.map
;


define('components/toggle/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/tooltip/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('tooltip', {
            init: function init(element) {
                var context = this;
                var promise = null;
                var options = context.local._options;

                if (options.value === '') {
                    options.value = element.attr('title') || '';
                }

                element.addClass('works-tooltip-wrapper');

                var $tooltip = $(context.$helper.parseTemplate('tooltip', options));
                $tooltip.appendTo(element);

                context.$helper.bind(element, 'mouseover focus', function (event) {
                    $tooltip.addClass('anim-ready');

                    if (options.direction === 'left' || options.direction === 'right') {
                        $tooltip.css({
                            top: (element.outerHeight() - $tooltip.outerHeight()) / 2,
                            bottom: 'auto'
                        });
                    } else {
                        $tooltip.css({
                            left: (element.outerWidth() - $tooltip.outerWidth()) / 2,
                            right: 'auto'
                        });
                    }

                    context.$helper.invoke(promise);
                    promise = context.$helper.promise(function () {
                        $tooltip.addClass('anim-start');
                    }, 25);
                });

                context.$helper.bind(element, 'mouseout blur', function (event) {
                    $tooltip.removeClass('anim-start');
                    context.$helper.invoke(promise);
                    promise = context.$helper.promise(function () {
                        $tooltip.removeClass('anim-ready');
                    }, 25);
                });
            },
            template: {
                tooltip: '<div class="works-tooltip works-tooltip-{direction}">{value}<span class="works-tooltip-arrow"></span></div>'
            },
            options: {
                value: '',
                margin: 20,
                direction: 'left'
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/tooltip/hook',[],function () {
    (function (target, value) {
        var direction = this.data('tooltip-direction');

        this.tooltip({
            value: value,
            direction: direction
        });
    }).hook('tooltip');
});
//# sourceMappingURL=hook.js.map
;


define('components/tooltip/index',['./core', './hook'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/upload/core',['../../core/utils/data', '../../core/utils/helper', '../../core/utils/method', '../../core/models/index'], function (data, helper, method, model) {
    (function ($) {
        new method('upload', {
            init: function init(element) {
                var context = this;
                var options = context.local._options;

                element.bind('change', function () {
                    var $this = $(this);

                    if ($this.val() !== '') {
                        context.local._prototype.upload.apply(context, [].concat($this, options, Array.prototype.slice.call(arguments, 2)));
                    }
                });
            },
            method: {
                upload: function upload(element, options) {
                    var context = this;

                    var file = element[0].files[0];
                    var info = {
                        name: file.name,
                        size: file.size,
                        type: file.type.split('/')[file.type.split('/').length - 1],
                        exts: file.name.split('.')[file.name.split('.').length - 1]
                    };
                    var exts = {
                        txt: ['TXT', 'LOG'],
                        img: ['JPEG', 'JPG', 'JPE', 'PJPEG', 'PNG', 'GIF', 'BMP', 'RAW'],
                        doc: ['DOC', 'DOCX', 'PPT', 'PPTX', 'HWP', 'XLS', 'XLSX', 'PDF', 'CSV'],
                        flag: {
                            txt: 'Text',
                            img: 'Image',
                            doc: 'Doc',
                            spread: 'Spread'
                        },
                        dest: {
                            local: 'Local',
                            s3: 'AWSS3'
                        }
                    };

                    if (typeof options.type !== 'undefined' && options.type !== null) {
                        if ($.inArray(options.type, Object.keys(exts)) !== -1) {
                            if ($.inArray(info.type.toUpperCase(), exts[options.type]) !== -1) {
                                var idx = null;
                                if ($.inArray(info.exts.toUpperCase(), exts[options.type]) !== -1) {
                                    var form = new FormData();
                                    form.append('file', file, file.name);
                                    if (typeof options.type !== 'undefined' && options.type !== null) {
                                        form.append('type', exts.flag[options.type]);
                                    }

                                    if (typeof options.dest !== 'undefined' && options.dest !== null) {
                                        form.append('dest', exts.dest[options.dest]);
                                    }

                                    if (typeof options.data !== 'undefined') {
                                        for (idx in options.data) {
                                            form.append(idx, options.data[idx]);
                                        }
                                    }

                                    if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                        element.siblings('.btn').text('업로드 중').addClass('btn-default').removeClass('btn-success btn-danger');
                                    }

                                    if (typeof options.beforeStart === 'function') {
                                        options.beforeStart.apply(element, Array.prototype.slice.call(arguments));
                                    }

                                    if (typeof options.extensions !== 'undefined') {
                                        for (idx in options.extensions) {
                                            var item = options.extensions[idx];
                                            form.append(idx, item);
                                        }
                                    }

                                    $.ajax({
                                        url: options.url,
                                        data: form,
                                        type: 'POST',
                                        contentType: false,
                                        processData: false,
                                        mimeType: 'multipart/form-data',
                                        dataType: 'json',
                                        timeout: 30000,
                                        complete: options.complete,
                                        success: function success(data, status, xhr) {
                                            var result = data.data;

                                            if (data.code === 200) {
                                                element.val('');

                                                if (options.type === 'img') {
                                                    if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                                        element.siblings('.btn, img').remove();
                                                        element.before('<img src="' + result.data + '" />');
                                                    }
                                                } else {
                                                    if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                                        element.siblings('.btn').text('완료').removeClass('btn-default btn-danger').addClass('btn-success');
                                                    }
                                                }

                                                element.data('value', result.data);

                                                if (typeof options.success === 'function') {
                                                    options.success.apply(element, Array.prototype.slice.call(arguments));
                                                }
                                            } else {
                                                if (typeof result.msg !== 'undefined') {
                                                    toast(result.msg);
                                                }
                                            }
                                        },
                                        error: function error(xhr, status, _error) {
                                            toast('Unexpected error are occured when uploading.');
                                            if (typeof options.isBtn !== 'undefined' && options.isBtn === true) {
                                                element.siblings('.btn').text('Error').removeClass('btn-default btn-success').addClass('btn-danger');
                                            }
                                            if (typeof options.error === 'function') {
                                                options.error.apply(element, Array.prototype.slice.call(arguments));
                                            }
                                        }
                                    });
                                } else {
                                    toast('.' + info.exts + '은 업로드를 지원하는 확장자가 아닙니다.');
                                }
                            } else {
                                toast('.' + info.exts + '은 업로드를 지원하는 확장자가 아닙니다.');
                            }
                        } else {
                            toast(options.type + '은 허용하는 확장자 옵션 정의가 아닙니다.');
                        }
                    } else {
                        // Write some codes here.
                    }
                }
            }
        });
    })(jQuery);
});
//# sourceMappingURL=core.js.map
;


define('components/upload/index',['./core'], function () {});
//# sourceMappingURL=index.js.map
;


define('components/index',['./checkbox/index', './converter/index', './dropdown/index', './input/index', './menu/index', './modal/index', './notification/index', './ripple/index', './spinner/index', './tab/index', './toast/index', './toggle/index', './tooltip/index', './upload/index'], function () {});
//# sourceMappingURL=index.js.map
;


define('main',['core/utils/data', 'core/utils/helper', 'core/utils/method', 'core/utils/prototype', 'core/exts/index', 'components/index'], function () {});
//# sourceMappingURL=main.js.map
;
    return require('main');
}));

//# sourceMappingURL=homeworks.js.map