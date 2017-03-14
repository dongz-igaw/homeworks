'use strict';

define(function () {
    (function (target) {
        var direction = this.data('direction');

        this.dropdown({
            target: target,
            direction: direction
        });
    }).hook('dropdown');
});
//# sourceMappingURL=hook.js.map
