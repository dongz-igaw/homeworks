define(() => {
    (function (target, value) {
        this.ripple({
            theme: value
        });
    }).hook('ripple');
});