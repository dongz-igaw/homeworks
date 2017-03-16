define(() => {
    window.HOMEWORKS_VERSION = '1.0.0';

    const HOMEWORKS_MODEL = {
        VERSION: '@@VERSION',
        PARAMS: {
            framework: 'homeworks',
            prefix: 'works',
        },
        PROMISE: {},
        GLOBAL: {}
    };

    if (HOMEWORKS_MODEL.VERSION.replace(/@/g, '') !== 'VERSION') {
        window.HOMEWORKS_VERSION = HOMEWORKS_MODEL.VERSION;
    }

    return HOMEWORKS_MODEL;
});