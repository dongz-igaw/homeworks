define(['../models/index'], (model) => {
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
	                prefix: model.PARAMS.prefix,
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
});