define(() => {
    (function () {
        this.input();
    }).hook('input', null, {
        nativeElement: '<input text="text" class="input" />'
    });
});