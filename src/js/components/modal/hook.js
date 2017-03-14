define(() => {
    (function (target) {
        this.bind('click', function (event) {
            event.preventDefault();
            target.modal('toggle');
        });
    }).hook('modal');
});