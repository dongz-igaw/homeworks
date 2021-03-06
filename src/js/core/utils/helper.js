/**
 * A module representing a Helper.
 * @module core/utils/helper
 */
define(['../models/index'], (model) => {
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
    const Helper = function(context, data) {
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

        this.replaceElement = function(oldElement, replaceElement) {
            var newElement = $(replaceElement);
            var attrs = oldElement.prop('attributes');

            for (let idx in attrs) {
                let attr = attrs[idx];
                if (typeof attr === 'object' && typeof attr.name !== 'undefined') {
                    if(attr === 'class') {
                        newElement.addClass(attr.value);
                    } else {
                        newElement.attr(attr.name, attr.value);                        
                    }
                } else {
                    break;
                }
            }

            let html = oldElement.html();
            oldElement.replaceWith(newElement);

            if (typeof html !== 'undefined' && html !== '') {
                newElement.html(html);
            }

            return newElement;
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
                    if (typeof value === 'object') {
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
    };
    return Helper;
});