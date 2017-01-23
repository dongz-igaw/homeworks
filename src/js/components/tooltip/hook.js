//===========================
// TOOLTIP VIEW HOOK
//===========================
(function (target, value) {
	var direction = this.data('tooltip-direction');

    this.tooltip({
        value: value,
        direction: direction
    });
}).hook('tooltip');