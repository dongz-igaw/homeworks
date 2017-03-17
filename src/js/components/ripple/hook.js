define(() => {
    (function (options) {
        this.ripple({
            theme: options.value || options.theme
        });
    }).hook('ripple', [
        'theme'
    ], {
        nativeElement: '<button class="btn btn-material"></button>'
    });
});