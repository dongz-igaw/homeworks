define(() => {
    (function (options) {
        this.dropdown(options);
    }).hook('dropdown', [
        'direction',
    ], {
        nativeElement: '<span></span>'
    });
});