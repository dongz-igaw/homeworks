define(() => {
    (function () {
        this.tab();
    }).hook('tab', null, {
        nativeElement: '<div></div>'
    });

    (function () {
        this.step();
    }).hook('step', {
        nativeElement: '<div></div>'
    });
});
