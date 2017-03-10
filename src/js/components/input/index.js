//==========================================================
//
// @ HOMEWORKS COMPONENT INPUT
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-02-01
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/input.html
//
//=========================================================

(function($) {
	new ComponentMethod('input', {
        init: function (element) {
            var context = this;
            var options = context.local._options;
            var $label = $(context.$helper.parseTemplate('label')).insertAfter(element);
			var $placeholder = $(context.$helper.parseTemplate('placeholder')).text(element.attr('placeholder') || element.attr('title'));
            var type = element.data('type') || ((typeof options !== 'undefined') ? options.type : '');
            var validation = false;
			var changeDetector = function() {
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
                minlen:  element.attr('minlen') || 0,
                maxlen:  element.attr('maxlen') || 10,
                numeric: element.attr('numeric') || false,
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
            validation: function (element, type) {
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
                        if (context.local.rule.notnull)
                        type = 'success';
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
}(jQuery));
