define([
    '../../core/utils/data',
    '../../core/utils/helper',
    '../../core/utils/method',
    '../../core/models/index'
], (data, helper, method, model) => {
    (function($) {
        new method('notification', {
            init: function (title, content, url, status) {
                var context = this;

                if (typeof url === 'undefined' || url === null || $.trim(url) === '') {
                    url = null;
                }

                status = status || 'primary';

                if (typeof title === 'undefined' || typeof content === 'undefined') {
                    return false;
                } else if (typeof content === 'object') {
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
                var removeProc = function () {
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
    }(jQuery));
});