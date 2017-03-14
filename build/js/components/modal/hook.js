'use strict';

define(function () {
    (function (target) {
        this.bind('click', function (event) {
            event.preventDefault();
            target.modal('toggle');
        });
    }).hook('modal');
});
//# sourceMappingURL=hook.js.map
