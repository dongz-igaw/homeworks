/**
 * A module representing a Data.
 * @module core/utils/data
 */
define(['../models/index', './helper'], (model, helper) => {
    /**
     * @constructor
     * @alias module:core/utils/data
     * @description HOMEWORKS COMPONENT Store constructor, It is separated by each COMPOENTS.
     * @see Refer an example document {@link https://kennethanceyer.gitbooks.io/homeworks-framework-wiki/content/DEVELOPMENT/ComponentData.html|here}.
     * @author Kenneth <kenneth@igaworks.com>
     * @param {Method} context - HOMEWORKS Method Context.
     * @param {string} id -  HOMEWORKS Component Unique ID
     * @returns {Data}
     */
    const Data = function(context, id) {
        /*=================================================
         *= NOTE - HOMEWORKS Compoent storagy variables region.
         *= DATE - 2016-01-19
         *================================================*/
        if (typeof model.GLOBAL[id] === 'undefined') {
            model.GLOBAL[id] = {};
        }

        /**
         * @member
         * @description Data's store variable, This is the heart of Data.
         * @property {Data} $self - Reference of Data (self).
         * @property {ComponentMethod} $super - Reference of ComponentMethod.
         * @property {ComponentHelper} $helper - Reference of ComponentHelper.
         * @property {Boolean} _init - If component already done initialize process, It will be true (This is prevent a duplication of initializing).
         * @property {Boolean} _anim - The logical variable of Component animating.
         * @property {Boolean} _bind - The logical variable of Component binding.
         * @property {Object} anim - Animation configuration object.
         * @property {String} framework - Framework full name.
         * @property {String} prefix - Framework short name for using set class name prefix of Component.
         * @property {String} id - An unique id of Component, It will be automatically setted in the process of ComponentMethod.
         * @property {Array<jQuery>} element - Quick reference of jQuery objects that refered frequently.
         * @property {Object} global - Global properties each of Components.
         */
        this.store = jQuery.extend(model.PARAMS, {
            $self: this,
            $super: context,
            $helper: null,
            _init: false,
            _anim: false,
            _bind: false,
            _debug: true,
            anim: {
                time: 300,
                effect: 'swing'
            },
            id: id,
            element: {
                $window: $(window),
                $document: $(document)
            },
            global: model[id] || {}
        });
        this.store.$helper = new helper(context, this.store);
    };
    return Data;
});