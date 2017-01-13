//===========================
// TOOLTIP VIEW HOOK
//===========================
(function (target, value) {
    this.tooltip({
        type: value
    });
}).hook('tooltip');