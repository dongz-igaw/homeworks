define(() => {
    (function (options) {
        this.bind('click', function (event) {
            event.preventDefault();
            options.target.modal('toggle');
        });
    }).hook('modal');
});