define(() => {
    (function (target) {
        var direction = this.data('direction');

        this.dropdown({
            target: target,
            direction: direction
        });
    }).hook('dropdown');
});