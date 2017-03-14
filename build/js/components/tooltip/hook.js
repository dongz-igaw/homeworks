'use strict';

define(function () {
    (function (target, value) {
        var direction = this.data('tooltip-direction');

        this.tooltip({
            value: value,
            direction: direction
        });
    }).hook('tooltip');
});
//# sourceMappingURL=hook.js.map
