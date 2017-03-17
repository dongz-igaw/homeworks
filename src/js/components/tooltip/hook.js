define(() => {
    (function (options) {
        this.tooltip({
            value: options.value,
            direction: options.direction
        });
    }).hook('tooltip', [
        'direction'
    ], {
        nativeElement: '<span></span>'
    });
});