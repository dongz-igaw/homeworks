'use strict';

define(function () {
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
