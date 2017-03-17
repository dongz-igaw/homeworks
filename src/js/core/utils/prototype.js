define(['../models/index', './helper'], (model, helper) => {
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
    let deniedKeywords = [
        'target',
        'value'
    ];

	Function.prototype.hook = function (component, args, config) {
	    var context = this;

        config = config || {};

	    try {
	        jQuery(document).ready(function() {
	            var format = '{prefix}-{component}, [{component}], [data-{component}]';

	            jQuery(format.mapping({
	                prefix: model.PARAMS.prefix,
	                component: component
	            })).each(function () {
	                var element = $(this);
	                var target = element.attr('pen');
	                var value = element.attr(component);
                    var index;
                    var options;

                    if (typeof target === 'undefined' || target === 'null' || target === 'false' || target === '') {
                        if (element.data('pen') !== 'undefined') {
                            // # DEPRECATED START
                            // # SINCE v1.0.1
                            let deprecatedPen = element.data('pen');
                            if (typeof deprecatedPen !== 'undefined') {
                                target = deprecatedPen;
                                console.warn('`data-pen` attribute is deprecated usage, Use `pen` attribute.');
                            }
                            // # DEPRECATED END
                        } else {
                            target = null;
                        }
                    }

                    if (typeof value === 'undefined' || value === 'null' || value === 'false' || value === '') {
                        if (element.data(component) !== 'undefined') {
                            // # DEPRECATED START
                            // # SINCE v1.0.1
                            let deprecatedValue = element.data(component);
                            if (typeof deprecatedValue !== 'undefined') {
                                value = deprecatedValue;
                                console.warn('`data-' + component + '` attribute is deprecated usage, Use `' + component + '` attribute.');
                            }
                            // # DEPRECATED END
                        } else {
                            value = null;
                        }
                    }

                    if (typeof value === 'string') {
                        switch (value.toUpperCase()) {
                            case 'TRUE':
                                value = true;
                                break;
                            case 'FALSE':
                                value = false;
                                break;
                            case 'NULL':
                                value = null;
                                break;
                            case 'UNDEFINED':
                                value = null;
                                break;
                            case 'NAN':
                                value = NaN;
                                break;
                            case 'INFINITY':
                                value = Infinity;
                                break;
                        }
                    }

                    if (value === false)
                        return true;

                    options = {
                        target: $(target),
                        value: value
                    };

                    if (
                        typeof config.nativeElement === 'string' &&
                        element.is('{prefix}-{component}'.mapping({
                            prefix: model.PARAMS.prefix,
                            component: component
                        })) === true
                    ) {
                        element = (new helper()).replaceElement(element, config.nativeElement);
                    }

                    if (typeof args === 'object') {
                        for(let idx in args) {
                            let keywordIndex = deniedKeywords.indexOf(args[idx]);
                            if (keywordIndex !== -1) {
                                throw new Exception('The `' + deniedKeywords[keywordIndex] + '` is the reserved keyword, Please choose other keyword.');
                            } else {
                                options[args[idx]] = element.attr(args[idx]) || null;
                            }
                        }
                    }

	                if (typeof context === 'function') {
	                    context.call(element, options);
	                }
	            });

                if (typeof callback === 'function') {
                    callback.call();
                }
	        });
	    } catch (e) {
	        console.trace(e.stack);

            if (typeof callback === 'function') {
                callback(e);
            }
	    }
	};
});