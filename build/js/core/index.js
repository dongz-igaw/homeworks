'use strict';

define(function () {
    window.HOMEWORKS_VERSION = '1.0.0.0';
    var HOMEWORKS_MODEL = {
        VERSION: '@@VERSION',
        PARAMS: {
            framework: 'homeworks',
            prefix: 'works'
        },
        PROMISES: {},
        GLOBAL: {}
    };

    if (VERSION.replace(/@/g, '') !== 'VERSION') {
        window.HOMEWORKS_VERSION = VERSION;
    }
});
//# sourceMappingURL=index.js.map
