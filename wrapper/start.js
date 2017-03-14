(function(root, factory) {
    if(typeof define !== 'undefined' && define.amd) {
        define(function() {
            factory();
        });
    } else if(typeof module === 'object') {
        module.exports = factory();
    } else {
        root.pignoseCalendar = factory();
    }
} (this, function () {