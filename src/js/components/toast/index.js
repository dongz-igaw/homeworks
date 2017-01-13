//==========================================================
//
// @ HOMEWORKS COMPONENT TOAST
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-01-13                          
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/toast.html
//
//=========================================================

(function($) {
    new ComponentMethod('toast', {
        init: function (message) {
            var context = this;

            if (typeof message === 'undefined') {
                return false;
            } else if (typeof message === 'object') {
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
                    marginBottom: '1em',
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
}(jQuery));