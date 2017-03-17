define(() => {
    (function (options) {
        if (typeof options.value === 'string' && options.placeholder === null) {
            options.placeholder = options.value;
        }

        try {
            if (options.placeholder !== null && options.placeholder !== '') {
                options.placeholder = options.placeholder.replace(/\'/gi, "\"");
                options.placeholder = JSON.parse(options.placeholder);
            } else {
                options.placeholder = null;
            }
        } catch (e) {
            options.placeholder = null;
            console.trace(e.stack);
        }

        this.toggle(options);
    }).hook('toggle', [
        'placeholder'
    ], {
        nativeElement: '<input type="radio" class="input" value="" />'
    });
});