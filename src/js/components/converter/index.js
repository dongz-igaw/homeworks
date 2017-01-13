//==========================================================
//
// @ HOMEWORKS COMPONENT CONVERTER
// @ All Rights Reserved IGAWorks Inc.
//
//==========================================================
//
// @ UPDATE    2017-01-13                          
// @ AUTHOR    Kenneth
// @ SEE ALSO  https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/JAVASCRIPT/converter.html
//
//=========================================================

(function($) {
    new ComponentMethod('converter', {
        init: function (element) {
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

                            if (
                                $.inArray(event.keyCode, preventKeyCode) === -1 &&
                                ctrlLock === false &&
                                (
                                    typeof event.ctrlKey === 'undefined' ||
                                    event.ctrlKey === false
                                )
                            ) {
                                var selectPosition = 0;
                                var oldLength = $this[0].value.length;
                                if ($this[0].selectionStart || $this[0].selectionStart === 0) {
                                    selectPosition = $this[0].selectionStart;
                                } else if(document.selection && document.selection.createRange) {
                                    var ran = document.selection.createRange();
                                    ran.moveStart('character', -$this[0].value.length);
                                    selectPosition = ran.text.length;
                                }

                                var value = $this.val();
                                if (typeof value !== 'undefined' && value !== null) {
                                    value = (value.toString().split('.'))[0];
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
}(jQuery));